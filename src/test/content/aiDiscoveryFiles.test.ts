import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The four files AI answer engines read must say the same thing as the site.
 *
 * This is the gap that made them worth guarding. Over #238, #240 and #241 the
 * website stopped claiming a 24/7 lead-answering chatbot, live CREA DDF sync,
 * Canadian-market drip templates, team routing, an audit log, market
 * forecasting and a "$999/yr" Solo tier. public/llms.txt, llms-full.txt,
 * ai-company-info.txt and knowledge-base.json still asserted every one of
 * them -- and those files exist precisely to be ingested and quoted. The
 * corrected pages and the files feeding the answer engines were telling
 * different stories, and the files were winning.
 *
 * knowledge-base.json is allowed to name these capabilities inside its
 * features_not_built list; the check reads that list out before scanning.
 */

const ROOT = join(__dirname, "..", "..", "..");
const read = (f: string) => readFileSync(join(ROOT, "public", f), "utf8");

const LLMS = read("llms.txt");
const LLMS_FULL = read("llms-full.txt");
const COMPANY = read("ai-company-info.txt");
const KB_RAW = read("knowledge-base.json");

/**
 * Scan prose as prose, not as lines.
 *
 * These files are hard-wrapped at ~78 columns, so a claim routinely straddles
 * a newline -- "not affiliated\nwith" is one phrase to a reader and two lines
 * to a regex. Collapsing whitespace first is the difference between checking
 * the text and checking the wrapping.
 */
const flat = (src: string) => src.replace(/\s+/g, " ");

/**
 * Each file carries a correction notice that NAMES the retired claims, so an
 * engine working from a cached copy is told they were withdrawn. That notice
 * is the one place the old wording is allowed, so it comes out before the scan
 * rather than being filtered line by line.
 */
function withoutCorrectionNotice(src: string): string {
  return flat(
    src.replace(
      // The terminator must be a HEADING. A bare "\n\n[A-Z]" matched the
      // first word of the notice paragraph itself, so the block ended
      // before it began and the notice was scanned as though it were a claim.
      /(CORRECTION NOTICE|Claims not published[^\n]*|CLAIMS WE DO NOT MAKE|"_note":)[\s\S]*?(?=\n\n#|\n\n---|\n\n[A-Z][A-Z ]{5,}\n|\n {2}"last_verified"|$)/g,
      " "
    )
  );
}

/** Fabricated numbers. None was ever measured; none may reappear anywhere. */
const INVENTED_METRICS = [
  "37%",
  "15+ hours",
  "47-second",
  "47 seconds",
  "sub-3-second",
  "Sub-3-Second",
  "60-80%",
  "70% lower",
  "99.95%",
  "under 45 seconds",
  "45 s",
  "$999",
];

/** Capabilities that do not exist, stated as though they do. */
const UNBUILT_AS_SHIPPED = [
  "24/7 AI Lead Follow-Up",
  "24/7 bilingual AI",
  "24/7 AI chatbot",
  "Native CREA DDF integration",
  "CREA DDF Integration",
  "books showings",
  "Books showings",
  "team routing",
  "showing calendar",
  "immutable activity/audit log",
  "FINTRAC verifications",
  "FINTRAC workflows tracked",
];

describe("AI discovery files", () => {
  it("publishes no metric that was never measured", () => {
    for (const [name, file] of Object.entries({ LLMS, LLMS_FULL, COMPANY, KB_RAW })) {
      const body = withoutCorrectionNotice(file);
      for (const metric of INVENTED_METRICS) {
        expect(body, `${name}: unmeasured metric "${metric}"`).not.toContain(metric);
      }
    }
  });

  it("does not present unbuilt capabilities as shipped", () => {
    const kb = JSON.parse(KB_RAW);
    // Naming them under features_not_built is the whole point of that list.
    const notBuilt = JSON.stringify(kb.product.features_not_built);
    const kbShipped = KB_RAW.replace(notBuilt, "");

    for (const [name, file] of Object.entries({ LLMS, LLMS_FULL, COMPANY, kbShipped })) {
      const body = withoutCorrectionNotice(file);
      for (const claim of UNBUILT_AS_SHIPPED) {
        // A sentence that mentions the capability while marking it unbuilt is
        // exactly what these files should contain, so only unqualified
        // mentions count. Sentences, not lines -- the files are hard-wrapped.
        const offending = body
          .split(/(?<=[.!?])\s+/)
          .filter((sentence) => sentence.includes(claim))
          .filter(
            (sentence) =>
              !/not built|roadmap|do not describe|does not|no lead-facing|Q3 2026|not shipped/i.test(
                sentence
              )
          );
        expect(offending, `${name}: "${claim}" stated as shipped`).toEqual([]);
      }
    }
  });

  it("quotes the same prices as billing.ts", async () => {
    const billing = readFileSync(join(ROOT, "src/config/billing.ts"), "utf8");
    const solo = /nameDefault: "Solo", monthlyCad: (\d+)/.exec(billing)?.[1];
    const team = /nameDefault: "Team", monthlyCad: (\d+)/.exec(billing)?.[1];
    const days = /TRIAL_PERIOD_DAYS = (\d+)/.exec(billing)?.[1];
    expect(solo).toBeTruthy();
    expect(team).toBeTruthy();

    for (const file of [LLMS, LLMS_FULL, COMPANY]) {
      expect(file).toContain(`$${solo}`);
      expect(file).toContain(`$${team}`);
      expect(file).toContain(`${days}`);
    }
    const kb = JSON.parse(KB_RAW);
    const plans = Object.fromEntries(kb.pricing.plans.map((p) => [p.name, p.price]));
    expect(plans.Solo).toBe(Number(solo));
    expect(plans.Team).toBe(Number(team));
    expect(kb.pricing.trial.length_days).toBe(Number(days));
  });

  it("names the brand consistently", () => {
    // llms.txt itself declares "Realtor Desk" canonical, while the other two
    // files said "RealtorDesk AI" throughout -- the exact entity ambiguity an
    // answer engine has to guess its way through.
    for (const [name, file] of Object.entries({ LLMS, LLMS_FULL, COMPANY })) {
      expect(flat(file), `${name} uses the canonical brand`).not.toContain("RealtorDesk AI");
    }
    const kb = JSON.parse(KB_RAW);
    expect(kb.company.product_name).toBe("Realtor Desk");
  });

  it("disclaims CREA affiliation and holds no certification claim", () => {
    for (const [name, file] of Object.entries({ LLMS, LLMS_FULL, COMPANY })) {
      expect(/not affiliated with/i.test(flat(file)), `${name} disclaims CREA`).toBe(true);
    }
    for (const file of [LLMS, LLMS_FULL, COMPANY, KB_RAW]) {
      for (const cert of ["SOC 2 certified", "ISO 27001 certified"]) {
        expect(file).not.toContain(cert);
      }
    }
  });

  it("keeps knowledge-base.json parseable and structurally intact", () => {
    const kb = JSON.parse(KB_RAW);
    expect(Array.isArray(kb.product.features_available)).toBe(true);
    expect(Array.isArray(kb.product.features_not_built)).toBe(true);
    expect(kb.product.features_not_built.length).toBeGreaterThan(0);
    // No metrics block may come back with numbers in it.
    expect(kb.metrics_published?.note ?? "").toMatch(/none/i);
    expect(Object.keys(kb.metrics_published ?? {})).toEqual(["note"]);
  });
});
