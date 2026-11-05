import { describe, expect, it } from "vitest";
import { expandPrefixHelpers, jsxWhitespace } from "../../../scripts/prerender-pages.js";

// Unit checks on the two source rewrites the prerender applies before it
// extracts copy. Both fixed static HTML that disagreed with the rendered page.

describe("expandPrefixHelpers", () => {
  it("rewrites literal calls to a t() prefix helper", () => {
    const src = [
      "const k = (key: string) => t(`compareBoldtrail.${key}`);",
      '<h2>{k("readHeading")}</h2>',
      "<p>{k('readIntro')}</p>",
    ].join("\n");
    const out = expandPrefixHelpers(src);
    expect(out).toContain('<h2>{t("compareBoldtrail.readHeading")}</h2>');
    expect(out).toContain('<p>{t("compareBoldtrail.readIntro")}</p>');
  });

  it("leaves non-literal arguments and look-alike names alone", () => {
    const src = [
      "const c = (s) => t(`landing.compareStrip.${s}`);",
      "{c(row.key)}",
      'obj.c("x")',
      'abc("x")',
    ].join("\n");
    const out = expandPrefixHelpers(src);
    expect(out).toContain("{c(row.key)}");
    expect(out).toContain('obj.c("x")');
    expect(out).toContain('abc("x")');
  });

  it("ignores helpers that do not build a t() key from their argument", () => {
    const src = 'const k = (key: string) => key.toUpperCase();\n{k("a")}';
    expect(expandPrefixHelpers(src)).toBe(src);
  });
});

describe("jsxWhitespace", () => {
  it("drops a line break that touches a tag, as JSX does", () => {
    // /compare/boldtrail rendered "needs." but prerendered "needs ."
    expect(jsxWhitespace("<span>needs</span>\n            .")).toBe("<span>needs</span>.");
    expect(jsxWhitespace("{t(\"a\")}{\" \"}\n  <span>b</span>")).toBe('{t("a")}{" "}<span>b</span>');
  });

  it("keeps a <br> as a word break", () => {
    expect(jsxWhitespace("to Lofty<br />\n  <span>with a price</span>")).toBe("to Lofty <span>with a price</span>");
  });

  it("does not join two text lines", () => {
    expect(jsxWhitespace("first line\n  second line")).toBe("first line\n  second line");
  });
});
