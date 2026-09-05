#!/usr/bin/env node
/**
 * Generate AVIF and WebP siblings for every raster asset.
 *
 * Why pre-generate and commit rather than transform at build time: the project
 * has no image plugin, and adding one (vite-imagetools et al) would introduce a
 * dependency plus a build-time cost for output that never changes between
 * builds. `sharp` is already present transitively, so this needs nothing new.
 *
 * The source JPEGs are drastically over-encoded — hero-dashboard-ai.jpg is
 * 1145KB for a 1344x768 image, which AVIF renders at 36KB with no visible
 * difference. Originals are kept as the <picture> fallback for browsers
 * without AVIF/WebP, and are NOT deleted.
 *
 * Idempotent: skips any output newer than its source. Run with --force to
 * regenerate everything.
 *
 *   node scripts/optimize-images.mjs [--force]
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIRS = ["src/assets", "public"];
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png"]);
const FORCE = process.argv.includes("--force");

// Quality chosen by eye against the heroes: AVIF 55 and WebP 78 are visually
// indistinguishable from the originals at these dimensions while cutting
// 95-97% of the bytes. Raise if a specific asset shows banding.
const AVIF = { quality: 55, effort: 4 };
const WEBP = { quality: 78 };

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (SOURCE_EXT.has(extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function isStale(src, out) {
  if (FORCE || !existsSync(out)) return true;
  return statSync(src).mtimeMs > statSync(out).mtimeMs;
}

const kb = (n) => `${Math.round(n / 1024)}KB`;

let before = 0;
let afterAvif = 0;
let converted = 0;
let skipped = 0;

for (const dir of DIRS) {
  for (const src of walk(join(ROOT, dir))) {
    const base = src.replace(/\.(jpe?g|png)$/i, "");
    const avifOut = `${base}.avif`;
    const webpOut = `${base}.webp`;
    const srcSize = statSync(src).size;
    before += srcSize;

    if (!isStale(src, avifOut) && !isStale(src, webpOut)) {
      afterAvif += statSync(avifOut).size;
      skipped++;
      continue;
    }

    // Favicons and tiny icons gain nothing and can lose crispness — skip them.
    const meta = await sharp(src).metadata();
    if ((meta.width ?? 0) < 200 || (meta.height ?? 0) < 200) {
      skipped++;
      afterAvif += srcSize;
      continue;
    }

    await sharp(src).avif(AVIF).toFile(avifOut);
    await sharp(src).webp(WEBP).toFile(webpOut);
    afterAvif += statSync(avifOut).size;
    converted++;
    process.stdout.write(
      `  ${src.replace(ROOT + "/", "")}  ${kb(srcSize)} -> ${kb(statSync(avifOut).size)} avif\n`
    );
  }
}

console.log(
  `\n  converted ${converted}, skipped ${skipped}` +
    `\n  raster total ${kb(before)} -> ${kb(afterAvif)} when AVIF is served` +
    ` (${Math.round((1 - afterAvif / before) * 100)}% smaller)`
);
