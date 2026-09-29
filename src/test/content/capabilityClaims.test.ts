import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * The marketing site may not advertise a capability the product does not have.
 *
 * Each rule below pairs a phrase that appeared on a live page with the check
 * that proved it false. They are written as "this claim is only allowed while
 * that code exists", so the day a feature actually ships, the guard for it
 * fails and points at the copy that should now be allowed back.
 *
 * What was found on 2026-09-15, in production:
 *
 *   - "Realtor Desk answers every lead the instant they land" (home hero) and
 *     "Time to first AI response: 5 minutes" (home comparison). Nothing in the
 *     repo calls the run-automation edge function, and cron.job on the live
 *     project holds exactly two entries -- lifecycle emails and an integration
 *     health check. There is no automatic first response to time.
 *   - "Answers MLS questions ... books showings straight into your calendar."
 *     ai-chatbot/index.ts sends a hardcoded system prompt to Gemini with no
 *     tool definitions, behind an authenticated user lookup. It cannot read a
 *     board or write a calendar, and it never talks to a lead.
 *   - "CREA DDF sync -- live MLS listings, 15-minute refresh" (/features) and
 *     CREA DDF® as a bare wordmark in the home logo strip. crea-ddf-sync is
 *     marked "SCAFFOLD ... waiting for CREA DDF API credentials"; the rest of
 *     the site says Q3 2026.
 *   - "Drip templates written for Canadian markets -- Toronto pre-construction,
 *     Calgary first-time buyers, Montreal relocs." email-automation holds four
 *     generic templates: welcome, nurture, follow_up, property_alert.
 *   - "Round-robin by geography, language, or listing type", "Team lead, agent,
 *     assistant, brokerage admin", "Immutable. Exportable for compliance."
 *     No routing code, app_role is ENUM ('admin','user'), no audit table.
 *   - "Website chat widget -- drop-in script." No embeddable script is served.
 *   - "CRM since 2020", beside a hero badge reading "Now in public beta".
 */

const ROOT = join(__dirname, "..", "..", "..");
const i18n = readFileSync(join(ROOT, "src/i18n/config.ts"), "utf8");
const home = readFileSync(join(ROOT, "src/pages/rd/Home.tsx"), "utf8");
const features = readFileSync(join(ROOT, "src/pages/rd/Features.tsx"), "utf8");
const integrationHub = readFileSync(join(ROOT, "src/pages/IntegrationHub.tsx"), "utf8");
/**
 * Comments are not copy. Stripping them matters: the note in Home.tsx saying
 * why "Time to first AI response" was deleted contains the phrase itself, and
 * a naive scan reads the tombstone as the body.
 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/**
 * Every occurrence of an i18n namespace, EN and FR, as one string.
 *
 * Scoped on purpose. /roadmap and the blog legitimately discuss features we
 * have not built -- that is what a roadmap is for -- so scanning the whole
 * bundle would flag the roadmap entry that says we still need to "wire
 * /automations to a real sequence runner", which is the honest note, not the
 * lie. These four namespaces are the ones a buyer reads on the way to paying.
 */
function ns(name: string): string {
  let out = "";
  const re = new RegExp(`\\b${name}: \\{`, "g");
  for (const m of i18n.matchAll(re)) {
    let i = m.index! + m[0].length;
    let depth = 1;
    while (depth > 0 && i < i18n.length) {
      if (i18n[i] === "{") depth++;
      else if (i18n[i] === "}") depth--;
      i++;
    }
    out += i18n.slice(m.index!, i) + "\n";
  }
  return out;
}

/**
 * The comparison pages are buyer-path copy too, and carried the same claims:
 * a "24/7 AI Chatbot" tick against every competitor, "books showings", a
 * "Market Intelligence" row with no forecasting behind it, and on /vs/ixact a
 * headline ("Advanced AI for the Price of Basic CRM") that argued the opposite
 * of the price card directly beneath it, $149 against $46.75.
 */
const COMPARISON_PAGES = [
  "VsIxact",
  "VsBoldTrail",
  "VsLofty",
  "VsWiseAgent",
  "LoftyAlternative",
  "SwitchFromLionDesk",
  "AIPoweredCRM",
];
const comparisons = COMPARISON_PAGES.map((n) =>
  stripComments(readFileSync(join(ROOT, `src/pages/${n}.tsx`), "utf8"))
).join("\n");

