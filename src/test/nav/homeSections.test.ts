import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { HOME_FAQS, HOME_RESOURCES } from "@/content/homeSections";

const APP = fs.readFileSync(path.resolve(__dirname, "../../App.tsx"), "utf8");
const declaredRoutes = new Set([...APP.matchAll(/path="([^"]+)"/g)].map((m) => m[1]));

describe("homepage resource cards", () => {
  it("links only at real articles, in both languages", () => {
    // The brief asks for "three real articles". A card pointing at a slug that
    // does not exist is worse than no card — it is a 404 in the one section
    // that exists to build trust.
    for (const isFr of [false, true]) {
      for (const r of HOME_RESOURCES(isFr)) {
        expect(declaredRoutes.has(r.to), `${isFr ? "FR" : "EN"} resource card -> ${r.to}`).toBe(true);
      }
    }
  });

  it("offers three, and the same three in each language", () => {
    expect(HOME_RESOURCES(false)).toHaveLength(3);
    expect(HOME_RESOURCES(true).map((r) => r.to)).toEqual(HOME_RESOURCES(false).map((r) => r.to));
  });

  it("carries no byline or date", () => {
    // Explicitly banned by the brief: "no fabricated dates/authors". These
    // articles have no publication date in the repo, so any date rendered
    // here would be invented.
    for (const isFr of [false, true]) {
      for (const r of HOME_RESOURCES(isFr)) {
        const text = `${r.title} ${r.blurb}`;
        expect(text, `date-like string in ${r.to}`).not.toMatch(/\b20\d{2}\b/);
        expect(text.toLowerCase(), `byline in ${r.to}`).not.toMatch(/\bby (the )?[a-z]/);
      }
    }
  });
});

describe("homepage FAQ", () => {
  it("answers the same questions in both languages", () => {
    expect(HOME_FAQS(false)).toHaveLength(HOME_FAQS(true).length);
    expect(HOME_FAQS(false).length).toBeGreaterThanOrEqual(5);
  });

  it("gives every question a real answer", () => {
    for (const isFr of [false, true]) {
      for (const f of HOME_FAQS(isFr)) {
        expect(f.q.trim().endsWith("?"), `not a question: ${f.q}`).toBe(true);
        expect(f.a.trim().length, `thin answer: ${f.q}`).toBeGreaterThan(80);
      }
    }
  });

  it("keeps the trial terms matching the billing configuration", () => {
    // The FAQ restates price and trial length, which the brief says to
    // preserve exactly. If someone changes a plan, this fails rather than
    // leaving the homepage quoting last quarter's price.
    const en = HOME_FAQS(false).map((f) => f.a).join(" ");
    expect(en).toMatch(/14 days/);
    expect(en).toMatch(/\$149/);
    expect(en).toMatch(/\$299/);
    expect(en).toMatch(/nothing is charged before day 14/);

    const fr = HOME_FAQS(true).map((f) => f.a).join(" ");
    expect(fr).toMatch(/14 jours/);
    expect(fr).toMatch(/149 \$/);
    expect(fr).toMatch(/299 \$/);
  });

  it("does not promise automatic sending in either language", () => {
    // The single most load-bearing claim on the site: Realtor Desk suggests,
    // the agent sends. A future edit that softens this into "sends follow-ups
    // for you" changes our CASL posture, so it fails here first.
    const en = HOME_FAQS(false).map((f) => `${f.q} ${f.a}`).join(" ").toLowerCase();
    expect(en).toMatch(/nothing goes out without you|no\. /);
    expect(en).not.toMatch(/sends? (the )?(follow-?ups?|emails?|messages?) (for you|automatically)/);

    const fr = HOME_FAQS(true).map((f) => `${f.q} ${f.a}`).join(" ").toLowerCase();
    expect(fr).toMatch(/aucun message ne part sans vous/);
  });

  it("claims no outcome numbers", () => {
    // No conversion lift, no hours saved, no customer count — the category of
    // claim this site has already had to remove once.
    for (const isFr of [false, true]) {
      const all = HOME_FAQS(isFr).map((f) => f.a).join(" ");
      expect(all, "percentage claim in the FAQ").not.toMatch(/\d+\s?%/);
      expect(all, "hours-saved claim in the FAQ").not.toMatch(/\d+\s?(hours?|heures?)\s?(a|per|par)\s?(week|semaine)/i);
      expect(all, "customer-count claim in the FAQ").not.toMatch(/\d[\d,]{2,}\+?\s*(agents?|courtiers?|customers?|clients?)\b/i);
    }
  });
});
