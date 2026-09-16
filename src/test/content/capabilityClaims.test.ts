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

  it("labels every roadmap capability on the features page", () => {
    // The split is structural. If someone folds the two lists back into one,
    // a buyer loses the only signal separating shipped from planned.
    expect(features).toContain("CAPS_NOW");
    expect(features).toContain("CAPS_ROADMAP");
    expect(features).toContain("capsRoadmapBadge");
    expect(features).not.toContain("const CAPABILITIES");
  });
});
