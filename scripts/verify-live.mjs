/**
 * Verifies the live marketing site in a browser that is actually rendering.
 *
 * Why this exists rather than doing it by hand: the in-app browser pane runs
 * with document.visibilityState === "hidden", and Chrome suspends both
 * IntersectionObserver delivery and lazy image loading for hidden documents.
 * A control observer with threshold 0 on a visibly-intersecting element fired
 * zero times there -- impossible in a visible page. So scroll-reveal and
 * lazy-loading could be confirmed present in the markup but never confirmed to
 * FIRE. Headless Chrome reports "visible" and does both.
 *
 * Public pages only. Nothing here signs in, so it needs no credentials.
 *
 *   node scripts/verify-live.mjs [baseUrl]
 *
 * Exits non-zero if any check fails, so it can gate a deploy.
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? process.env.RD_BASE_URL ?? "https://www.realtordesk.ai";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "  PASS" : "  FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  const failedRequests = [];
  // Analytics beacons are fire-and-forget: the browser aborts them on
  // teardown or navigation and that is the designed behaviour, not a defect.
  // Counting them turns a green run red for no reason and trains people to
  // ignore this check.
  const IGNORED_FAILURES = /google-analytics\.com|googletagmanager\.com|doubleclick|vercel\.com\/insights|speed-insights/i;
  page.on("requestfailed", (r) => {
    if (IGNORED_FAILURES.test(r.url())) return;
    failedRequests.push(`${r.url().slice(0, 90)} ${r.failure()?.errorText}`);
  });

  /* ── 1. the document is genuinely visible, or nothing below is meaningful ── */
  await page.goto(BASE, { waitUntil: "networkidle" });
  const visibility = await page.evaluate(() => document.visibilityState);
  record("document is visible", visibility === "visible", `visibilityState=${visibility}`);

  /* ── 2. scroll reveal actually fires ────────────────────────────────────── */
  const revealTotal = await page.locator(".rd-reveal").count();
  const hiddenBefore = await page.locator(".rd-reveal-hidden").count();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  const shownAfter = await page.locator(".rd-reveal-shown").count();
  record(
    "scroll reveal fires",
    revealTotal > 0 && shownAfter > 0,
    `${revealTotal} wrappers, ${hiddenBefore} hidden at top, ${shownAfter} shown after scroll`
  );

  /* ── 3. reduced motion suppresses the movement ──────────────────────────── */
  const reduced = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rPage = await reduced.newPage();
  await rPage.goto(BASE, { waitUntil: "networkidle" });
  await rPage.waitForTimeout(600);
  const transformUnderReduced = await rPage.evaluate(() => {
    const el = document.querySelector(".rd-reveal");
    return el ? getComputedStyle(el).transform : "no-element";
  });
  record(
    "reduced motion removes the transform",
    transformUnderReduced === "none" || transformUnderReduced === "matrix(1, 0, 0, 1, 0, 0)",
    `transform=${transformUnderReduced}`
  );
  await reduced.close();

  /* ── 4. hover state is real, not just present in the stylesheet ─────────── */
  const card = page.locator(".rd-card-lift").first();
  if ((await card.count()) > 0) {
    await card.scrollIntoViewIfNeeded();
    const before = await card.evaluate((el) => getComputedStyle(el).borderColor);
    await card.hover();
    await page.waitForTimeout(320);
    const after = await card.evaluate((el) => getComputedStyle(el).borderColor);
    record("hover changes the border", before !== after, `${before} -> ${after}`);
  } else {
    record("hover changes the border", false, "no .rd-card-lift found");
  }

  /* ── 4b. the featured pricing card lifts UP, not down ───────────────────── */
  const pricing = await ctx.newPage();
  await pricing.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
  await pricing.waitForTimeout(700);
  // Located by the resting offset it declares, not by badge copy. Matching on
  // text meant guessing the wording -- the badge reads "Most agents pick this",
  // not "Most popular" -- and a marketing edit would silently disable this
  // check rather than fail it.
  const featured = pricing.locator('.rd-card-lift[class*="--rd-lift-base"]').first();
  const featuredCount = await featured.count();
  if (featuredCount > 0) {
    await featured.scrollIntoViewIfNeeded();
    const yOf = (el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.m42;
    };
    const before = await featured.evaluate(yOf);
    await featured.hover();
    await pricing.waitForTimeout(320);
    const after = await featured.evaluate(yOf);
    // transform is a single property: a naive translate3d on hover REPLACES
    // the card's resting -0.5rem offset and drops it 6px instead of raising
    // it 2px. This asserts composition, not just that something moved.
    record(
      "featured pricing card lifts up, not down",
      after < before,
      `y ${before} -> ${after}`
    );
  } else {
    record("featured pricing card lifts up, not down", false, "no featured card found");
  }
  await pricing.close();

  /* ── 5. lazy images actually load once scrolled to ──────────────────────── */
  const res = await ctx.newPage();
  await res.goto(`${BASE}/resources`, { waitUntil: "networkidle" });
  await res.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await res.waitForTimeout(2500);
  const imgStats = await res.evaluate(() => {
    const loaded = [...document.images].filter((i) => i.currentSrc);
    const fmt = loaded.map((i) => (i.currentSrc.match(/\.(avif|webp|jpe?g|png)/i) || [])[1]?.toLowerCase());
    return {
      total: document.images.length,
      loaded: loaded.length,
      avif: fmt.filter((f) => f === "avif").length,
      broken: loaded.filter((i) => i.complete && i.naturalWidth === 0).length,
      missingAlt: [...document.images].filter((i) => !i.alt).length,
    };
  });
  record(
    "lazy images load and negotiate AVIF",
    imgStats.loaded > 0 && imgStats.avif === imgStats.loaded && imgStats.broken === 0,
    `${imgStats.loaded}/${imgStats.total} loaded, ${imgStats.avif} avif, ${imgStats.broken} broken`
  );
  record("every image has alt text", imgStats.missingAlt === 0, `${imgStats.missingAlt} missing`);

  /* ── 6. no horizontal overflow at any target width ──────────────────────── */
  const widths = [320, 375, 390, 430, 768, 1024, 1440, 1920];
  const overflow = [];
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(320);
    const d = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    if (d.scroll > d.client) overflow.push(`${w}px (+${d.scroll - d.client})`);
  }
  record("no horizontal overflow at any width", overflow.length === 0, overflow.join(", ") || "320-1920 clean");

  /* ── 7. console and network are clean ───────────────────────────────────── */
  const realErrors = consoleErrors.filter((e) => !/favicon|speed-insights/i.test(e));
  record("no console errors", realErrors.length === 0, realErrors.slice(0, 2).join(" | ") || "clean");
  record("no failed requests", failedRequests.length === 0, failedRequests.slice(0, 2).join(" | ") || "clean");
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);
