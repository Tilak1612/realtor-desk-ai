/**
 * Responsive and a11y sweep of the AUTHENTICATED /app screens.
 *
 * These routes sit behind ProtectedRoute + RequireBilling, so every existing
 * harness in this repo stops at the login redirect. That blind spot is why an
 * `aria-hidden={!open ? undefined : undefined}` -- a conditional with two
 * identical branches, so a no-op -- sat in the navigation sidebar unnoticed,
 * and why the /app/leads column header still carries a 4.42:1 pairing nothing
 * has ever measured.
 *
 * This does not bypass security. It runs against a LOCAL `vite preview` built
 * with a placeholder Supabase URL, injects a session into localStorage, and
 * intercepts the two calls that gate rendering. No real credentials, no real
 * data, nothing reaches a server -- RLS is not involved because there is no
 * server. What it renders is the client shell, which is exactly what a layout
 * and accessibility sweep needs.
 *
 *   bunx vite preview --port 4201 --strictPort &
 *   node scripts/verify-app-shell.mjs
 *
 * Fixtures are deliberately awkward: a very long name, a long email and a long
 * brokerage, because truncation and min-width:0 bugs only appear with content
 * that does not fit. Table data comes back EMPTY, so this also exercises the
 * empty states the brief asks for.
 */
import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://localhost:4201";
const WIDTHS = (process.env.WIDTHS || "320,375,390,430,768,820,1024,1280,1440,1920")
  .split(",")
  .map(Number);
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/app", "/app/leads", "/app/pipeline", "/app/inbox", "/app/reports", "/app/settings"];

const MIN_TAP = 24; // WCAG 2.5.8 AA. 44 is the AAA / comfortable target.
const MIN_CHARS = 120;

// Long, hostile-but-plausible values. Short fixtures hide exactly the bugs
// this sweep is looking for.
const PROFILE = {
  id: "00000000-0000-0000-0000-000000000000",
  full_name: "Alexandra Wentworth-Fitzgerald",
  company_name: "Wentworth Fitzgerald & Associates Real Estate Brokerage Ltd.",
  email: "alexandra.wentworth-fitzgerald@wentworthfitzgeraldassociates.ca",
  subscription_tier: "team",
  subscription_status: "active",
  is_demo: true,
  onboarding_completed: true,
  trial_ends_at: new Date(Date.now() + 6.048e8).toISOString(),
};

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

