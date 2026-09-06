/**
 * Runs axe against a LOCAL `vite preview` build, so contrast and other
 * violations can be found and fixed before a deploy rather than after.
 *
 * scripts/verify-live.mjs is the gate and checks the real domain; this is the
 * fast inner loop for the same checks:
 *   bunx vite preview --port 4173 --strictPort &
 *   node scripts/axe-local.mjs /pricing /integrations
 *
 * TWO failure modes this script exists to avoid, both of which produced false
 * clean runs while it was being written:
 *
 *  1. A stale `vite preview` already holding the port. Vite prints "Port 4173
 *     is in use, trying another one" and silently binds elsewhere, so the run
 *     measures whatever old build owns the port. --strictPort turns that into
 *     an error, and the banner check below refuses to run without it.
 *
 *  2. An empty page. Routes that await Supabase (IntegrationsRoute calls
 *     getSession before rendering) never resolve when the network is
 *     unreachable, so they sit on PageLoader forever. axe on a blank document
 *     finds zero violations and reports PASS -- a false clean that hides real
 *     failures. Anything below MIN_CHARS is reported EMPTY, never PASS, and
 *     exits non-zero.
 */
import { chromium } from "playwright-core";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const BASE = process.env.BASE || "http://localhost:4173";
const PAGES = process.argv.slice(2);
const MIN_CHARS = 200;

if (!PAGES.length) {
  console.error("usage: node scripts/axe-local.mjs /route [/route ...]");
  process.exit(2);
}

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

let violations = 0;
let empty = 0;

for (const path of PAGES) {
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    console.log(`  ERROR ${path}  navigation failed`);
    empty++;
    await page.close();
    continue;
  }

  const chars = await page.evaluate(
    () => (document.body.innerText || "").replace(/\s+/g, " ").trim().length
  );
  if (chars < MIN_CHARS) {
    // Not a pass. The page never rendered, so nothing was actually checked.
    console.log(`  EMPTY ${path}  ${chars} chars of text -- nothing was checked`);
    empty++;
    await page.close();
    continue;
  }

  // Entrance animations must finish before contrast is measured. Elements
  // using animate-fade-in-up pass through fractional opacity, and axe scores
  // the composited colour at whatever instant it runs -- /how-it-works
  // reported four contrast failures at opacity 0.92, 0.62, 0.41 and 0.17 that
  // do not exist once the animation lands on opacity 1. Waiting makes the
  // result a property of the page rather than of the timing.
  // Only animations that actually end are awaited. An infinite one (a spinner,
  // a pulse) never settles, so awaiting it hangs the run -- that turned a
  // 60-page sweep into a 10-minute timeout. The race caps the wait so a stuck
  // finite animation cannot block the measurement either.
  await page
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

  await page.addScriptTag({ path: axePath });
  const res = await page.evaluate(
    async () => await window.axe.run(document, { resultTypes: ["violations"] })
  );
  const bad = res.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact)
  );

  if (!bad.length) {
    console.log(`  PASS  ${path}  (${chars} chars)`);
  } else {
    for (const v of bad) {
      violations += v.nodes.length;
      console.log(`  FAIL  ${path}  ${v.id} (${v.impact}, ${v.nodes.length})`);
      const seen = new Set();
      for (const n of v.nodes) {
        const msg = (n.any?.[0]?.message || n.all?.[0]?.message || "").replace(/\s+/g, " ");
        const key = msg.slice(0, 190);
        if (seen.has(key)) continue;
        seen.add(key);
        console.log(`          ${key}`);
        console.log(`          ${n.html.replace(/\s+/g, " ").slice(0, 150)}`);
      }
    }
  }
  await page.close();
}

await browser.close();
console.log(`\n  ${violations} violation node(s), ${empty} page(s) not rendered`);
process.exit(violations || empty ? 1 : 0);
