import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// A route under /fr/ is a standalone French page. Two things were wrong with how
// it was served: the document said lang="en-CA" (the French was only declared on
// <main>), and its hreflang block named the page as its own en-CA alternate at
// ?lang=en and its own fr-CA alternate at ?lang=fr. Neither alternate is a
// different document, so the annotations carried no information and were
// at best ignored.
//
// Checked on the prerendered HTML, which is what a crawler without JavaScript
// reads. src/components/SEO.tsx applies the same rule after hydration.

const DIST = path.resolve(__dirname, "../../../dist");
const file = path.join(DIST, "fr/crm-immobilier/index.html");

describe.skipIf(!fs.existsSync(file))("standalone French route", () => {
  const html = () => fs.readFileSync(file, "utf8");

  it("declares French on the document", () => {
    expect(html()).toMatch(/<html lang="fr-CA"/);
  });

  it("emits one self-referencing hreflang and no English alternate", () => {
    const tags = [...html().matchAll(/<link[^>]+hreflang="([^"]+)"[^>]*>/g)].map((m) => m[1]);
    expect(tags).toEqual(["fr-CA"]);
  });

  it("points that hreflang at the canonical URL", () => {
    const canonical = html().match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const alt = html().match(/<link rel="alternate" hreflang="fr-CA" href="([^"]+)"/)?.[1];
    expect(canonical).toBe("https://www.realtordesk.ai/fr/crm-immobilier");
    expect(alt).toBe(canonical);
  });
});

// An English page's own hreflang entry has to be its canonical URL. It used to
// be the same page at ?lang=en, which canonicalises to the clean URL, so the
// annotation named a non-canonical address and Search Console listed /?lang=en
// as a separate page.
const englishFile = path.join(DIST, "pricing/index.html");

describe.skipIf(!fs.existsSync(englishFile))("English page hreflang", () => {
  const html = () => fs.readFileSync(englishFile, "utf8");
  const href = (lang: string) =>
    html().match(new RegExp('<link[^>]+hreflang="' + lang + '"[^>]+href="([^"]+)"'))?.[1];

  it("names the canonical URL as the en-CA and x-default alternate", () => {
    const canonical = html().match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonical).toBe("https://www.realtordesk.ai/pricing");
    expect(href("en-CA")).toBe(canonical);
    expect(href("x-default")).toBe(canonical);
  });

  it("keeps French at ?lang=fr and never emits ?lang=en", () => {
    expect(href("fr-CA")).toBe("https://www.realtordesk.ai/pricing?lang=fr");
    expect(html()).not.toContain("?lang=en");
  });
});

