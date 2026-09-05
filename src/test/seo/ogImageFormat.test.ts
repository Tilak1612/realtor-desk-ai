import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * og:image must never be an SVG.
 *
 * Facebook, LinkedIn and X do not render SVG. Pointing og:image at one
 * produces a share card with NO IMAGE AT ALL, and nothing reports an error --
 * not the build, not the browser, not any runtime check. The only symptom is
 * a blank card someone notices weeks later.
 *
 * This nearly shipped: replacing blog-ai-crm.jpg with an SVG would have broken
 * the share card for that guide, because AICRMGuide.tsx feeds the same import
 * to <SEO image=...>. Caught only because an import-swap count came back 3/4
 * instead of 4/4.
 *
 * scripts/make-brand-headers.mjs now emits a .jpg twin beside every .svg for
 * exactly this. The rule is: .svg on the page, raster for social.
 */
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

describe("og:image is always a raster", () => {
  const files = walk(join(process.cwd(), "src/pages"));

  it("finds pages that set an SEO image at all", () => {
    // Guards the guard: if the prop is ever renamed, the sweep below would
    // silently inspect nothing and pass forever.
    const withImage = files.filter((f) => /image=\{/.test(readFileSync(f, "utf8")));
    expect(withImage.length).toBeGreaterThan(5);
  });

  it.each([true])("no SEO image resolves to an .svg import", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(/image=\{([A-Za-z0-9_]+)\}/g)) {
        const varName = m[1];
        const imp = src.match(
          new RegExp(`import\\s+${varName}\\s+from\\s+"([^"]+)"`)
        );
        if (imp && imp[1].endsWith(".svg")) {
          offenders.push(`${file.split("/src/")[1]} -> ${imp[1]}`);
        }
      }
    }

    expect(
      offenders,
      `og:image pointing at SVG produces a share card with no image:\n  ${offenders.join("\n  ")}`
    ).toEqual([]);
  });

  it("every generated brand SVG has a raster twin for social", () => {
    const brand = join(process.cwd(), "src/assets/brand");
    const names = readdirSync(brand);
    const svgs = names.filter((f) => f.endsWith(".svg"));
    expect(svgs.length).toBeGreaterThan(0);

    const missing = svgs
      .map((f) => f.replace(/\.svg$/, ""))
      .filter((stem) => !names.includes(`${stem}.jpg`) && !names.includes(`${stem}.png`));

    expect(
      missing,
      `brand SVGs with no raster twin — these cannot be used as og:image: ${missing.join(", ")}`
    ).toEqual([]);
  });
});