let problems = 0;
let notRendered = 0;
let checks = 0;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "no-preference",
    });

    await ctx.addInitScript((profile) => {
      const exp = Math.floor(Date.now() / 1000) + 86400;
      localStorage.setItem(
        "sb-placeholder-auth-token",
        JSON.stringify({
          access_token: "local-qa",
          token_type: "bearer",
          expires_in: 86400,
          expires_at: exp,
          refresh_token: "local-qa",
          user: {
            id: profile.id,
            aud: "authenticated",
            email: profile.email,
            app_metadata: {},
            user_metadata: {},
            created_at: new Date().toISOString(),
          },
        })
      );
    }, PROFILE);

    const page = await ctx.newPage();

    // ORDER MATTERS: Playwright matches route handlers in REVERSE registration
    // order, so the broad patterns must be registered FIRST or they swallow the
    // specific ones. Registering the catch-all last sent {} back for
    // check-subscription, `subscribed` came out undefined, and every route
    // bounced to /billing -- which looked like a working sweep of the wrong page.
    await page.route("**/rest/v1/**", (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: "[]" })
    );
    await page.route("**/functions/v1/**", (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: "{}" })
    );
    // RequireBilling waits on both of these; unanswered, it spins forever.
    await page.route("**/rest/v1/profiles**", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([PROFILE]),
      })
    );
    await page.route("**/functions/v1/check-subscription", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ subscribed: true, subscription_tier: "team" }),
      })
    );

    try {
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 });
    } catch {
      console.log(`  ERROR ${route} @${width}  navigation failed`);
      notRendered++;
      await ctx.close();
      continue;
    }
    await page.waitForTimeout(900);

    // A redirect to /billing or /login renders a real page with real content,
    // so the character guard alone would happily "pass" the wrong screen.
    const landed = await page.evaluate(() => location.pathname);
    if (landed !== route) {
      console.log(`  ERROR ${route} @${width}  redirected to ${landed} -- not measured`);
      notRendered++;
      await ctx.close();
      continue;
    }

    const chars = await page.evaluate(
      () => (document.body.innerText || "").replace(/\s+/g, " ").trim().length
    );
    // A page that never rendered has no overflow and no small tap targets, and
    // would otherwise score perfectly. Never report that as a pass.
    if (chars < MIN_CHARS) {
      const at = await page.evaluate(() => location.pathname);
      console.log(
        `  EMPTY ${route} @${width}  ${chars} chars at ${at} -- nothing checked`
      );
      notRendered++;
      await ctx.close();
      continue;
    }

    const result = await page.evaluate(
      ({ minTap }) => {
        const doc = document.documentElement;
        const vw = doc.clientWidth;
        const wide = [];
        if (doc.scrollWidth - vw > 1) {
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const over = Math.round(r.right - vw);
            if (over > 1) {
              wide.push({
                over,
                tag: el.tagName.toLowerCase(),
                cls: (el.className?.toString?.() || "").slice(0, 62),
                text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34),
              });
            }
          }
          wide.sort((a, b) => b.over - a.over);
        }

        const small = [];
        for (const el of document.querySelectorAll(
          "a[href], button, [role='button'], input:not([type='hidden']), select"
        )) {
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none") continue;
          const r = el.getBoundingClientRect();
          if (r.width <= 2 || r.height <= 2) continue; // sr-only
          // Judge the largest descendant box: an <a> wrapping a full-size
          // button collapses to line-height while the real target is fine.
          let w = r.width;
          let h = r.height;
          for (const d of el.querySelectorAll("*")) {
            const dr = d.getBoundingClientRect();
            if (dr.width > w) w = dr.width;
            if (dr.height > h) h = dr.height;
          }
          // A checkbox or radio with an associated label is activated by
          // clicking the label too, so the real target is the whole row, not
          // the 16px box the browser draws. Same rule as verify-responsive.mjs.
          const boxy =
            (el.tagName === "INPUT" && /^(checkbox|radio)$/i.test(el.getAttribute("type") || "")) ||
            /^(checkbox|radio)$/i.test(el.getAttribute("role") || "");
          if (boxy) {
            const lbl =
              el.closest("label") ||
              (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
            if (lbl) {
              const lr = lbl.getBoundingClientRect();
              if (lr.width > w) w = lr.width;
              if (lr.height > h) h = lr.height;
            }
          }
          // Radix renders a visually hidden <input> alongside its own control
          // for form compatibility. It is not the thing anyone clicks.
          const cs2 = getComputedStyle(el);
          if (
            el.getAttribute("aria-hidden") === "true" ||
            cs2.opacity === "0" ||
            cs2.pointerEvents === "none"
          ) {
            continue;
          }
          if (w < minTap || h < minTap) {
            small.push({
              tag: el.tagName.toLowerCase(),
              w: Math.round(w),
              h: Math.round(h),
              text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28),
              label: el.getAttribute("aria-label") || "",
            });
          }
        }
        return { overflowBy: doc.scrollWidth - vw, wide: wide.slice(0, 3), small: small.slice(0, 4) };
      },
      { minTap: MIN_TAP }
    );

    checks++;
    const bad = result.overflowBy > 1 || result.small.length > 0;
    if (!bad) {
      console.log(`  PASS  ${route} @${width}`);
    } else {
      problems++;
      console.log(`  FAIL  ${route} @${width}`);
      if (result.overflowBy > 1) {
        console.log(`          OVERFLOW by ${result.overflowBy}px`);
        for (const w of result.wide) {
          console.log(`            +${w.over}px <${w.tag}> "${w.text}" .${w.cls}`);
        }
      }
      for (const s of result.small) {
        console.log(
          `          TAP ${s.w}x${s.h} <${s.tag}> "${s.text || s.label}" (min ${MIN_TAP})`
        );
      }
    }
    await ctx.close();
  }
}

await browser.close();
console.log(
  `\n  ${checks} viewport check(s), ${problems} problem(s), ${notRendered} not rendered`
);
process.exit(problems || notRendered ? 1 : 0);
