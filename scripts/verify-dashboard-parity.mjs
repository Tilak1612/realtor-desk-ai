/**
 * Feature parity across desktop, tablet and mobile for the signed-in app.
 *
 * The existing sweeps ask "does each width LOOK right" -- overflow, tap size,
 * contrast. None asks whether a phone user can reach the same things a desktop
 * user can. A control that is `hidden lg:flex` with no mobile equivalent passes
 * every layout check while quietly deleting a feature below 1024px.
 *
 * For every route and width this records every control a person can actually
 * reach: visible, not inside aria-hidden or inert, named, and including whatever
 * sits behind the mobile navigation toggle (it is opened and read). Controls are
 * keyed by role + accessible name, then desktop is diffed against tablet and
 * mobile. A desktop control missing at a smaller width is a FAIL.
 *
 * Same local-only setup as verify-app-shell.mjs: vite preview with placeholder
 * Supabase env, a session injected into localStorage, every request answered
 * locally. Nothing reaches a server. Leads come back as fixtures so row-level
 * actions render; everything else is empty, which also exercises empty states.
 *
 *   bunx vite preview --port 4201 --strictPort &
 *   node scripts/verify-dashboard-parity.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://localhost:4201";
const LEAD_ID = "11111111-1111-1111-1111-111111111111";

// Tablet gets two widths on purpose: 768 is portrait, 1024 landscape, and the
// rail/drawer switch sits at lg (1024) -- the exact boundary where a feature is
// most likely to fall between two layouts.
const SIZES = {
  desktop: { width: 1440, height: 900 },
  "tablet-landscape": { width: 1024, height: 768 },
  "tablet-portrait": { width: 820, height: 1180 },
  mobile: { width: 390, height: 844 },
};

const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/app", "/app/leads", `/app/leads/${LEAD_ID}`, "/app/pipeline",
      "/app/inbox", "/app/automation", "/app/reports", "/app/settings",
      "/tasks", "/calendar", "/properties", "/campaigns", "/market",
      "/dashboard/integrations", "/ai-assistant", "/billing",
    ];

const PROFILE = {
  id: "00000000-0000-0000-0000-000000000000",
  user_id: "00000000-0000-0000-0000-000000000000",
  full_name: "Alexandra Wentworth-Fitzgerald",
  company_name: "Wentworth Fitzgerald Real Estate Ltd.",
  email: "alexandra@example.com",
  subscription_tier: "team",
  subscription_status: "active",
  is_demo: true,
  onboarding_completed: true,
  trial_ends_at: new Date(Date.now() + 6.048e8).toISOString(),
};

const now = Date.now();
const CONTACTS = [
  ["Sarah", "Mitchell", "showing", 94, "EN"],
  ["Marc", "Lévesque", "qualified", 80, "FR"],
  ["Priya", "Raman", "contacted", 67, "EN"],
  ["Daniel", "Roy", "new", 45, "FR"],
].map(([first, last, stage, score, lang], i) => ({
  id: i === 0 ? LEAD_ID : `2222222${i}-2222-2222-2222-222222222222`,
  user_id: PROFILE.id,
  first_name: first,
  last_name: last,
  email: `${String(first).toLowerCase()}@example.com`,
  phone: "+1 780 555 01" + String(10 + i),
  ai_score: score,
  stage,
  source: "website",
  preferred_language: lang,
  language: lang,
  last_contact_date: new Date(now - i * 3.6e6).toISOString(),
  consent_date: new Date(now - 8.64e7).toISOString(),
  next_followup_date: null,
  created_at: new Date(now - 8.64e7 * (i + 1)).toISOString(),
  updated_at: new Date(now - i * 3.6e6).toISOString(),
  metadata: {
    city: "Edmonton",
    budgetCad: 650000 + i * 50000,
    // A listing on half the leads, so the check covers both the value and the
    // empty state -- and so a column that only exists at lg is caught.
    ...(i % 2 === 0 ? { listing: `${1200 + i} Jasper Ave NW` } : {}),
  },
  tags: [],
}));

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

/** In-page: every reachable control, keyed "role::name". */
function collect() {
  const SEL =
    'a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=switch], [role=checkbox], [role=combobox], [role=menuitem], [role=link], summary';

  const hiddenByAncestor = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (n.getAttribute?.("aria-hidden") === "true") return true;
      if (n.hasAttribute?.("inert")) return true;
    }
    return false;
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    }
    return true;
  };
  // Having a size is not the same as being on screen. Leads' Sort button was
  // squeezed to x=433 on a 390px phone and clipped by the app's
  // overflow-x:hidden: it had a bounding box, so an earlier version of this
  // check counted it as reachable. A control counts only if a person can get
  // it on screen -- inside the viewport, or inside a container that scrolls
  // sideways (the Pipeline board) -- and is not clipped out by an ancestor
  // that hides horizontal overflow.
  const reachableX = (el) => {
    const r = el.getBoundingClientRect();
    for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
      const ox = getComputedStyle(n).overflowX;
      if ((ox === "auto" || ox === "scroll") && n.scrollWidth > n.clientWidth + 1) return true;
      if (ox === "hidden" || ox === "clip") {
        const pr = n.getBoundingClientRect();
        if (r.left >= pr.right - 1 || r.right <= pr.left + 1) return false;
      }
    }
    return r.right > 1 && r.left < window.innerWidth - 1;
  };
  const nameOf = (el) => {
    const byLabelledby = el.getAttribute("aria-labelledby");
    if (byLabelledby) {
      const t = byLabelledby.split(/\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" ");
      if (t.trim()) return t;
    }
    if (el.getAttribute("aria-label")) return el.getAttribute("aria-label");
    if (el.id) {
      const lab = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (lab?.textContent?.trim()) return lab.textContent;
    }
    const wrap = el.closest("label");
    if (wrap?.textContent?.trim() && wrap !== el) return wrap.textContent;
    return el.textContent || el.getAttribute("placeholder") || el.getAttribute("title") || el.getAttribute("name") || "";
  };
  const roleOf = (el) =>
    el.getAttribute("role") ||
    (el.tagName === "A" ? "link" : el.tagName === "BUTTON" || el.tagName === "SUMMARY" ? "button" : el.tagName.toLowerCase() + (el.type ? ":" + el.type : ""));

  const out = new Map();
  for (const el of document.querySelectorAll(SEL)) {
    if (hiddenByAncestor(el) || !visible(el) || !reachableX(el)) continue;
    // Chat launcher and cookie banner are site chrome, not dashboard features.
    if (el.closest("[data-site-assistant], [data-cookie-banner]")) continue;
    // Relative times ("35s ago", "il y a 2 min") tick between one width's
    // read and the next, so the same control got a different key per width
    // and read as "missing". Only the lead touched seconds ago drifted, which
    // is what gave it away. Normalise before keying.
    const name = nameOf(el)
      .replace(/\s+/g, " ")
      // No leading \b: textContent runs adjacent nodes together, so the time
      // arrives glued to the avatar initials ("SM39s ago") with no boundary.
      .replace(/\d+\s?(s|sec|secs|m|min|mins|h|hr|hrs|d|w|mo)\b(\s*ago)?/gi, "<t>")
      .replace(/il y a\s+<t>|il y a\s+\d+\s*\S+/gi, "<t>")
      .replace(/just now|à l'instant/gi, "<t>")
      .trim()
      .slice(0, 80);
    const key = `${roleOf(el)}::${name || "(unnamed)"}`;
    const href = el.getAttribute("href");
    out.set(key, href || "");
  }
  const headings = [...document.querySelectorAll("h1,h2,h3")]
    .filter((h) => !hiddenByAncestor(h) && visible(h))
    .map((h) => `${h.tagName.toLowerCase()}::${h.textContent.replace(/\s+/g, " ").trim().slice(0, 80)}`);
  return { controls: [...out.entries()], headings, path: location.pathname, text: document.body.innerText };
}

