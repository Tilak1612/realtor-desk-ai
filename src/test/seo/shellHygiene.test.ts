import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// The prerendered shell is what GPTBot, ClaudeBot, PerplexityBot and Bingbot read,
// because none of them run JavaScript. The extractor once emitted Tailwind class
// lists from Button.tsx (SIZES / VARIANTS) as paragraphs, and illustrative
// hero-dashboard rows (people's names with lead scores) as if they were copy.
// Both would be quoted by an answer engine as the page's content.

const DIST = path.resolve(__dirname, "../../../dist");

function htmlFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "assets" ? [] : htmlFiles(p);
    return e.name === "index.html" ? [p] : [];
  });
}

describe.skipIf(!fs.existsSync(path.join(DIST, "index.html")))("prerendered shell hygiene", () => {
  it("has no paragraph that is a CSS class list", () => {
    const bad: string[] = [];
    for (const f of htmlFiles(DIST)) {
      const html = fs.readFileSync(f, "utf8");
      for (const m of html.matchAll(/<p>([^<]+)<\/p>/g)) {
        const t = m[1].trim();
        if (/(^|\s)(px|py|bg|text|border|hover:|flex|grid|rounded)-/.test(t) && !/[.!?]$/.test(t)) {
          bad.push(path.relative(DIST, f) + ": " + t.slice(0, 60));
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("does not present the hero mock-up's sample people as page copy", () => {
    const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
    const root = html.slice(html.indexOf('<div id="root">'), html.indexOf("</body>"));
    for (const name of ["Sarah Mitchell", "James Okafor", "Priya Raman", "Daniel Roy"]) {
      expect(root, name).not.toContain(name);
    }
  });
});
