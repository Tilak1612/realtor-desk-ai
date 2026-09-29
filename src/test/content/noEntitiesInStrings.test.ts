import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// HTML entities belong in JSX text, never in a JavaScript string literal.
//
// JSX decodes `&rsquo;` in element text; a quoted JS string is just characters,
// and React renders them verbatim. So a page that writes
//
//     const FAQS = [{ a: "the obligations remain the brokerage&rsquo;s." }]
//
// publishes the literal text "brokerage&rsquo;s" to every visitor. That shipped
// on /use-cases/brokerage and was invisible in review, because the identical
// entity a few lines below — in JSX text — renders correctly.
//
// Use the real character (’ “ ” — …) in string data. In JSX text either form
// works and this test does not look there.

const SRC = path.resolve(__dirname, "../../");
const ENTITY = /&(?:rsquo|lsquo|ldquo|rdquo|amp|lt|gt|quot|mdash|ndash|nbsp|hellip|reg|#x?[0-9a-f]+);/i;
/** A single-line JS string literal, escapes respected. */
const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;

const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "test" || e.name === "__tests__" || e.name === "node_modules") continue;
      walk(full, out);
    } else if (/\.tsx?$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
};

describe("HTML entities in source", () => {
  it("never puts one inside a JavaScript string literal", () => {
    const offenders: string[] = [];

    for (const file of walk(SRC)) {
      const rel = path.relative(SRC, file);
      fs.readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          // An import path or a URL can legitimately contain "&amp;"-looking
          // text; entities only matter in prose, which these are not.
          if (/^\s*(import|export)\s/.test(line)) return;
          for (const lit of line.match(STRING_LITERAL) ?? []) {
            if (/^["']https?:|^["']\/|&&/.test(lit)) continue;
            if (ENTITY.test(lit)) {
              offenders.push(`${rel}:${i + 1}  ${lit.slice(0, 100)}`);
            }
          }
        });
    }

    expect(
      offenders.join("\n"),
      "use the real character (’ “ ” —) in string data; entities only decode in JSX text",
    ).toBe("");
  });
});
