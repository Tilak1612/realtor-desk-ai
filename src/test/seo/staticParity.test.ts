import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import i18n from "@/i18n/config";
import {
  BOLDTRAIL_COMPARE_TABLE,
  HOME_COMPARE_STRIP,
  type ComparisonTable,
} from "@/content/comparisonTables";

// Static and hydrated parity for the pages where a wrong or missing fact does
// the most damage. AI crawlers read only the prerendered HTML; before this the
// /compare/boldtrail shell had its title and H1 but no comparison table, no
// source note, none of our stated limits and no editorial section.
//
// Expected rows come from the same data and the same English strings the
// pages render, so a row that stops reaching the static HTML fails here. The
// critical facts are also asserted literally, so a change to the data cannot
// quietly remove them from both sides at once.

const DIST = path.resolve(__dirname, "../../../dist");
const read = (route: string) =>
  fs.readFileSync(path.join(DIST, route === "/" ? "" : route, "index.html"), "utf8");
const main = (html: string) => html.slice(html.indexOf("<main>"), html.indexOf("</main>"));
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const en = i18n.getFixedT("en");

function expectedRows(table: ComparisonTable) {
  const k = (key: string) => en(`${table.prefix}.${key}`);
  const cell = (v: string | true) => (v === true ? k(table.included ?? "vIncluded") : k(v));
  return table.sections.flatMap((s) =>
    s.rows.map(([f, a, b]) => `<tr><th scope="row">${esc(k(f))}</th><td>${esc(cell(a))}</td><td>${esc(cell(b))}</td></tr>`),
  );
}

describe.skipIf(!fs.existsSync(path.join(DIST, "index.html")))("static HTML parity", () => {
  describe("/compare/boldtrail", () => {
    const html = main(read("/compare/boldtrail"));
    const k = (key: string) => en(`compareBoldtrail.${key}`);

    it("has the H1 exactly as the page renders it", () => {
      expect(html).toContain(`<h1>${esc(`${k("headline1")} ${k("headline2")}.`)}</h1>`);
    });

    it("carries every comparison row, each in one table row", () => {
      for (const row of expectedRows(BOLDTRAIL_COMPARE_TABLE)) expect(html).toContain(row);
      for (const col of BOLDTRAIL_COMPARE_TABLE.columns) expect(html).toContain(`<th scope="col">${esc(k(col))}</th>`);
    });

    it("states the source, the date and our own limits before JavaScript runs", () => {
      for (const fact of [
        "boldtrail.com/faq",
        "4 November 2026",
        "Not stated in their FAQ",
        "CAD $149/mo Solo · $299/mo Team",
        "Quote only",
        "Roadmap, not live",
        "single-agent product",
        "Planned, not live",
      ]) {
        expect(html).toContain(esc(fact));
      }
    });

    it("includes the editorial section and its links", () => {
      for (const key of ["readHeading", "readKindH", "readSilentH", "readUsH", "readWhoH"]) {
        expect(html).toMatch(new RegExp(`<h[23]>${esc(k(key)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h[23]>`));
      }
      for (const href of ["/blog/best-crm-canada-2025", "/blog/real-estate-crm-buying-guide", "/pricing", "/roadmap"]) {
        expect(html).toContain(`<a href="${href}">`);
      }
    });

    it("puts the table after the introduction and before the editorial", () => {
      const table = html.indexOf("<table>");
      expect(table).toBeGreaterThan(html.indexOf(esc(k("subtitle"))));
      expect(table).toBeLessThan(html.indexOf(esc(k("readHeading"))));
    });
  });

  describe("homepage comparison strip", () => {
    const html = main(read("/"));
    const c = (key: string) => en(`landing.compareStrip.${key}`);

    it("carries every row under its own heading, with the source note once", () => {
      for (const row of expectedRows(HOME_COMPARE_STRIP)) expect(html).toContain(row);
      expect(html.indexOf("<table>")).toBeGreaterThan(html.indexOf(esc(c("heading"))));
      expect(html.split(esc(c("sourceNote"))).length - 1).toBe(1);
    });
  });

  it("never shows escaped markup or unbalanced links to a crawler", () => {
    const files: string[] = [];
    const walk = (dir: string) =>
      fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
        const p = path.join(dir, e.name);
        if (e.isDirectory() && e.name !== "assets") walk(p);
        else if (e.name === "index.html") files.push(p);
      });
    walk(DIST);
    const bad: string[] = [];
    for (const f of files) {
      const m = main(fs.readFileSync(f, "utf8"));
      const rel = path.relative(DIST, f);
      if (/&lt;\/?(a|span|strong|em|Link|br|div)\b/.test(m)) bad.push(`${rel}: escaped markup`);
      if ((m.match(/<a\b/g) || []).length !== (m.match(/<\/a>/g) || []).length) bad.push(`${rel}: unbalanced <a>`);
    }
    expect(bad).toEqual([]);
  });
});
