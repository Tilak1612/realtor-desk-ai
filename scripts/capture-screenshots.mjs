/**
 * Captures real product screenshots for the marketing compositions.
 *
 * The marketing site must show the actual application, never a rendering of
 * what it might look like. These are taken from the running app signed in as
 * a demo tenant, at 2x, with the browser chrome excluded.
 *
 * Credentials come from the environment. They are NOT defaulted in this file:
 * a password committed to a script is a password in every clone, every fork
 * and every CI log that echoes its environment.
 *
 *   RD_DEMO_EMAIL=... RD_DEMO_PASSWORD=... node scripts/capture-screenshots.mjs
 *
 * The demo logins are listed in docs/PRODUCTION_RUNBOOK.md section 15.
 *
 * Drives the system Chrome through playwright-core, so no browser download is
 * needed. Override with CHROME_PATH if Chrome lives elsewhere.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.RD_BASE_URL ?? "https://www.realtordesk.ai";
const EMAIL = process.env.RD_DEMO_EMAIL;
const PASSWORD = process.env.RD_DEMO_PASSWORD;
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = join(process.cwd(), "src/assets/product");

if (!EMAIL || !PASSWORD) {
  console.error(
    "RD_DEMO_EMAIL and RD_DEMO_PASSWORD must be set. See PRODUCTION_RUNBOOK.md section 15."
  );
  process.exit(2);
}

/** Desktop and mobile are separate compositions, not one crop of the other. */
const SHOTS = [
  { name: "shot-dashboard-desktop", path: "/app",          w: 1440, h: 900 },
  { name: "shot-leads-desktop",     path: "/app/leads",    w: 1440, h: 900 },
  { name: "shot-pipeline-desktop",  path: "/app/pipeline", w: 1440, h: 900 },
  { name: "shot-inbox-desktop",     path: "/app/inbox",    w: 1440, h: 900 },
  { name: "shot-dashboard-mobile",  path: "/app",          w: 390,  h: 844 },
  { name: "shot-inbox-mobile",      path: "/app/inbox",    w: 390,  h: 844 },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

try {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    // 2x so the result is crisp on a retina display when scaled down into a
    // device frame. Anything less looks soft next to the vector UI around it.
    deviceScaleFactor: 2,
    // Screenshots are decoration in a marketing page; a reader who has asked
    // for less motion should not be shown a frame captured mid-animation.
    reducedMotion: "reduce",
    locale: "en-CA",
  });

  const page = await ctx.newPage();

  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.fill('input[type="email"], input[name="email"]', EMAIL);
  await page.fill('input[type="password"], input[name="password"]', PASSWORD);
  await Promise.all([
    page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 45_000 }),
    page.click('button[type="submit"]'),
  ]);
  console.log("signed in as", EMAIL);

  for (const shot of SHOTS) {
    await page.setViewportSize({ width: shot.w, height: shot.h });
    await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle" });

    // React Query resolves after networkidle in some cases; wait for real
    // content rather than a fixed sleep, so a slow query cannot be captured
    // as an empty state and shipped as a product screenshot.
    await page
      .waitForFunction(
        () => !/Loading|Chargement/i.test(document.body.innerText),
        { timeout: 20_000 }
      )
      .catch(() => console.warn(`  ${shot.name}: still showed a loading string`));

    const file = join(OUT, `${shot.name}.png`);
    await page.screenshot({ path: file, animations: "disabled" });
    console.log(`  wrote ${shot.name}.png  (${shot.w}x${shot.h} @2x)`);
  }
} finally {
  await browser.close();
}
