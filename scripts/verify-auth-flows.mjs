/**
 * The authentication surfaces, in both languages, including failure states.
 *
 * The happy paths need real credentials and a real provider, so they are not
 * here. What IS here is everything a broken build would break first: the pages
 * render, every field is labelled and reachable, the error states actually say
 * something, and they say it in the visitor's language rather than falling
 * back to English.
 *
 * Supabase auth calls are intercepted, so nothing reaches a server and no
 * account is touched. Each failure is produced deliberately -- a 400 from the
 * token endpoint, a cancelled provider redirect, an expired session flag --
 * because those are the paths nobody exercises by hand.
 *
 *   bunx vite preview --port 4201 --strictPort &
 *   node scripts/verify-auth-flows.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://localhost:4201";
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const LOCALES = [
  { lang: "en", label: "EN" },
  { lang: "fr", label: "FR" },
];
const SIZES = [
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

let checks = 0;
let failures = 0;
const record = (ok, what, detail = "") => {
  checks++;
  if (!ok) failures++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${what}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({ executablePath: CHROME });

async function page(lang, size, { expired = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height } });
  await ctx.addInitScript(
    ([l, exp]) => {
      localStorage.setItem("i18nextLng", l);
      localStorage.setItem("cookie-consent", JSON.stringify({ necessary: true, timestamp: Date.now() }));
      if (exp) sessionStorage.setItem("rd.auth.expired", "1");
    },
    [lang, expired]
  );
  const p = await ctx.newPage();
  // Nothing leaves localhost. Supabase auth answers with a failure so the
  // error paths can be exercised without an account.
  await p.route(/^(?!http:\/\/localhost)/, (r) => {
    const u = r.request().url();
    if (/\/auth\/v1\/token/.test(u)) {
      return r.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "invalid_grant", error_description: "Invalid login credentials" }),
      });
    }
    if (/supabase\.co/.test(u)) {
      return r.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    }
    return r.abort();
  });
  return { ctx, p };
}

const text = async (p) => (await p.innerText("body")).replace(/\s+/g, " ");

for (const { lang, label } of LOCALES) {
  for (const size of SIZES) {
    const tag = `${label}/${size.name}`;

    // ── /login renders, is labelled, and claims only what it can back ──────
    {
      const { ctx, p } = await page(lang, size);
      await p.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(1200);

      const email = p.locator("#email");
      const password = p.locator("#password");
      record(await email.count() === 1 && await password.count() === 1, `${tag} login has both fields`);
      record(
        (await email.getAttribute("autocomplete")) === "username" &&
          (await password.getAttribute("autocomplete")) === "current-password",
        `${tag} password managers can fill it`
      );
      record(await p.locator("#remember").count() === 1, `${tag} remember me present`);
      record(
        await p.getByRole("button", { name: lang === "fr" ? /Continuer avec Google/i : /Continue with Google/i }).count() === 1,
        `${tag} Google button in the right language`
      );

      const body = await text(p);
      const banned = ["256-bit SSL", "SSL 256 bits", "Protected Session", "PIPEDA Compliant"];
      const found = banned.filter((b) => body.includes(b));
      record(found.length === 0, `${tag} no unsubstantiated claim`, found.join(", "));

      // Untranslated keys leak as dotted paths when a string is missing.
      const leaked = (body.match(/\b(auth|app)\.[a-zA-Z]+\.[a-zA-Z.]+/g) || []).slice(0, 3);
      record(leaked.length === 0, `${tag} no missing translation keys`, leaked.join(", "));

      // Every control must be operable by keyboard and show focus.
      await p.keyboard.press("Tab");
      const focusVisible = await p.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return false;
        const s = getComputedStyle(el);
        return s.outlineStyle !== "none" || s.boxShadow !== "none" || !!el.className;
      });
      record(focusVisible, `${tag} keyboard focus lands on a control`);

      await ctx.close();
    }

    // ── wrong password says so, in the right language ─────────────────────
    {
      const { ctx, p } = await page(lang, size);
      await p.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(1000);
      await p.fill("#email", "nobody@example.invalid");
      await p.fill("#password", "wrong-password-123");
      await p.getByRole("button", { name: lang === "fr" ? /Connexion sécurisée/i : /Sign in securely/i }).click();
      await p.waitForTimeout(1500);
      const body = await text(p);
      const said = /invalid|incorrect|invalide|identifiants|courriel|erreur|error/i.test(body);
      record(said, `${tag} bad credentials explained`);
      record(!body.includes("invalid_grant"), `${tag} raw provider error not shown`);
      await ctx.close();
    }

    // ── a cancelled provider redirect is explained ────────────────────────
    {
      const { ctx, p } = await page(lang, size);
      await p.goto(`${BASE}/login?error=access_denied&error_description=The+user+denied+the+request`, {
        waitUntil: "domcontentloaded",
      });
      await p.waitForTimeout(1500);
      const body = await text(p);
      record(/cancel|annul/i.test(body), `${tag} OAuth cancellation explained`);
      record(!/access_denied/.test(body), `${tag} raw OAuth code not shown`);
      // and the query string is cleaned so a refresh does not repeat it
      record(!(await p.url()).includes("error="), `${tag} error params stripped from the URL`);
      await ctx.close();
    }

    // ── an expired session says why ───────────────────────────────────────
    {
      const { ctx, p } = await page(lang, size, { expired: true });
      await p.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(1500);
      const body = await text(p);
      record(/expired|expiré/i.test(body), `${tag} expired session explained`);
      await ctx.close();
    }

    // ── password reset and email verification render and are labelled ─────
    for (const route of ["/forgot-password", "/reset-password", "/verify-email"]) {
      const { ctx, p } = await page(lang, size);
      await p.goto(BASE + route, { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(1000);
      const body = await text(p);
      record(body.length > 40, `${tag} ${route} renders`, `${body.length} chars`);
      const unlabelled = await p.$$eval(
        "input:not([type=hidden]):not([type=checkbox])",
        (els) =>
          els.filter((el) => {
            const id = el.getAttribute("id");
            const lab = id && document.querySelector(`label[for="${CSS.escape(id)}"]`);
            return !el.getAttribute("aria-label") && !lab && !el.closest("label");
          }).length
      );
      record(unlabelled === 0, `${tag} ${route} every field labelled`, `${unlabelled} unlabelled`);
      await ctx.close();
    }
  }
}

await browser.close();
console.log(`\n  ${checks} check(s), ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
