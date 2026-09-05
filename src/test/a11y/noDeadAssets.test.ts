import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Unreferenced assets are not free in this project.
 *
 * src/lib/images/resolveSources.ts uses import.meta.glob with { eager: true },
 * which means EVERY file in src/assets is imported and therefore emitted to
 * dist -- referenced or not. Nine unused images were shipping 27 files and
 * 1.09MB that no page could ever request.
 *
 * That is a direct consequence of how resolveSources works, so it is worth a
 * guard rather than a one-off cleanup: the next unused asset costs the same.
 */
const ASSETS = join(process.cwd(), "src/assets");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|css)$/.test(full)) out.push(full);
  }
  return out;
}

const SOURCE = walk(join(process.cwd(), "src"))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

describe("no dead assets", () => {
  it("every raster in src/assets is referenced by name somewhere", () => {
    const rasters = readdirSync(ASSETS).filter((f) => /\.(jpe?g|png)$/i.test(f));
    expect(rasters.length).toBeGreaterThan(0);

    const orphans = rasters.filter((f) => {
      const stem = f.replace(/\.[a-z0-9]+$/i, "");
      // Logo drafts are brand material, plausibly kept on purpose rather than
      // forgotten. Excluded deliberately, not overlooked.
      if (/^logo-option-/.test(stem)) return false;
      return !SOURCE.includes(stem);
    });

    expect(
      orphans,
      `unreferenced, but still emitted to dist because resolveSources globs eagerly: ${orphans.join(", ")}`
    ).toEqual([]);
  });
});
