import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { HREFLANG_PAIRS, englishTwinOf, frenchTwinOf } from "@/config/hreflangPairs";

// An English page and its standalone French translation are alternates of each
// other. hreflang only counts when it is reciprocal: each page has to name the
// other, and both have to name themselves, with canonical URLs. One-sided
// annotations are ignored, which is how these pages were served before the pair
// list existed (the English page pointed at itself with ?lang=fr, the French
// page at nothing).
//
// Checked on the prerendered HTML, which is what a crawler without JavaScript
// reads. src/components/SEO.tsx applies the same rule after hydration.

const SITE = "https://www.realtordesk.ai";
const DIST = path.resolve(__dirname, "../../../dist");
const fileFor = (route: string) => path.join(DIST, route.replace(/^\//, ""), "index.html");
const pairs = Object.entries(HREFLANG_PAIRS);

describe("hreflang pair list", () => {
  it("maps an English path to a path under /fr/, one to one", () => {
    expect(pairs.length).toBeGreaterThan(0);
    for (const [en, fr] of pairs) {
      expect(en.startsWith("/fr/")).toBe(false);
      expect(fr.startsWith("/fr/")).toBe(true);
      expect(frenchTwinOf(en)).toBe(fr);
      expect(englishTwinOf(fr)).toBe(en);
    }
    expect(new Set(pairs.map(([, fr]) => fr)).size).toBe(pairs.length);
  });

  it("leaves a French page with no English twin unpaired", () => {
    expect(englishTwinOf("/fr/crm-immobilier")).toBeUndefined();
  });
});

const built = pairs.every(([en, fr]) => fs.existsSync(fileFor(en)) && fs.existsSync(fileFor(fr)));

describe.skipIf(!built)("paired pages in the prerendered HTML", () => {
  const read = (route: string) => fs.readFileSync(fileFor(route), "utf8");
  const href = (html: string, lang: string) =>
    html.match(new RegExp('<link[^>]+hreflang="' + lang + '"[^>]+href="([^"]+)"'))?.[1];
  const canonical = (html: string) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];

  it.each(pairs)("%s and %s name each other", (en, fr) => {
    const enHtml = read(en);
    const frHtml = read(fr);

    expect(canonical(enHtml)).toBe(SITE + en);
    expect(canonical(frHtml)).toBe(SITE + fr);

    for (const html of [enHtml, frHtml]) {
      expect(href(html, "en-CA")).toBe(SITE + en);
      expect(href(html, "fr-CA")).toBe(SITE + fr);
      expect(href(html, "x-default")).toBe(SITE + en);
    }
  });

  it.each(pairs)("%s is English and %s is French on the document", (en, fr) => {
    expect(read(en)).toMatch(/<html lang="en-CA"/);
    expect(read(fr)).toMatch(/<html lang="fr-CA"/);
  });
});
