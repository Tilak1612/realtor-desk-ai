import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Every indexed page needs real inbound links, measured on the prerendered HTML
// crawlers receive rather than on the React tree.
//
// An audit of production on 2026-10-02 found zero orphans but 45 of 87 pages with
// exactly ONE inbound link, from a single hub. "Not an orphan" is a low bar: a
// page linked from one place tells a crawler it is barely part of the site.
//
// Runs against dist/ and skips when there is no build, like the other post-build
// checks. The file walk is inside the test, not the describe body: skipIf still
// runs a describe body during collection, and a readdirSync out there threw
// ENOENT in CI, where tests run before the build.

const ROOT = path.resolve(__dirname, "../../..");
const DIST = path.join(ROOT, "dist");
const built = fs.existsSync(path.join(DIST, "index.html"));

const MIN_INBOUND = 3;

/**
 * Pages that are deliberately reachable from few places. Each is a utility page
 * with one natural parent, linked from the footer or from a form, and padding
 * them with contextual links would be noise.
 */
const EXEMPT = new Set(["/partners/apply", "/partners/terms"]);

describe.skipIf(!built)("internal link depth", () => {
  it("gives every indexed page at least three distinct inbound links", () => {
    const sitemap = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
    const pages = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(
      (m) => m[1].replace("https://www.realtordesk.ai", "") || "/",
    );

    const inbound = new Map<string, Set<string>>(pages.map((p) => [p, new Set()]));
    for (const from of pages) {
      const file = path.join(DIST, from === "/" ? "" : from, "index.html");
      if (!fs.existsSync(file)) continue;
      const html = fs.readFileSync(file, "utf8");
      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        const to = m[1].replace(/\/+$/, "") || "/";
        if (to !== from) inbound.get(to)?.add(from);
      }
    }

    const weak = pages
      .filter((p) => !EXEMPT.has(p))
      .map((p) => [p, inbound.get(p)?.size ?? 0] as const)
      .filter(([, n]) => n < MIN_INBOUND)
      .map(([p, n]) => `${n}  ${p}`);

    expect(weak.join("\n"), `pages with fewer than ${MIN_INBOUND} inbound links`).toBe("");
  });
});