const marketing =
  ns("landing") +
  ns("featuresRd") +
  ns("pricingRd") +
  ns("aside") +
  stripComments(home) +
  stripComments(features) +
  comparisons;

/** True while the named edge function is actually CALLED from somewhere. */
function isInvoked(fn: string): boolean {
  // Match an INVOCATION, not the name. Prose about why nothing calls a function
  // contains the slug too, and a tombstone comment must not read as a caller.
  const call = new RegExp(`invoke\\(\\s*["'\`]${fn}|/functions/v1/${fn}`);
  const roots = ["src", "supabase/functions", "supabase/migrations"]
    .map((d) => join(ROOT, d))
    .filter(existsSync);

  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((e) => {
      const full = join(dir, e);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });

  return roots
    .flatMap(walk)
    .filter((f) => /\.(tsx?|sql)$/.test(f) && !f.includes(`functions/${fn}/`))
    .some((f) => call.test(readFileSync(f, "utf8")));
}

describe("capability claims", () => {
  it("does not promise an automatic reply to inbound leads", () => {
    // Guard the promise, not the wording: any of these would reintroduce it.
    for (const phrase of [
      "answers every lead",
      "répond à chaque prospect dès",
      "time to first AI response",
      "instant they land",
    ]) {
      expect(marketing.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
    // And the reason it is not allowed: nothing runs the sequences.
    expect(isInvoked("run-automation")).toBe(false);
  });

  it("does not claim the assistant reads MLS or writes to a calendar", () => {
    for (const phrase of [
      "answers MLS questions",
      "books showings straight into your calendar",
      "books showings into your calendar",
      "Books into Google/Outlook",
      "réserve les visites dans votre calendrier",
    ]) {
      expect(marketing).not.toContain(phrase);
    }
    const chatbot = readFileSync(
      join(ROOT, "supabase/functions/ai-chatbot/index.ts"),
      "utf8"
    );
    // A tool-less chat completion cannot book anything.
    expect(chatbot).not.toContain('"tools"');
    expect(chatbot).not.toContain("tool_calls");
  });

  it("never presents CREA DDF as shipped", () => {
    const sync = readFileSync(
      join(ROOT, "supabase/functions/crea-ddf-sync/index.ts"),
      "utf8"
    );
    expect(sync).toContain("SCAFFOLD");

    // The home logo strip is the specific place it read as live: a bare
    // wordmark among working integrations, with no date and no qualifier.
    const logos = /const logos = \[([^\]]*)\]/.exec(home);
    expect(logos, "home trust strip logo list").toBeTruthy();
    expect(logos![1]).not.toMatch(/DDF|CREA/i);

    // The name may appear as a heading or a table label. What may not appear
    // is a sentence saying the feed DOES something, with no date on it.
    // A card TITLE is exempt: the roadmap group carries its badge structurally
    // (asserted below) and the date lives in the body beneath it. Everything
    // that is not a title has to say when.
    const asserts = /(?<!Title: )"[^"\n]*(?:CREA DDF|SDD®? de l'ACI)[^"\n]*(?:sync|live|pull|refresh|import|feed|synchronis|flux)[^"\n]*"/gi;
    for (const m of marketing.matchAll(asserts)) {
      expect(m[0], `DDF capability claim with no date: ${m[0]}`).toMatch(
        /Q3 2026|T3 2026|roadmap|feuille de route|waiting on CREA|en attente/i
      );
    }
  });

  it("does not describe drip templates that were never written", () => {
    for (const phrase of ["pre-construction", "premiers acheteurs à Calgary", "Montreal relocs"]) {
      // Allowed in competitor prose; never as a template we ship.
      const grid = /featureGrid: \{[\s\S]*?\n {8}\},/g;
      for (const block of marketing.matchAll(grid)) {
        expect(block[0]).not.toContain(phrase);
      }
    }
    const automation = readFileSync(
      join(ROOT, "supabase/functions/email-automation/index.ts"),
      "utf8"
    );
    for (const real of ["welcome:", "nurture:", "follow_up:", "property_alert:"]) {
      expect(automation).toContain(real);
    }
  });

  it("does not sell team routing, granular roles or an audit log as built", () => {
    for (const phrase of [
      "Round-robin by geography",
      "Team lead, agent, assistant, brokerage admin",
      "Immutable. Exportable for compliance",
      "Drop-in script. Matches your brokerage colours",
    ]) {
      expect(marketing).not.toContain(phrase);
    }
    const schema = readFileSync(
      join(ROOT, "supabase/migrations/00000000000000_baseline_production_schema.sql"),
      "utf8"
    );
    expect(schema).toContain("app_role AS ENUM ('admin', 'user')");
  });

  it("does not claim a founding date that contradicts the beta badge", () => {
    expect(marketing).not.toContain("CRM since 2020");
    expect(marketing).not.toContain("CRM depuis 2020");
    expect(i18n).toContain("Now in public beta");
  });

  it("does not sell a 24/7 lead-facing chatbot on the comparison pages", () => {
    for (const phrase of ["24/7 AI Chatbot", "24/7 Chatbot", "books showings", "all while you sleep"]) {
      expect(comparisons).not.toContain(phrase);
    }
  });

  it("never argues we are cheap on a page that shows us costing 3x", () => {
    const ixact = readFileSync(join(ROOT, "src/pages/VsIxact.tsx"), "utf8");
    // Both numbers are on the page; the copy around them has to agree.
    expect(ixact).toContain("$149/mo CAD");
    expect(ixact).toContain("$46.75");
    for (const phrase of [
      "Price of Basic CRM",
      "without breaking your budget",
      "Without Breaking Your Budget",
      "budget-friendly pricing",
    ]) {
      expect(ixact).not.toContain(phrase);
    }
  });

  it("does not quote outcome statistics with no source", () => {
    for (const phrase of ["78% of buyers", "Save 15+ Hours/Week", "Trained on CREA data"]) {
      expect(comparisons).not.toContain(phrase);
    }
  });

  it("does not sell market forecasting", () => {
    // /market-intelligence renders three hardcoded arrays and offers a CSV
    // export of them. There are no market tables in the schema and no
    // forecasting code, so nothing may promise a price prediction.
    for (const phrase of [
      "Market Intelligence",
      "price forecasts",
      "predicts neighborhood trends",
      "predict neighborhood-level price movements",
    ]) {
      expect(comparisons).not.toContain(phrase);
    }
    const schema = readFileSync(
      join(ROOT, "supabase/migrations/00000000000000_baseline_production_schema.sql"),
      "utf8"
    );
    expect(/create table[^;]*market/i.test(schema)).toBe(false);
  });

  it("does not sell calendar sync or contact import that is not built", () => {
    // 2026-09-22, corrected. An earlier version of this guard scanned only
    // supabase/functions and concluded nothing could write a calendar event.
    // That was wrong: api/integrations/google/[action].ts is a Vercel
    // serverless function that does OAuth, creates an app-owned calendar and
    // exposes an events endpoint that POSTs to calendar/v3. It reads
    // GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET from Vercel, which is the right
    // place for them. The guard missed a whole runtime.
    //
    // What still makes "sync" untrue is narrower, and this is what to pin:
    //
    //   - Nothing in src/ calls the events endpoint. GoogleCalendarCard only
    //     uses connect / status / disconnect, so no appointment or showing
    //     ever reaches Google on its own.
    //   - The scope is calendar.app.created, which grants access only to the
    //     calendar the app itself made. It cannot read or write the user's
    //     existing calendar, so "sits on the calendar you already use" is not
    //     achievable under this scope at all.
    //   - There is still no appointments / showings table to sync from.
    //   - Outlook and Google Contacts have the OAuth flow only.
    const walkSrc = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const full = join(dir, e);
        return statSync(full).isDirectory() ? walkSrc(full) : [full];
      });
    const appSrc = walkSrc(join(ROOT, "src"))
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("__tests__") && !f.includes("/test/"))
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");

    // A caller of the events endpoint is what would turn the endpoint into a
    // feature. When one appears, this fails and the copy below may come back.
    expect(/\/events`|\/api\/integrations\/google\/events/.test(appSrc)).toBe(false);

    for (const phrase of [
      "Two-way sync showings and meetings",
      "Two-way sync with Google Calendar",
      "Sync with Microsoft Outlook calendar",
      "Import and sync Google contacts",
      "Import and sync Outlook contacts",
    ]) {
      expect(integrationHub + home + features + comparisons).not.toContain(phrase);
    }

    // Calendar and contacts must sit in the roadmap list, not "available today".
    const nowBlock = features.slice(
      features.indexOf("CAPS_NOW"),
      features.indexOf("CAPS_ROADMAP")
    );
    expect(nowBlock).not.toContain("capCalendar");
    expect(nowBlock).not.toContain("capContacts");
  });

  it("does not claim first-party research that was never run", () => {
    // /blog/best-crm-canada-2025 described a study in checkable detail: "Over
    // 90 days, we signed up for 23 different CRMs, tested them with real leads
    // (with permission), and measured response times, conversion rates". No
    // such study exists. It also published the outputs — ROI 671%, 10-15
    // hours/week saved, conversion up 2-3x, "80% of Canadian agents" — and
    // attributed the conversion figure to "sub-5-second response times", a
    // capability the guard above already establishes the product lacks.
    //
    // AGENTS.md: "Do not fabricate: customer counts, revenue, fines saved,
    // uptime, or case studies."
    const guide = readFileSync(
      join(ROOT, "src/pages/blog/BestCRMCanada2025.tsx"),
      "utf8"
    );
    for (const phrase of [
      "testing 23 CRMs",
      "23 different CRMs",
      "with real leads",
      "671%",
      "10-15 hours/week",
      "2-3x",
      "sub-5-second",
      "80% of Canadian Real Estate Agents",
      "20 deals or 45 deals",
    ]) {
      expect(guide, `unsourced claim restored: ${phrase}`).not.toContain(phrase);
    }
    // The replacement has to keep saying how it was actually produced, and
    // disclose that we compare our own product.
    expect(guide).toContain("desk research");
    expect(guide).toMatch(/we build one of the products compared here/i);
  });

  it("reports native integrations as the native count, not the total", () => {
    // The hero printed totalIntegrations (23) under the label "Native
    // Integrations". The 23 are 7 native, 11 not live and 5 reachable only
    // through Zapier or Make, so the headline overstated native support about
    // threefold. Each status is now counted separately.
    const page = readFileSync(join(ROOT, "src/pages/Integrations.tsx"), "utf8");
    const heroStat = page.slice(
      page.indexOf("Integration Stats"),
      page.indexOf("Categorized Integrations Grid")
    );
    expect(heroStat).toContain("{nativeCount}");
    expect(heroStat).not.toContain("{totalIntegrations}+");
    // A count rendered next to the native label must be derived from the
    // native subtitleKey, not from the length of the whole list.
    expect(page).toMatch(/const nativeCount = countBy\("native"\)/);
  });

  it("does not publish invented testimonials or competitor prices", () => {
    // 2026-09-28. Three separate fabrications, all live:
    //
    //   - 14 testimonials across four comparison posts, attributed to named
    //     agents in named cities ("Sarah M., Vancouver Real Estate Team (5
    //     agents)") with outcome figures ("lead conversion went from 7% to
    //     16%"). None sourced. AGENTS.md forbids fabricated case studies.
    //   - An ROI table on /blog/vs-lofty-crm concluding "Net Benefit:
    //     $306,312/year", built on a 4.2% conversion rate and a "2.7 seconds
    //     (AI)" response time the product does not have.
    //   - Specific prices for Lofty and BoldTrail across nine files, including
    //     inside JSON-LD. Verified 2026-09-28: lofty.com/pricing and
    //     boldtrail.com publish no prices at all — both quote on request — so
    //     every one of those figures was unverifiable, and two of them
    //     contradicted each other on the same page.
    //
    // Our own prices stay allowed: 149/299 CAD monthly and 999/2997 annual all
    // come from src/config/billing.ts.
    const walkAll = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const full = join(dir, e);
        return statSync(full).isDirectory() ? walkAll(full) : [full];
      });
    const sources = walkAll(join(ROOT, "src"))
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("__tests__") && !f.includes("/test/"))
      // Strip comments first. The commit that removed these figures explains
      // what it removed, and quoting a dead claim in a comment must not read
      // as the claim being back.
      .map((f) => ({
        f,
        body: readFileSync(f, "utf8")
          .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/^\s*\/\/.*$/gm, ""),
      }));

    const banned = [
      "5,988", "6,987", "700+ USD", "$675/month", "306,312", "33,456%",
      "$499-$1,499", "1,188+/yr",
    ];

    // The literal list above is history, not the guard. It missed a whole page.
    //
    // /lofty-alternative still carried "$700/mo", "$1,499 setup fee", "$399
    // migration", "$10,188+ USD", "~$13,850 CAD" and "$499 - $1,499" — the last
    // one identical to a banned string except for the spaces around the dash.
    // From those it derived "Save 85%" in the H1 and "83% cost savings" on the
    // card beneath it, while the comparison table two sections down correctly
    // said Lofty's price is "Not published". An exact-match blocklist can only
    // catch the fabrication you already found, so match the SHAPE instead:
    // any money figure within a short distance of a competitor's name.
    // ONLY the vendors verified on 2026-09-28 as publishing no prices at all.
    //
    // This list is short on purpose. IXACT publishes $46.75/$55 USD, LionDesk
    // was a documented $39/month, Wise Agent and Follow Up Boss publish too —
    // quoting those is sourcing, not fabricating, and a guard that flagged
    // them would train everyone to ignore it. Add a vendor here only after
    // checking their pricing page and recording the date.
    const NO_PUBLISHED_PRICE = /\b(Lofty|BoldTrail|kvCORE)\b/i;
    const MONEY = /\$\s?\d[\d,]*(?:\.\d{2})?/;
    /**
     * Our own figures: monthly and annual plan prices from
     * src/config/billing.ts, their 12-month totals, the annual saving, and $0
     * for "no setup fee". Every comparison page states these next to a
     * competitor's name by design — that is what a comparison is.
     */
    const OURS = /^\$\s?(0|149|299|789|999|2,?997|1,?788|3,?588)$/;

    const offenders: string[] = [];
    for (const { f, body } of sources) {
      const rel = f.split("/src/")[1];
      for (const b of banned) {
        if (body.includes(b)) offenders.push(`${rel}: ${b}`);
      }
      // Any quote attributed to a person or a review site.
      if (/<footer>\s*—/.test(body)) offenders.push(`${rel}: attributed testimonial`);

      // A money figure and a competitor name inside the same ~90 characters.
      // Window rather than whole-file, so a page may still say "$149" and name
      // Lofty in different sentences — which every comparison page must.
      for (const m of body.matchAll(new RegExp(MONEY.source, "g"))) {
        const amount = m[0].replace(/\s/g, "");
        if (OURS.test(amount)) continue;
        // 55 characters, not 90. A wider window bled across adjacent rows of
        // a pricing table and flagged Wise Agent's genuinely published $42/$59
        // because the Lofty row happened to sit underneath it.
        const window = body.slice(Math.max(0, m.index - 55), m.index + 55);
        if (NO_PUBLISHED_PRICE.test(window)) {
          offenders.push(`${rel}: "${amount}" quoted beside Lofty/BoldTrail/kvCORE, none of which publish prices`);
        }
      }

      // A savings percentage is the same fabrication one step downstream: it
      // can only be computed from a competitor price we do not have.
      for (const m of body.matchAll(/\b\d{1,3}\s?%/g)) {
        const window = body.slice(Math.max(0, m.index - 110), m.index + 110);
        if (/\b(save|saving|savings|cheaper|less than)\b/i.test(window) && NO_PUBLISHED_PRICE.test(window)) {
          offenders.push(`${rel}: "${m[0]}" savings claim against a vendor that publishes no price`);
        }
      }

      // Our own customer count. We do not publish one.
      for (const m of body.matchAll(
        /\b(hundreds|thousands|dozens)\s+of\s+(Canadian\s+)?(agents|realtors|brokerages|teams|customers|users)/gi,
      )) {
        const window = body.slice(Math.max(0, m.index - 120), m.index + 60);
        // Describing a COMPETITOR's user base from public reporting is fine;
        // claiming our own is not.
        if (/\b(join|already|trusted by|used by us|our|we serve|switched to)\b/i.test(window) && !/\b(Lofty|BoldTrail|kvCORE|LionDesk|IXACT|Wise ?Agent|Follow ?Up ?Boss|Propertybase|BoomTown)\b/i.test(window.slice(0, 120))) {
          offenders.push(`${rel}: "${m[0]}" — we do not publish a customer count`);
        }
      }
    }
    expect(offenders, `unsourced claim restored:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("labels every roadmap capability on the features page", () => {
    // The split is structural. If someone folds the two lists back into one,
    // a buyer loses the only signal separating shipped from planned.
    expect(features).toContain("CAPS_NOW");
    expect(features).toContain("CAPS_ROADMAP");
    expect(features).toContain("capsRoadmapBadge");
    expect(features).not.toContain("const CAPABILITIES");
  });
});
