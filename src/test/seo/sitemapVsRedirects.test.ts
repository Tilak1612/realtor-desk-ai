import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// No URL in the sitemap may also be the source of a redirect.
//
// Vercel resolves redirects BEFORE the filesystem. So a redirect whose source
// matches a real prerendered page wins, and the page becomes unreachable at its
// own address while still being advertised in sitemap.xml.
//
// That shipped. `{ "source": "/compare", "destination": "/compare/boldtrail" }`
// was added back when /compare had no page of its own. When the hub was built
// at that exact path, the redirect silently shadowed it: production served
// BoldTrail's title and description at /compare, which showed up as a duplicate
// title and duplicate description in the post-deploy audit — the only two on
// the whole site. Locally everything looked right, because the redirect lives
// in Vercel's config and not in the build.
//
// Reads config and sitemap rather than the built output, so it catches the
// conflict before a deploy rather than after one.

const ROOT = path.resolve(__dirname, "../../../");

interface Redirect { source: string; destination: string; permanent?: boolean }

const normalise = (u: string) => {
  const p = u.replace(/^https?:\/\/[^/]+/, "");
  return (p.replace(/\/+$/, "") || "/");
};

describe("sitemap and Vercel redirects", () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8")) as {
    redirects?: Redirect[];
  };
  const sitemap = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
  const indexed = new Set(
    [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => normalise(m[1])),
  );

  it("never redirects away from a URL it asks Google to index", () => {
    const shadowed = (cfg.redirects ?? [])
      .filter((r) => indexed.has(normalise(r.source)))
      .map((r) => `${r.source} -> ${r.destination} (but ${r.source} is in sitemap.xml)`);

    expect(
      shadowed.join("\n"),
      "Vercel applies redirects before the filesystem, so these pages are unreachable at their own URL",
    ).toBe("");
  });

  it("points every redirect at something the site actually serves", () => {
    // A redirect to a 404 is worse than no redirect: it turns a dead link into
    // a dead link with an extra hop.
    const appRoutes = new Set(
      [...fs.readFileSync(path.join(ROOT, "src/App.tsx"), "utf8").matchAll(/path="([^"]+)"/g)].map(
        (m) => normalise(m[1]),
      ),
    );
    const dangling = (cfg.redirects ?? [])
      .filter((r) => !r.destination.startsWith("http"))
      .filter((r) => !appRoutes.has(normalise(r.destination)))
      .map((r) => `${r.source} -> ${r.destination} (no such route in App.tsx)`);

    expect(dangling.join("\n")).toBe("");
  });
});