async function inventory(route, sizeName) {
  const ctx = await browser.newContext({ viewport: SIZES[sizeName], reducedMotion: "reduce" });
  await ctx.addInitScript((p) => {
    const exp = Math.floor(Date.now() / 1000) + 86400;
    localStorage.setItem("sb-placeholder-auth-token", JSON.stringify({
      access_token: "local-qa", token_type: "bearer", expires_in: 86400, expires_at: exp,
      refresh_token: "local-qa",
      user: { id: p.id, aud: "authenticated", email: p.email, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() },
    }));
    // Consent already given, so the cookie banner does not sit over the page.
    localStorage.setItem("cookie-consent", JSON.stringify({ necessary: true, analytics: false, marketing: false, timestamp: Date.now() }));
    localStorage.setItem("i18nextLng", "en-CA");
  }, PROFILE);
  const page = await ctx.newPage();

  // Anything leaving localhost is irrelevant to layout and only slows the run:
  // fonts, analytics, the realtime socket. Registered first so the specific
  // Supabase handlers below take precedence.
  await page.route(/^(?!http:\/\/localhost)/, (r) => {
    const u = r.request().url();
    if (u.includes("placeholder.supabase.co")) return r.fallback();
    return r.abort();
  });
  // Broad first: Playwright matches handlers in REVERSE registration order.
  await page.route("**/rest/v1/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
  await page.route("**/functions/v1/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/auth/v1/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/rest/v1/contacts**", (r) => {
    const url = r.request().url();
    // [?&]id=eq. -- NOT a bare "id=eq.", which also matches "user_id=eq." in
    // the list query. That turned every list request into a by-id lookup for a
    // user id, returned nothing, and the Leads table rendered empty -- so the
    // row-level controls this sweep exists to compare were never on the page.
    const single = /[?&]id=eq\./.test(url);
    const rows = single ? CONTACTS.filter((c) => url.includes(c.id)) : CONTACTS;
    const accept = r.request().headers()["accept"] || "";
    const body = accept.includes("vnd.pgrst.object") ? JSON.stringify(rows[0] ?? null) : JSON.stringify(rows);
    r.fulfill({ status: 200, contentType: "application/json", body });
  });
  await page.route("**/rest/v1/profiles**", (r) => {
    const accept = r.request().headers()["accept"] || "";
    r.fulfill({ status: 200, contentType: "application/json",
      body: accept.includes("vnd.pgrst.object") ? JSON.stringify(PROFILE) : JSON.stringify([PROFILE]) });
  });
  await page.route("**/functions/v1/check-subscription", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ subscribed: true, subscription_tier: "team" }) }));

  // Not "networkidle": the Supabase realtime client retries its websocket
  // forever against the placeholder host, so the network never goes idle and
  // every load sat out the full timeout. Wait for the shell to paint instead.
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await page.waitForSelector("main, [role=main], h1", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);

  const first = await page.evaluate(collect);
  const merged = new Map(first.controls);
  const headings = [...first.headings];
  // Everything readable in ANY state reached below -- menu open, disclosure
  // open, thread revealed. Data counts as present if a person can get to it.
  let allText = first.text;

  // Whatever lives behind the mobile nav toggle is reachable -- open it and read.
  //
  // Match the OPEN button by its accessible name, and only when it is actually
  // on screen. Two earlier selectors each produced a false "navigation missing
  // on mobile": the first matched the Account menu; the second matched the
  // drawer's own Close button, which Playwright counts as :visible while the
  // drawer is translated off-screen. The click then failed silently and the
  // closed (inert) drawer was read as though it were open.
  const toggles = page.getByRole("button", { name: /^(open navigation|ouvrir la navigation|open menu)$/i });
  let toggle = null;
  for (const t of await toggles.all()) {
    const box = await t.boundingBox();
    if (box && box.x >= 0 && box.x < SIZES[sizeName].width && box.width > 0) { toggle = t; break; }
  }
  let drawerOpened = false;
  let drawerFailed = false;
  if (toggle) {
    await toggle.click();
    // Opened means the drawer is on screen and no longer inert -- checked,
    // not assumed.
    drawerOpened = await page
      .waitForFunction(() => {
        const d = document.querySelector("#rd-app-nav, #app-sidebar");
        if (!d || d.hasAttribute("inert")) return false;
        const r = d.getBoundingClientRect();
        return r.x >= -1 && r.width > 0;
      }, null, { timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (!drawerOpened) drawerFailed = true;
    await page.waitForTimeout(250);
    const second = await page.evaluate(collect);
    for (const [k, v] of second.controls) merged.set(k, v);
    // Headings too. Only merging controls made the legacy drawer's "Advanced"
    // section heading read as missing on every phone -- it was simply inside
    // the drawer, which the first read happens before opening.
    for (const h of second.headings) if (!headings.includes(h)) headings.push(h);
    allText += "\n" + second.text;
  }

  // Anything behind a collapsed disclosure is one tap away, and so reachable.
  // A narrow layout legitimately tucks things behind "Show filters"; what it
  // must not do is have NO way in. So open every collapsed toggle in the page
  // body (not the nav, handled above), read what appears, and close it again.
  // Only on sizes below desktop, where the question is being asked.
  if (sizeName !== "desktop") {
    if (drawerOpened) {
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(250);
    }
    const disclosures = page.locator(
      'main button[aria-expanded="false"][aria-controls]:visible'
    );
    const n = Math.min(await disclosures.count(), 8);
    for (let i = 0; i < n; i++) {
      const d = disclosures.nth(i);
      const box = await d.boundingBox().catch(() => null);
      if (!box || box.x < 0) continue;
      await d.click().catch(() => {});
      await page.waitForTimeout(300);
      const opened = await page.evaluate(collect);
      for (const [k, v] of opened.controls) merged.set(k, v);
      for (const h of opened.headings) if (!headings.includes(h)) headings.push(h);
      allText += "\n" + opened.text;
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(150);
    }

    // The same rule, generalised: a button that controls a region which is
    // currently hidden is a way into that region. Inbox on a phone shows the
    // conversation list, and a tapped row reveals the thread pane in its
    // place -- no aria-expanded involved. One click per distinct target.
    const targets = await page.evaluate(() => {
      const out = [];
      const seen = new Set();
      for (const b of document.querySelectorAll("main button[aria-controls]")) {
        const id = b.getAttribute("aria-controls");
        if (seen.has(id)) continue;
        const target = document.getElementById(id);
        const r = b.getBoundingClientRect();
        const btnVisible = r.width > 0 && r.height > 0 && r.right > 0 && r.left < innerWidth;
        const targetHidden = !target || target.getBoundingClientRect().width === 0 ||
          getComputedStyle(target).display === "none";
        if (btnVisible && targetHidden) {
          seen.add(id);
          out.push(id);
        }
      }
      return out;
    });
    for (const id of targets) {
      const btn = page.locator(`main button[aria-controls="${id}"]:visible`).first();
      await btn.click().catch(() => {});
      await page.waitForTimeout(350);
      const revealed = await page.evaluate(collect);
      for (const [k, v] of revealed.controls) merged.set(k, v);
      for (const h of revealed.headings) if (!headings.includes(h)) headings.push(h);
      allText += "\n" + revealed.text;
    }
  }

  await ctx.close();
  return { ...first, text: allText, controls: merged, headings, drawerOpened, drawerFailed };
}

// Controls whose presence legitimately depends on width: the drawer's own
// open/close buttons exist only where there is a drawer.
const WIDTH_SCOPED = [/^button::(Open|Close) navigation$/i, /^button::(Open|Close) menu$/i, /^button::Toggle (menu|navigation)$/i];
const scoped = (k) => WIDTH_SCOPED.some((re) => re.test(k));

let fails = 0;
let notRendered = 0;
const report = [];

for (const route of ROUTES) {
  const inv = {};
  for (const size of Object.keys(SIZES)) inv[size] = await inventory(route, size);

  const expectedPath = route;
  const landed = Object.entries(inv).filter(([, v]) => v.path !== expectedPath);
  if (landed.length) {
    notRendered++;
    console.log(`  SKIP  ${route}  redirected to ${landed.map(([s, v]) => `${s}:${v.path}`).join(", ")}`);
    continue;
  }

  const desk = inv.desktop.controls;
  const missing = {};
  for (const size of Object.keys(SIZES).filter((s) => s !== "desktop")) {
    const have = inv[size].controls;
    const gone = [...desk.keys()].filter((k) => !have.has(k) && !scoped(k));
    if (gone.length) missing[size] = gone;
  }
  const headGone = {};
  for (const size of Object.keys(SIZES).filter((s) => s !== "desktop")) {
    const g = inv.desktop.headings.filter((h) => !inv[size].headings.includes(h));
    if (g.length) headGone[size] = g;
  }

  const drawerFails = Object.entries(inv).filter(([, v]) => v.drawerFailed).map(([s]) => s);
  // DATA PARITY. Controls are half of it; the other half is whether a phone
  // user can READ what a desktop user can. The Leads Listing column was
  // hidden below lg with nothing in its place -- no control involved, so the
  // control diff alone could never have seen it. innerText omits
  // display:none, so this is what is actually on screen.
  const FIXTURE_TEXT = CONTACTS.flatMap((c) => [
    `${c.first_name} ${c.last_name}`,
    c.email,
    ...(c.metadata.listing ? [c.metadata.listing] : []),
  ]);
  const dataGone = {};
  for (const size of Object.keys(SIZES).filter((x) => x !== "desktop")) {
    const g = FIXTURE_TEXT.filter((t) => inv.desktop.text.includes(t) && !inv[size].text.includes(t));
    if (g.length) dataGone[size] = g;
  }

  const count = Object.fromEntries(Object.entries(inv).map(([s, v]) => [s, v.controls.size]));
  const ok = !drawerFails.length && !Object.keys(missing).length && !Object.keys(headGone).length && !Object.keys(dataGone).length;
  if (!ok) fails++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${route.padEnd(52)} controls d/tl/tp/m = ${count.desktop}/${count["tablet-landscape"]}/${count["tablet-portrait"]}/${count.mobile}${inv.mobile.drawerOpened ? "  (drawer opened + verified)" : ""}`);
  for (const s of drawerFails) console.log(`          DRAWER DID NOT OPEN at ${s}: the toggle was clicked and the navigation stayed hidden`);
  for (const [size, keys] of Object.entries(missing)) {
    for (const k of keys) console.log(`          missing on ${size.padEnd(16)} ${k}`);
  }
  for (const [size, ts] of Object.entries(dataGone)) {
    for (const t of ts) console.log(`          data gone on ${size.padEnd(16)} "${t}"`);
  }
  for (const [size, hs] of Object.entries(headGone)) {
    for (const h of hs) console.log(`          heading gone ${size.padEnd(16)} ${h}`);
  }
  report.push({ route, count, missing, headGone, dataGone });
}

await browser.close();
console.log(`\n  ${ROUTES.length} route(s), ${fails} with a feature missing below desktop, ${notRendered} not rendered`);
if (process.env.PARITY_JSON) {
  (await import("node:fs")).writeFileSync(process.env.PARITY_JSON, JSON.stringify(report, null, 2));
}
process.exit(fails || notRendered ? 1 : 0);
