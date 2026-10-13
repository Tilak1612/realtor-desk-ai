/**
 * Before/after screenshots of /app (v1) and /app?v=2 (dashboard v2) at
 * desktop, tablet and phone widths, in English and French.
 *
 * Same local-only setup as verify-dashboard-parity.mjs: a `vite preview` built
 * with a placeholder Supabase URL, a session injected into localStorage, and
 * every request answered here. Nothing reaches a server and no real data is
 * used — the book below is fictional, shaped like a solo agent's week so the
 * queue, KPIs and cards all have something to show.
 *
 *   VITE_SUPABASE_URL=https://placeholder.supabase.co VITE_SUPABASE_PUBLISHABLE_KEY=x npx vite build
 *   npx vite preview --port 4201 --strictPort &
 *   node scripts/capture-dashboard-v2.mjs            # writes to ./screenshots/dashboard-v2/
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:4201";
const OUT = process.env.OUT || "screenshots/dashboard-v2";
const EXE = process.env.CHROMIUM || undefined;
fs.mkdirSync(OUT, { recursive: true });

const SIZES = { desktop: { width: 1440, height: 900 }, tablet: { width: 820, height: 1180 }, mobile: { width: 390, height: 844 } };
const USER = "00000000-0000-0000-0000-000000000000";
const PROFILE = {
  id: USER, full_name: "Maya Singh", company_name: "Singh Realty", email: "maya@example.com",
  subscription_tier: "agent", subscription_status: "active", is_demo: true, onboarding_completed: true,
  business_preferences: {}, trial_ends_at: new Date(Date.now() + 6.048e8).toISOString(),
};

const now = Date.now();
const H = 3_600_000, D = 86_400_000, M = 60_000;
const iso = (msAgo) => new Date(now - msAgo).toISOString();
const day = (offset) => { const d = new Date(now + offset * D); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
let n = 0;
const id = () => `aaaaaaaa-0000-4000-8000-${String(++n).padStart(12, "0")}`;
const C = (first, last, o = {}) => {
  const row = {
    id: id(), user_id: USER, first_name: first, last_name: last, email: `${first.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}@example.com`,
    phone: "416-555-01" + String(n).padStart(2, "0"), stage: "contacted", source: "Referral", preferred_language: "en",
    ai_score: 55, created_at: iso(40 * D), last_contact_date: iso(3 * D), next_followup_date: null, consent_date: iso(40 * D),
    casl_consent: true, consent_given: true, unsubscribed: false, budget: 650000, ...o,
  };
  // consent_date is the legal record and counts as consent on its own, so a
  // contact meant to have none must not carry one.
  if (!row.casl_consent && !row.consent_given) row.consent_date = null;
  row.metadata = { budgetCad: row.budget };
  return row;
};

const CONTACTS = [
  C("Émilie", "Tremblay", { preferred_language: "fr", stage: "offer", ai_score: 91, source: "Referral", budget: 749000 }),
  C("Daniel", "Okafor", { stage: "new", source: "Realtor.ca import", created_at: iso(70 * M), last_contact_date: null, ai_score: 84, casl_consent: false, consent_given: false, budget: 780000 }),
  C("Priya", "Nair", { stage: "showing", source: "Website form", next_followup_date: day(0), ai_score: 78, budget: 1150000 }),
  C("Marc-André", "Roy", { preferred_language: "fr", stage: "offer", next_followup_date: day(-2), ai_score: 88, source: "Open house", budget: 895000 }),
  C("Sarah", "Chen", { stage: "qualified", last_contact_date: iso(19 * D), ai_score: 82, source: "Ads", budget: 1400000 }),
  C("Jordan", "Blake", { stage: "contacted", ai_score: 80, source: "google_ads", budget: 650000 }),
  C("Lucas", "Bergeron", { preferred_language: "fr", stage: "contacted", ai_score: 74, source: "Open house", budget: 560000 }),
  C("Hannah", "Weiss", { stage: "qualified", last_contact_date: iso(31 * D), ai_score: 58, casl_consent: false, consent_given: false, source: "Open house", budget: 720000 }),
  C("Omar", "Haddad", { stage: "new", source: "Open house", created_at: iso(2 * D), last_contact_date: null, ai_score: 61, budget: 480000 }),
  C("Grace", "Liu", { stage: "showing", source: "Referral", ai_score: 70, budget: 990000 }),
  C("Noah", "Fraser", { stage: "won", source: "Referral", ai_score: 95, budget: 1080000 }),
  C("Chloé", "Gagnon", { preferred_language: "fr", stage: "won", source: "Open house", budget: 612000 }),
  C("Ethan", "Park", { stage: "lost", source: "Ads", budget: 500000 }),
  ...Array.from({ length: 14 }, (_, i) =>
    C(["Ava", "Liam", "Zoe", "Ben", "Mia", "Raj", "Ivy", "Sam", "Leo", "Nina", "Kai", "Rosa", "Tom", "Uma"][i], "Example", {
      stage: ["new", "contacted", "qualified", "contacted", "showing", "new", "contacted"][i % 7],
      source: ["Open house", "Referral", "Website form", "Realtor.ca import", "Ads", "crea_ddf", "facebook"][i % 7],
      created_at: iso((i % 3 === 0 ? 3 : 20 + i) * D), ai_score: 30 + i * 3, casl_consent: i % 4 !== 0, consent_given: i % 4 !== 0,
      preferred_language: i % 5 === 0 ? "fr" : "en", budget: 400000 + i * 45000,
    })
  ),
];
const byName = (f) => CONTACTS.find((c) => c.first_name === f).id;

const MESSAGES = [];
const msg = (lead, author, ago, body, lang = "EN") =>
  MESSAGES.push({ id: id(), user_id: USER, lead_id: lead, channel: "chat", author, author_name: author === "ai" ? "Desk AI" : author === "agent" ? "Maya" : "Lead", body, language: lang, sent_at: iso(ago) });
msg(byName("Émilie"), "lead", 22 * M, "Quand puis-je faire la vérification d’identité?", "FR");
msg(byName("Lucas"), "agent", 2 * D, "Merci d’être passé à la visite libre!", "FR");
msg(byName("Lucas"), "lead", 3 * H, "Oui, intéressé.", "FR");
// Six answered threads this week so the first-response median is measurable.
// Answered by the agent: the composer only ever posts agent-authored rows, and
// a fixture where "Desk AI" replies on its own would picture behaviour the
// product does not have. These leads are English-language contacts, so their
// threads stay in English in the French capture too — language is per contact.
[["Priya", 4], ["Jordan", 2], ["Grace", 9], ["Sarah", 6], ["Raj", 3], ["Mia", 12]].forEach(([f, mins], i) => {
  msg(byName(f), "lead", (i + 1) * D, "Is this still available?");
  msg(byName(f), "agent", (i + 1) * D - mins * M, "Yes — want to book a showing?");
});
// The task title is the agent's own text, so it follows the language they work in.
const TASK_TITLE = { en: "Send CMA for Leaside", fr: "Envoyer l’analyse comparative pour Leaside" };
const TASKS = (lang) => [{ id: id(), user_id: USER, contact_id: byName("Grace"), title: TASK_TITLE[lang], due_date: day(0), status: "pending", priority: "high" }];

const STRINGS = { en: "en-CA", fr: "fr-CA" };

async function shot(browser, route, size, lang, file) {
  const ctx = await browser.newContext({ viewport: SIZES[size], reducedMotion: "reduce", deviceScaleFactor: 1 });
  await ctx.addInitScript(([p, lng]) => {
    const exp = Math.floor(Date.now() / 1000) + 86400;
    // A JWT-shaped (unsigned) token: since MFA enforcement (#245) ProtectedRoute
    // decodes the access token for its assurance level, and a bare string makes
    // that throw, leaving "Checking your session" up forever. Nothing verifies
    // the signature locally; no server is involved.
    const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
    const jwt = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: p.id, aud: "authenticated", role: "authenticated", email: p.email, exp, aal: "aal1", amr: [{ method: "password", timestamp: exp - 86400 }], session_id: "local-qa" })}.local-qa`;
    localStorage.setItem("sb-placeholder-auth-token", JSON.stringify({
      access_token: jwt, token_type: "bearer", expires_in: 86400, expires_at: exp, refresh_token: "local-qa",
      user: { id: p.id, aud: "authenticated", email: p.email, app_metadata: {}, user_metadata: { full_name: p.full_name }, created_at: new Date().toISOString() },
    }));
    localStorage.setItem("cookie-consent", JSON.stringify({ necessary: true, analytics: false, marketing: false, timestamp: Date.now() }));
    localStorage.setItem("i18nextLng", lng);
    localStorage.removeItem("rd.dashboardV2");
  }, [PROFILE, STRINGS[lang]]);
  const page = await ctx.newPage();
  const json = (r, rows) => {
    const accept = r.request().headers()["accept"] || "";
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(accept.includes("vnd.pgrst.object") ? rows[0] ?? null : rows) });
  };
  await page.route(/^(?!http:\/\/(localhost|127\.0\.0\.1))/, (r) => (r.request().url().includes("placeholder.supabase.co") ? r.fallback() : r.abort()));
  await page.route("**/rest/v1/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
  await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  // getUser() must return the injected user, or the session check never settles.
  await page.route("**/auth/v1/**", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ id: USER, aud: "authenticated", role: "authenticated", email: PROFILE.email, app_metadata: {}, user_metadata: { full_name: PROFILE.full_name }, created_at: new Date().toISOString() }) }));
  await page.route("**/rest/v1/contacts**", (r) => {
    const url = r.request().url();
    json(r, /[?&]id=eq\./.test(url) ? CONTACTS.filter((c) => url.includes(c.id)) : CONTACTS);
  });
  // Honour author=in.(…) so the activity feed sees what production would send it.
  await page.route("**/rest/v1/conversation_messages**", (r) => {
    const m = decodeURIComponent(r.request().url()).match(/author=in\.\(([^)]*)\)/);
    const allowed = m ? m[1].split(",").map((x) => x.replace(/"/g, "")) : null;
    json(r, allowed ? MESSAGES.filter((x) => allowed.includes(x.author)) : MESSAGES);
  });
  const tasks = TASKS(lang);
  await page.route("**/rest/v1/tasks**", (r) => json(r, tasks));
  await page.route("**/rest/v1/profiles**", (r) => json(r, [PROFILE]));
  await page.route("**/functions/v1/check-subscription", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ subscribed: true, subscription_tier: "agent" }) }));

  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await page.waitForSelector("h1", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1800);
  const overflow = await page.evaluate(() => {
    const el = document.querySelector("main .overflow-y-auto") || document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  // The shell scrolls an inner region, not the page; expand it for a full capture.
  // Scoped to the shell's three scroll containers only: a blanket
  // .overflow-hidden rule would collapse empty bar tracks to 0px.
  await page.addStyleTag({ content: ".rd-reset.h-screen{height:auto!important;overflow:visible!important} .rd-reset.h-screen>main{overflow:visible!important} .rd-reset.h-screen>main>.overflow-y-auto{overflow:visible!important}" });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  await ctx.close();
  return overflow;
}

const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const results = [];
for (const size of Object.keys(SIZES)) {
  results.push([`before-${size}-en`, await shot(browser, "/app?v=1", size, "en", `before-${size}-en.png`)]);
  results.push([`after-${size}-en`, await shot(browser, "/app?v=2", size, "en", `after-${size}-en.png`)]);
  results.push([`after-${size}-fr`, await shot(browser, "/app?v=2", size, "fr", `after-${size}-fr.png`)]);
}
await browser.close();
for (const [name, overflow] of results) console.log(`${overflow > 0 ? "OVERFLOW" : "ok      "}  ${name}  horizontal overflow ${overflow}px`);
