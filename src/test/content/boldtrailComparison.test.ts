import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// /compare/boldtrail and the homepage comparison strip asserted, in English
// and French: US-only hosting, a Keller Williams parent, USD setup fees, a
// "~20%" USD premium, a CAD $15 extra-user price, native DDF on our side,
// one-click import and a contract-match offer. None was sourced or true.
// BoldTrail facts now come from boldtrail.com/faq (read 4 November 2026),
// and a silent source is shown as "Not stated", never as a "no".

const ROOT = process.cwd();
const config = readFileSync(join(ROOT, "src/i18n/config.ts"), "utf8");
// Comments are not copy: the notes explaining what was removed quote it.
const code = (f: string) =>
  readFileSync(join(ROOT, f), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
const page = code("src/pages/rd/CompareBoldtrail.tsx");
const home = code("src/pages/rd/Home.tsx");

const blocks = (name: string, indent: string) =>
  [...config.matchAll(new RegExp(`${name}: \\{[\\s\\S]*?\\n${indent}\\},`, "g"))].map((m) => m[0]);

const compare = blocks("compareBoldtrail", " {6}");
const strip = blocks("compareStrip", " {8}");

const FORBIDDEN: [RegExp, string][] = [
  [/Keller Williams|\bKW\b/, "BoldTrail is Inside Real Estate's platform, not Keller Williams'"],
  [/US-only|États-Unis seulement/i, "BoldTrail's FAQ does not state where data is hosted"],
  [/\+\s?~?20\s?%|20\s?% (premium|de prime)/i, "unsourced USD premium"],
  [/\$\s?499|499\s?\$/, "unsourced BoldTrail setup fee"],
  [/CAD \$15|15 \$/, "no extra-user price exists"],
  [/one click|en un clic/i, "contacts move by CSV import"],
  [/match your remaining|égalons le reste/i, "no contract-match offer exists"],
  [/"✓ Native"/, "native DDF sync is not live"],
  [/Built in|Intégré"/, "vague tick replaced by the specific capability"],
];

describe("BoldTrail comparison makes only sourced claims", () => {
  it("has both locales of each block", () => {
    expect(compare).toHaveLength(2);
    expect(strip).toHaveLength(2);
  });

  it.each(FORBIDDEN)("does not assert %s", (pattern, why) => {
    for (const block of [...compare, ...strip]) {
      expect(block.match(pattern)?.[0], why).toBeUndefined();
    }
    expect(page.match(pattern)?.[0], why).toBeUndefined();
  });

  it("names its source and date in both languages", () => {
    for (const block of [...compare, ...strip]) {
      expect(block).toMatch(/boldtrail\.com\/faq/);
      expect(block).toMatch(/4 November 2026|4 novembre 2026/);
    }
  });

  it("keeps our own limits visible", () => {
    const [en, fr] = compare;
    expect(en).toMatch(/single-agent product/);
    expect(en).toMatch(/not live/);
    expect(fr).toMatch(/un seul courtier/);
    expect(fr).toMatch(/pas encore offerte/);
  });

  it("renders the editorial section from i18n, so French readers get French", () => {
    expect(page).not.toMatch(/How to read this comparison/);
    expect(page).toMatch(/k\("readHeading"\)/);
  });

  it("does not hardcode a premium on the homepage strip", () => {
    expect(home).not.toMatch(/USD, \+20/);
  });
});
