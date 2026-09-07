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
  // resultTypes:["violations"] discarded everything axe could not decide, and
  // that is where the worst bug of the audit was hiding. On /signup, axe put
  // 24 nodes in `incomplete` -- "background color could not be determined due
  // to a background image" -- and reported ZERO violations. Two of those nodes
  // were white text on a white background at 1.00:1 and 1.05:1. This harness
  // passed that page dozens of times.
  //
  // `incomplete` is not the same as a failure: axe is saying it could not
  // judge, not that the page is wrong. So it is counted and printed
  // separately rather than folded into the violation count. But it must never
  // be silently dropped again -- "axe found nothing" and "axe could not look"
  // are different sentences.
  const res = await page.evaluate(async () => await window.axe.run(document));
  const bad = res.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact)
  );
  const unknown = (res.incomplete || []).filter((v) => v.id === "color-contrast");
  const unknownNodes = unknown.reduce((n, v) => n + v.nodes.length, 0);

  // Reporting "axe could not judge" is not enough on its own -- it says where
  // to look, not what is wrong. So for the cases axe declines, compute the
  // ratio directly: walk ancestors to the first OPAQUE background and score
  // against it. That is what actually found white-on-white text at 1.00:1 on
  // /signup, on a page axe had reported clean dozens of times.
  //
  // Only genuinely opaque ancestors count. Guessing through a background image
  // is exactly what axe refuses to do, and it is right to refuse -- so an
  // element with no opaque ancestor is left alone rather than scored against a
  // background that might not be what is painted.
  const unreadable = await page.evaluate(() => {
    const lum = (rgb) => {
      const [r, g, b] = rgb.map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const nums = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    // Returns every colour the text might actually sit on, nearest first, or
    // null when the painted colour cannot be known.
    //
    // A gradient element has backgroundColor "rgba(0,0,0,0)" with the gradient
    // in backgroundImage. Walking past it and scoring against the page behind
    // reported white-on-navy CTA bands as white-on-white at 1.06:1 -- seven
    // false failures on correct code. A gradient is judged at its WORST stop
    // instead: every stop is a real background for part of the text.
    const candidateBgs = (el) => {
      let n = el;
      while (n) {
        const c = getComputedStyle(n);
        const img = c.backgroundImage;
        // An element whose background clips to its own text is painting the
        // GLYPHS, not a surface behind them. Treating that gradient as the
        // background compares the text to itself and yields exactly 1:1.
        const paintsItsOwnText =
          /text/.test(c.webkitBackgroundClip || "") ||
          /text/.test(c.backgroundClip || "");
        if (paintsItsOwnText) {
          n = n.parentElement;
          continue;
        }
        if (img && img !== "none") {
          const stops = [...img.matchAll(/rgba?\(([^)]+)\)/g)]
            .map((m) => m[1].split(",").map((v) => parseFloat(v)))
            .filter((v) => v.length >= 3 && (v.length < 4 || v[3] > 0.95))
            .map((v) => v.slice(0, 3));
          // A gradient of colours we can read: judge against all of them.
          if (stops.length && /gradient/i.test(img)) return stops;
          // An actual image (photo, SVG): the painted colour is unknowable,
          // which is precisely what axe refuses to guess at. Do not guess.
          return null;
        }
        const parts = nums(c.backgroundColor);
        const a = parts.length > 3 ? parts[3] : 1;
        if (parts.length >= 3 && a > 0.95) return [parts.slice(0, 3)];
        n = n.parentElement;
      }
      return null;
    };
    const out = [];
    for (const el of document.querySelectorAll(
      "h1,h2,h3,h4,h5,h6,p,span,a,li,label,button,td,th,div"
    )) {
      const text = (el.textContent || "").trim();
      if (!text || text.length < 3) continue;
      // Only elements that own their text, not containers of other elements.
      const ownText = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 2
      );
      if (!ownText) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (parseFloat(cs.opacity) < 0.1) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const bgs = candidateBgs(el);
      if (!bgs || !bgs.length) continue;
      // Gradient text: `background-clip:text` with a transparent fill paints
      // the element's OWN background through the glyphs, so computed `color`
      // is rgba(0,0,0,0). Scoring that literally reports 1.32:1 on text that
      // renders perfectly -- the naive-scanner mistake. Read the painted
      // colour from the element's own gradient instead, worst stop first.
      let fg = nums(cs.color).slice(0, 3);
      const fillAlpha = nums(cs.color)[3];
      const clipsToText =
        /text/.test(cs.webkitBackgroundClip || "") ||
        /text/.test(cs.backgroundClip || "");
      if (fillAlpha === 0 || (clipsToText && fillAlpha !== undefined && fillAlpha < 0.05)) {
        const own = [...(cs.backgroundImage || "").matchAll(/rgba?\(([^)]+)\)/g)]
          .map((m) => m[1].split(",").map((v) => parseFloat(v)))
          .filter((v) => v.length >= 3)
          .map((v) => v.slice(0, 3));
        if (!own.length) continue; // genuinely invisible-by-design; not ours to judge
        // Darkest stop is the worst case against a light surface.
        fg = own.reduce((a, b) => (lum(a) < lum(b) ? a : b));
      }
      if (fg.length < 3) continue;
      const l1 = lum(fg);
      // Worst stop wins: a fade is only as readable as its weakest point.
      let ratio = Infinity;
      let bg = bgs[0];
      for (const cand of bgs) {
        const l2 = lum(cand);
        const r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        if (r < ratio) {
          ratio = r;
          bg = cand;
        }
      }
      const size = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const large = size >= 24 || (bold && size >= 18.66);
      const need = large ? 3 : 4.5;
      if (ratio < need) {
        out.push({
          ratio: Math.round(ratio * 100) / 100,
          need,
          text: text.replace(/\s+/g, " ").slice(0, 44),
          fg: cs.color,
          bg: `rgb(${bg.join(", ")})`,
          tag: el.tagName.toLowerCase(),
        });
      }
    }
    return out.sort((a, b) => a.ratio - b.ratio).slice(0, 8);
  });

  if (unreadable.length) {
    violations += unreadable.length;
    console.log(
      `  FAIL  ${path}  computed-contrast (${unreadable.length}) -- axe could not judge these`
    );
    for (const u of unreadable) {
      console.log(
        `          ${u.ratio}:1 (needs ${u.need}) <${u.tag}> "${u.text}"`
      );
      console.log(`          fg=${u.fg} on bg=${u.bg}`);
    }
  } else if (unknownNodes) {
    console.log(
      `  CHECK ${path}  ${unknownNodes} node(s) axe could not judge; all clear when computed directly`
    );
  }

  // PASS requires BOTH checks to be clean. Gating it on axe alone printed
  // "FAIL ... computed-contrast" and "PASS" for the same page.
  if (!bad.length && !unreadable.length) {
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
