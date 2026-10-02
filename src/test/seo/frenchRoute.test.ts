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
