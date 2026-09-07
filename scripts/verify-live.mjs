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
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const BASE = process.argv[2] ?? process.env.RD_BASE_URL ?? "https://www.realtordesk.ai";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "  PASS" : "  FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

/**
 * For assets that do not exist yet.
 *
 * A skip is NOT a pass. It is printed loudly, counted separately and listed
 * again in the summary, because the usual way verification coverage
 * disappears is a skip that nobody notices. These turn into real PASS/FAIL
 * the moment the asset lands -- no edit required.
 */
const skipped = [];
const skip = (name, why) => {
  skipped.push({ name, why });
  console.log(`  SKIP  ${name} — ${why}`);
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

    // Classify EVERY loaded image into exactly one bucket. The previous
    // version matched on a file extension, so the six images Vite inlines as
    // data: URIs matched nothing and were counted in no category at all --
    // invisible to the check. A raster accidentally inlined would have slipped
    // straight through. `unclassified` exists so that can never happen again:
    // the buckets are asserted to sum to the total.
    const classify = (src) => {
      if (src.startsWith("data:")) {
        const mime = (src.match(/^data:image\/([a-z+]+)/i) || [])[1]?.toLowerCase();
        // Inlined SVG is fine. Inlined RASTER is not -- it means an image
        // small enough to inline is still shipping as jpg/png.
        return mime === "svg+xml" ? "svg" : "unoptimised";
      }
      const ext = (src.match(/\.(avif|webp|jpe?g|png|svg)(?:$|[?#])/i) || [])[1]?.toLowerCase();
      if (ext === "avif") return "avif";
      if (ext === "svg") return "svg";
      if (ext) return "unoptimised";
      return "unclassified";
    };

    const buckets = { avif: 0, svg: 0, unoptimised: 0, unclassified: 0 };
    for (const i of loaded) buckets[classify(i.currentSrc)]++;

    return {
      total: document.images.length,
      loaded: loaded.length,
      ...buckets,
      broken: loaded.filter((i) => i.complete && i.naturalWidth === 0).length,
      missingAlt: [...document.images].filter((i) => !i.alt).length,
    };
  });
  const reconciles =
    imgStats.avif + imgStats.svg + imgStats.unoptimised + imgStats.unclassified ===
    imgStats.loaded;
  record(
    "lazy images load; every raster negotiates AVIF",
    imgStats.loaded > 0 &&
      imgStats.unoptimised === 0 &&
      imgStats.unclassified === 0 &&
      imgStats.broken === 0 &&
      reconciles,
    `${imgStats.loaded}/${imgStats.total} loaded — ${imgStats.avif} avif, ${imgStats.svg} svg, ` +
      `${imgStats.unoptimised} unoptimised, ${imgStats.unclassified} unclassified, ` +
      `${imgStats.broken} broken${reconciles ? "" : " — BUCKETS DO NOT SUM"}`
  );
  record("every image has alt text", imgStats.missingAlt === 0, `${imgStats.missingAlt} missing`);

  /* ── 5a-ii. responsive SOURCES, which is not the same as AVIF ────────── */
  //
  // The check above proves format negotiation: the browser picked AVIF over
  // JPEG. It says nothing about SIZE. A phone can be served a correctly-
  // negotiated AVIF that is still 1600px wide, which is most of the payload
  // saving thrown away, and the existing check would stay green throughout.
  //
  // Width descriptors and sizes are what make the browser choose by layout
  // width. Asserting "no source lacks descriptors" rather than a count means
  // adding an image without variants fails this instead of diluting it.
  const sizing = await res.evaluate(() => {
    let withW = 0;
    let withoutW = 0;
    let withSizes = 0;
    for (const source of document.querySelectorAll("picture source")) {
      const ss = source.getAttribute("srcset") || "";
      if (/\d+w/.test(ss)) withW++;
      else withoutW++;
      if (source.getAttribute("sizes")) withSizes++;
    }
    const imgs = [...document.images];
    return {
      withW,
      withoutW,
      withSizes,
      lazy: imgs.filter((i) => i.loading === "lazy").length,
      dimensioned: imgs.filter(
        (i) => i.getAttribute("width") && i.getAttribute("height")
      ).length,
      total: imgs.length,
    };
  });
  record(
    "images offer responsive sources, not just modern formats",
    sizing.withW > 0 && sizing.withoutW === 0 && sizing.withSizes === sizing.withW,
    `${sizing.withW} sources with width descriptors, ${sizing.withoutW} without, ` +
      `${sizing.withSizes} with sizes`
  );
  // width/height on every <img> is what reserves the box before the bytes
  // arrive. Without it the page reflows as each image lands, which is CLS.
  record(
    "every image is lazy and dimensioned",
    sizing.total > 0 &&
      sizing.lazy === sizing.total &&
      sizing.dimensioned === sizing.total,
    `${sizing.lazy}/${sizing.total} lazy, ${sizing.dimensioned}/${sizing.total} with width+height`
  );

  /* ── 5b. the auth forms are usable and labelled ─────────────────────────── */
  const auth = await ctx.newPage();
  await auth.goto(`${BASE}/signup`, { waitUntil: "networkidle" });
  await auth.waitForTimeout(800);
  const authCheck = await auth.evaluate(() => {
    const inputs = [...document.querySelectorAll("input")].filter(
      (i) => !["hidden", "checkbox"].includes(i.type)
    );
    // Every field needs a programmatic name. A placeholder is not a label:
    // it disappears on focus and is not announced by every screen reader.
    const unlabelled = inputs.filter((i) => {
      const byFor = i.id && document.querySelector(`label[for="${i.id}"]`);
      const wrapped = i.closest("label");
      return !byFor && !wrapped && !i.getAttribute("aria-label") && !i.getAttribute("aria-labelledby");
    });
    return {
      inputs: inputs.length,
      unlabelled: unlabelled.map((i) => i.name || i.type),
      submit: !!document.querySelector('button[type="submit"]'),
      autocomplete: inputs.filter((i) => i.getAttribute("autocomplete")).length,
    };
  });
  record(
    "signup fields are all labelled",
    authCheck.inputs > 0 && authCheck.unlabelled.length === 0,
    `${authCheck.inputs} fields, unlabelled: ${authCheck.unlabelled.join(", ") || "none"}`
  );
  record(
    "signup has a submit and autocomplete hints",
    authCheck.submit && authCheck.autocomplete > 0,
    `submit=${authCheck.submit}, ${authCheck.autocomplete} fields with autocomplete`
  );
  await auth.close();

  /* ── 5c. product screenshots, once they exist ───────────────────────────── */
  const shot = await page.evaluate(() => {
    // Structural, not a filename guess. A rename must not be able to
    // silently disable this check.
    const inFrame = [...document.images].filter((i) => i.closest("[data-device-frame]"));
    return inFrame.map((i) => ({
      src: i.currentSrc.split("/").pop(),
      fmt: (i.currentSrc.match(/\.(avif|webp|jpe?g|png)/i) || [])[1]?.toLowerCase(),
      hasDims: !!(i.getAttribute("width") && i.getAttribute("height")),
      alt: (i.alt || "").length,
      broken: i.complete && i.naturalWidth === 0,
      natural: `${i.naturalWidth}x${i.naturalHeight}`,
    }));
  });
  if (shot.length === 0) {
    skip(
      "product screenshots in device frames",
      "none on the page yet — run scripts/capture-screenshots.mjs (runbook 20)"
    );
  } else {
    const bad = shot.filter((i) => i.broken || !i.hasDims || i.alt < 10 || i.fmt !== "avif");
    record(
      "product screenshots in device frames",
      bad.length === 0,
      `${shot.length} found; ${bad.length ? JSON.stringify(bad[0]) : "all avif, sized, alt-texted, unbroken"}`
    );
  }

  /* ── 5d. video, once it exists ──────────────────────────────────────────── */
  const video = await page.evaluate(() => {
    return [...document.querySelectorAll("video")].map((v) => ({
      poster: !!v.getAttribute("poster"),
      muted: v.muted,
      playsInline: v.hasAttribute("playsinline"),
      loop: v.loop,
      preload: v.getAttribute("preload"),
      hidden: v.getAttribute("aria-hidden") === "true",
      sources: [...v.querySelectorAll("source")].map((sr) => sr.type),
    }));
  });
  if (video.length === 0) {
    skip("hero video is poster-backed and decorative", "no <video> on the page yet — Higgsfield assets not generated");
  } else {
    // A decorative background video with no poster shows a black rectangle
    // until the first frame decodes, and without muted+playsinline iOS
    // refuses to autoplay it at all.
    const bad = video.filter(
      (v) => !v.poster || !v.muted || !v.playsInline || !v.hidden || !v.sources.includes("video/webm")
    );
    record(
      "hero video is poster-backed and decorative",
      bad.length === 0,
      `${video.length} found; ${bad.length ? JSON.stringify(bad[0]) : "poster, muted, playsinline, aria-hidden, webm"}`
    );

    // And it must not be shipped to a phone.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    const onMobile = await page.evaluate(() => document.querySelectorAll("video").length);
    record("video is not served below 1024px", onMobile === 0, `${onMobile} <video> at 390px`);
    await page.setViewportSize({ width: 1440, height: 900 });
  }

  /* ── 5e. accessibility, in a browser that actually paints ───────────────── */
  //
  // The unit-test axe run has color-contrast DISABLED, because jsdom has no
  // layout and no paint -- every contrast result there would be a guess. That
  // means contrast has never been checked anywhere. Here it can be, because
  // this browser renders.
  const require = createRequire(import.meta.url);
  const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

  // Pulled from the live sitemap, not hardcoded.
  //
  // A fixed list goes stale the moment someone adds a page, and the new page
  // is then the one nobody checks. The sitemap is what the site already
  // publishes as its own index, so coverage extends itself.
  //
  // The blog sweep that found ~120 violations was a throwaway script. Folding
  // it in here is the point: today's 31/31 means nothing if nothing re-checks
  // it after the next content change.
  const sitemapPages = await (async () => {
    try {
      const res = await ctx.request.get(`${BASE}/sitemap.xml`);
      const xml = await res.text();
      return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((m) => m[1].replace(BASE, "").replace(/^https?:\/\/[^/]+/, ""))
        .filter((u) => u && !u.startsWith("/app"));
    } catch {
      return [];
    }
  })();

  // The hand-picked set stays as a floor: if the sitemap fetch fails or the
  // file is ever emptied, these are still checked rather than silently
  // reducing coverage to nothing.
  const CORE_PAGES = [
    "/",
    "/pricing",
    "/features",
    "/how-it-works",
    "/faq",
    "/contact",
    "/resources",
    "/login",
    "/signup",
    "/privacy-policy",
    "/terms-of-service",
  ];

  const A11Y_PAGES = [...new Set([...CORE_PAGES, ...sitemapPages])];
  const a11yFindings = [];
  const unreachable = [];

  for (const route of A11Y_PAGES) {
    const ap = await ctx.newPage();
    // A transient network error must not destroy the run. One
    // ERR_NETWORK_CHANGED partway through the sitemap sweep aborted the whole
    // verification and threw away nine passing checks -- a gate that any
    // flaky moment can kill is not a gate. One retry absorbs the blip; a
    // route that fails twice is recorded and the sweep continues, so a
    // genuinely unreachable page still surfaces as a finding.
    let reached = false;
    for (let attempt = 0; attempt < 2 && !reached; attempt++) {
      try {
        await ap.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
        reached = true;
      } catch (err) {
        if (attempt === 1) {
          unreachable.push(`${route} (${String(err).split("\n")[0].slice(0, 60)})`);
        }
      }
    }
    if (!reached) {
      await ap.close();
      continue;
    }
    // A fixed delay is a guess: animate-fade-in-up carries delays on top of
    // its duration, and axe scores whatever opacity it happens to find. That
    // produced four phantom contrast failures on /how-it-works at opacity
    // 0.92/0.62/0.41/0.17 which do not exist once the animation lands on 1.
    // Waiting on the animations themselves makes the measurement a property of
    // the page, not of the timing. Only finite animations are awaited -- an
    // infinite spinner never settles and would hang the sweep -- and the race
    // caps even those.
    await ap
      .evaluate(async () => {
        const finite = document.getAnimations().filter((a) => {
          const t = a.effect?.getTiming?.();
          return (t ? t.iterations : 1) !== Infinity;
        });
        await Promise.race([
          Promise.all(finite.map((a) => a.finished.catch(() => {}))),
          new Promise((r) => setTimeout(r, 2000)),
        ]);
      })
      .catch(() => {});
    await ap.waitForTimeout(300);
    await ap.addScriptTag({ content: AXE });
    const res = await ap.evaluate(async () => {
      // Serious and critical only. Minor and moderate on a real marketing
      // page are a backlog, not a deploy gate, and gating on them trains
      // people to skip the check.
      const r = await window.axe.run(document, {
        resultTypes: ["violations"],
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      });
      return r.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => `${v.id}(${v.impact}, ${v.nodes.length})`);
    });
    if (res.length) a11yFindings.push(`${route}: ${res.join(", ")}`);
    await ap.close();
  }

  record(
    "no serious or critical axe violations (desktop)",
    a11yFindings.length === 0,
    a11yFindings.join(" | ") || `${A11Y_PAGES.length} pages clean, contrast included`
  );

  /* ── 5f. the same sweep at 390px ────────────────────────────────────────── */
  //
  // Desktop-only accessibility testing misses the criteria that are specific
  // to small screens: reflow, and target size, which cannot fail at 1440 and
  // routinely does at 390 where controls sit closer together.
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobileFindings = [];

  // Mobile runs the CORE set only. The 390px-specific rules are layout and
  // target-size, which the core pages exercise; running 60+ pages twice
  // doubles the wall clock for very little extra signal.
  for (const route of CORE_PAGES) {
    const mp = await mobileCtx.newPage();
    // A transient network error must not destroy the run. One
    // ERR_NETWORK_CHANGED partway through the sitemap sweep aborted the whole
    // verification and threw away nine passing checks -- a gate that any
    // flaky moment can kill is not a gate. One retry absorbs the blip; a
    // route that fails twice is recorded and the sweep continues, so a
    // genuinely unreachable page still surfaces as a finding.
    let reached = false;
    for (let attempt = 0; attempt < 2 && !reached; attempt++) {
      try {
        await mp.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
        reached = true;
      } catch (err) {
        if (attempt === 1) {
          unreachable.push(`${route} (${String(err).split("\n")[0].slice(0, 60)})`);
        }
      }
    }
    if (!reached) {
      await mp.close();
      continue;
    }
    // Same animation settle as the desktop pass above: wait for finite
    // animations only, under a cap, so contrast is measured at rest.
    await mp
      .evaluate(async () => {
        const finite = document.getAnimations().filter((a) => {
          const t = a.effect?.getTiming?.();
          return (t ? t.iterations : 1) !== Infinity;
        });
        await Promise.race([
          Promise.all(finite.map((a) => a.finished.catch(() => {}))),
          new Promise((r) => setTimeout(r, 2000)),
        ]);
      })
      .catch(() => {});
    await mp.waitForTimeout(300);
    await mp.addScriptTag({ content: AXE });
    const res = await mp.evaluate(async () => {
      const r = await window.axe.run(document, {
        resultTypes: ["violations"],
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
      });
      return r.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => `${v.id}(${v.impact}, ${v.nodes.length})`);
    });
    if (res.length) mobileFindings.push(`${route}: ${res.join(", ")}`);
    await mp.close();
  }
  await mobileCtx.close();

  record(
    "no serious or critical axe violations (390px)",
    mobileFindings.length === 0,
    mobileFindings.join(" | ") || `${CORE_PAGES.length} core pages clean at 390px`
  );

  // A page that failed to load twice was skipped above rather than
  // crashing the run. It still has to be reported: silently sweeping
  // fewer pages is exactly how coverage disappears unnoticed.
  record(
    "every page in the sweep was reachable",
    unreachable.length === 0,
    unreachable.join(" | ") ||
      `${A11Y_PAGES.length + CORE_PAGES.length} navigations, no retries exhausted`
  );

  /* ── 5g. field performance on a mid-range phone ─────────────────────────── */
  //
  // The brief asks that animations stay smooth on normal mobile devices and
  // do not delay page loading. Until now that was an argument -- the CSS uses
  // only transform and opacity -- rather than a measurement.
  //
  // 4x CPU throttling approximates a mid-range Android. LCP is gated; CLS is
  // measured and REPORTED but not gated, for an honest reason: across nine
  // runs it read 0.000 eight times and 0.4718 once, and six further runs with
  // the observer installed from domcontentloaded could not reproduce it or
  // attribute it to any node. Gating on a figure I cannot reproduce would
  // produce a flaky check, and a flaky check gets ignored.
  const perfCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const perfPage = await perfCtx.newPage();
  const cdp = await perfCtx.newCDPSession(perfPage);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await perfPage.goto(BASE, { waitUntil: "load" });
  await perfPage.waitForTimeout(3500);

  const vitals = await perfPage.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;
        let longest = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) lcp = Math.round(e.startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) longest = Math.max(longest, Math.round(e.duration));
        }).observe({ type: "longtask", buffered: true });
        setTimeout(() => resolve({ lcp, cls: +cls.toFixed(4), longest }), 1200);
      })
  );
  await perfCtx.close();

  // 2500ms is the "good" LCP threshold. The main thread is what this gates:
  // a render-blocking regression or a newly-eager import shows up here long
  // before anyone notices it by eye.
  record(
    "mobile LCP within budget (4x CPU throttle)",
    vitals.lcp > 0 && vitals.lcp < 2500,
    `LCP ${vitals.lcp}ms, longest task ${vitals.longest}ms, CLS ${vitals.cls} (reported, not gated)`
  );

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

if (skipped.length) {
  console.log(`\n${skipped.length} check(s) skipped — the asset does not exist yet:`);
  for (const s of skipped) console.log(`  - ${s.name}: ${s.why}`);
  console.log(
    "\nThese become real checks automatically once the assets land. Nothing to edit."
  );
}

process.exit(failed.length === 0 ? 0 : 1);
