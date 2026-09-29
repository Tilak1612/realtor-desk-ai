import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// FAQPage markup must describe text the page visibly contains. Google requires
// it, and the redesign brief repeats it: "Visible FAQ text must match any FAQ
// markup."
//
// This is not hypothetical here. When the homepage FAQ moved into an imported
// content module, the prerenderer could still evaluate the schema expression
// but could no longer reach the strings for the body — so the static HTML
// shipped six questions in JSON-LD and none of them on the page. Everything
// looked fine in the browser, because React rendered the accordion; only the
// prerendered output was wrong, which is the copy crawlers read.
//
// Runs against dist/ when a build is present and skips otherwise, so it never
// blocks a test run on a machine that has not built.

const DIST = path.resolve(__dirname, "../../../dist");
const built = fs.existsSync(DIST);

const visibleText = (html: string) => {
  const root = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/);
  return root
    ? root[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
    : "";
};

const faqBlocks = (html: string) => {
  const out: { name: string; text: string }[] = [];
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(m[1]);
    } catch {
      continue;
    }
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      const n = node as { "@type"?: string; mainEntity?: unknown };
      if (n?.["@type"] !== "FAQPage" || !Array.isArray(n.mainEntity)) continue;
      for (const q of n.mainEntity as {
        name?: string;
        acceptedAnswer?: { text?: string };
      }[]) {
        if (q?.name) out.push({ name: q.name, text: q.acceptedAnswer?.text ?? "" });
      }
    }
  }
  return out;
};

// Entity-encoded in HTML, and sometimes double-encoded in the JSON (a JSON-LD
// answer can carry a literal "&rsquo;"). Decode generically — named entities by
// table, numeric ones by code point — rather than listing the handful we happen
// to have seen, which is how this check produced a false positive on
// /use-cases/brokerage the first time it ran.
const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "\u2019", lsquo: "\u2018", ldquo: "\u201c", rdquo: "\u201d",
  mdash: "\u2014", ndash: "\u2013", hellip: "\u2026", reg: "\u00ae", deg: "\u00b0",
};

const decode = (s: string): string => {
  let prev = "";
  let out = s;
  // Twice at most: enough for double-encoding, bounded so a crafted string
  // cannot loop.
  for (let i = 0; i < 2 && out !== prev; i++) {
    prev = out;
    out = out.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, body: string) => {
      if (body[0] === "#") {
        const code = body[1]?.toLowerCase() === "x"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return NAMED[body.toLowerCase()] ?? m;
    });
  }
  return out;
};

const norm = (s: string) =>
  decode(s)
    // Straight and curly quotes are the same character to a reader; only the
    // words matter for this check.
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();

describe.skipIf(!built)("FAQPage markup matches visible text", () => {
  // Own walker rather than readdirSync({recursive:true}) — the Dirent overload
  // is not typed for it in this TS version, and parentPath is newer than the
  // Node types here.
  //
  // Called inside each test, NOT in the describe body. skipIf skips the tests
  // but still RUNS the body during collection, so a readdirSync out here threw
  // ENOENT in CI, where tests run before the build. A skipped suite that can
  // still fail the run is worse than no suite.
  const collect = (dir: string, out: string[] = []): string[] => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) collect(full, out);
      else if (e.name === "index.html") out.push(full);
    }
    return out;
  };

  it("finds prerendered pages to check", () => {
    expect(collect(DIST).length).toBeGreaterThan(0);
  });

  it("renders every marked-up question and answer into the page body", () => {
    const failures: string[] = [];

    for (const file of collect(DIST)) {
      const html = fs.readFileSync(file, "utf8");
      const faqs = faqBlocks(html);
      if (!faqs.length) continue;

      const body = norm(visibleText(html));
      const route = "/" + path.relative(DIST, path.dirname(file)).replace(/^\.$/, "");

      for (const { name, text } of faqs) {
        if (!body.includes(norm(name))) {
          failures.push(`${route}: question in markup but not on page — "${name}"`);
        }
        // Answers are the part that silently goes missing, since a question can
        // survive as a heading while its answer lives only in the JSON.
        if (text && !body.includes(norm(text))) {
          failures.push(`${route}: answer in markup but not on page — "${name}"`);
        }
      }
    }

    expect(failures.join("\n")).toBe("");
  });
});
