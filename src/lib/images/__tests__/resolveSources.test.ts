import { describe, it, expect } from "vitest";
import { resolveSources } from "../resolveSources";
import blogCrea from "@/assets/blog-crea-ddf.jpg";

/**
 * /resources rendered 32 bare <img src={jpg}> while AVIF and WebP siblings for
 * every one already sat in src/assets -- 2675KB of JPEG where 1351KB of AVIF
 * would do. This resolver is what closes that gap for pages that render images
 * from a data array and so cannot write explicit <Picture> imports.
 */
describe("resolveSources", () => {
  it("finds the AVIF and WebP siblings of an imported jpg", () => {
    const r = resolveSources(blogCrea);
    expect(r.src).toBe(blogCrea);
    expect(r.avif, "AVIF sibling not resolved").toBeTruthy();
    expect(r.webp, "WebP sibling not resolved").toBeTruthy();
    expect(r.avif).toMatch(/\.avif($|\?)/);
    expect(r.webp).toMatch(/\.webp($|\?)/);
  });

  it("pairs siblings by authored stem, never by parsing the build hash", () => {
    // The hash cannot be parsed off safely: "blog-ai-transformation.jpg" ends
    // in a segment indistinguishable from an 8-character hash, so a regex that
    // strips one strips the other. This asserts the pairing is correct for an
    // asset whose name would defeat that approach.
    const r = resolveSources(blogCrea);
    expect(r.avif).toContain("blog-crea-ddf");
    expect(r.webp).toContain("blog-crea-ddf");
  });

  it("returns the original untouched when it knows nothing about the url", () => {
    // A remote or runtime URL must pass straight through rather than
    // resolving to undefined sources and rendering a broken <picture>.
    const r = resolveSources("https://cdn.example.com/x.jpg");
    expect(r).toEqual({ src: "https://cdn.example.com/x.jpg" });
  });
});
