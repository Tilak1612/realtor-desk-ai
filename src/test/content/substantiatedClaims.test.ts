import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { PLAN_SUMMARIES } from "@/config/billing";

/**
 * Marketing copy must not assert things the product cannot evidence.
 *
 * Every pattern below was live on realtordesk.ai and was removed because
 * nothing in the codebase or the billing catalogue supported it:
 *
 *  - "72% accuracy" on lead scoring, in five places, plus a card reading
 *    "Prediction Accuracy / Validated across our Canadian beta community".
 *    calculate-lead-score derives prediction_confidence from DATA COMPLETENESS
 *    (confidenceMultipliers = [1.0, 0.9, 0.8, 0.7] by missing factors) and two
 *    of its inputs are hardcoded placeholders behind a "// Mock calculation"
 *    comment. No accuracy has ever been measured.
 *  - "$999/year Founding Member tier", quoted on five pages. Live /pricing
 *    offers Solo $149/mo and Team $299/mo and says "Founding Member" nowhere.
 *  - "$243 investment", which matched no pair of real prices in either
 *    direction, and "41% GCI increase", "$75K+ return", "6-8 additional deals".
 *  - Twenty unattributed quotes asserting operational failures at named
 *    competitors, and named personas ("Jennifer T., Toronto") presenting as
 *    customers.
 *
 * The rule this encodes: a number about an OUTCOME needs a source. A number
 * about our own PRICE must come from billing.ts.
 */

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(full)) out.push(full);
  }
  return out;
}

// Comparison and product pages only. The blog is a separate, larger cleanup.
const PAGES = walk(join(process.cwd(), "src/pages")).filter(
  (f) => !f.includes("/blog/") && !f.includes("/rd/app/")
);
const I18N = join(process.cwd(), "src/i18n/config.ts");

describe("substantiated claims", () => {
  it("never states a lead-scoring accuracy figure", () => {
    const bad = [...PAGES, I18N].filter((f) =>
      /\d{1,3}\s*%\s*(accuracy|prediction)|prediction accuracy/i.test(readFileSync(f, "utf8"))
    );
    expect(bad, `accuracy claim with nothing measuring it: ${bad.join(", ")}`).toEqual([]);
  });

  it("quotes only prices that exist in the billing catalogue", () => {
    // Any $N/year or $N/mo presented as OUR price must be a real plan.
    const real = new Set(PLAN_SUMMARIES.map((p) => String(p.monthlyCad)));
    const offenders: string[] = [];
    for (const f of PAGES) {
      const src = readFileSync(f, "utf8");
      if (/Founding Member/i.test(src)) offenders.push(`${f.split("/src/")[1]}: Founding Member tier`);
      for (const m of src.matchAll(/rdai:\s*"\$([0-9,]+)/g)) {
        const n = m[1].replace(/,/g, "");
        if (n !== "0" && !real.has(n)) offenders.push(`${f.split("/src/")[1]}: rdai "$${m[1]}"`);
      }
    }
    expect(offenders, `price not in billing.ts:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });

  it("makes no unevidenced revenue, commission or deal-count promise", () => {
    const patterns = [
      /\d{1,3}%\s*GCI/i,
      /\$\d[\d,]*K?\+?\s*(more\s+)?(revenue|return)\b/i,
      /\d+\s*-\s*\d+\s+additional deals/i,
      /close\s+\d+\s+(more|extra|additional)\s+deals/i,
    ];
    const offenders: string[] = [];
    for (const f of [...PAGES, I18N]) {
      const src = readFileSync(f, "utf8");
      for (const re of patterns) {
        const m = src.match(re);
        if (m) offenders.push(`${f.split("/src/")[1]}: "${m[0]}"`);
      }
    }
    expect(offenders, `outcome promise with no evidence:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });

  it("carries no unattributed quote about a named competitor", () => {
    const offenders: string[] = [];
    for (const f of PAGES) {
      const src = readFileSync(f, "utf8");
      for (const m of src.matchAll(/quote:\s*"([^"]{25,})"/g)) {
        offenders.push(`${f.split("/src/")[1]}: "${m[1].slice(0, 48)}…"`);
      }
    }
    expect(offenders, `invented customer story:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });

  it("attributes no copy to a named customer persona", () => {
    // "- Jennifer T., Toronto", "Laura K. • Calgary", "Sarah M., Vancouver".
    // noFabricatedProductImagery.test.ts looks for ITALIC quoted claims and
    // missed every one of these, because the quote and the name sit in
    // separate elements. Match the attribution instead of the quote.
    const offenders: string[] = [];
    for (const f of PAGES) {
      const src = readFileSync(f, "utf8");
      // Comments are stripped first: CanadianMarket.tsx documents a section
      // of invented people that was already removed, and scanning that note
      // would flag the record of the fix as the fault.
      const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
      // Two shapes: "- Jennifer T., Toronto" on one line, and the card layout
      // where the name and the city sit in SEPARATE spans.
      for (const re of [
        /[-—•]?\s*([A-Z][a-z]+)\s+([A-Z])\.,?\s*(?:Toronto|Vancouver|Calgary|Montreal|Ottawa|Edmonton|Winnipeg|Halifax)/g,
        /<span[^>]*>\s*([A-Z][a-z]+ [A-Z]\.)\s*<\/span>[\s\S]{0,180}?(?:Toronto|Vancouver|Calgary|Montreal|Ottawa|Edmonton|Winnipeg|Halifax)/g,
      ]) {
        for (const m of code.matchAll(re)) {
          offenders.push(`${f.split("/src/")[1]}: "${(m[1] ? m[1] : m[0]).trim().slice(0, 40)}"`);
        }
      }
    }
    expect(offenders, `copy attributed to an invented person:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });

  it("states the refund offer the Terms actually contract", () => {
    // TermsOfService.tsx: "a 30-day money-back guarantee for new subscribers" --
    // unconditional. Marketing had bolted on conditions the Terms never state.
    const offenders: string[] = [];
    for (const f of [...PAGES, I18N]) {
      const src = readFileSync(f, "utf8");
      const m = src.match(/close at least one additional deal|if it'?s not better than|if you miss \w+, full refund|if you don'?t close extra deals/i);
      if (m) offenders.push(`${f.split("/src/")[1]}: "${m[0]}"`);
    }
    expect(offenders, `refund condition absent from the Terms:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });
});
