/**
 * Maps an already-imported raster URL to its AVIF and WebP siblings.
 *
 * Vite content-hashes every asset independently, so "hero-a1b2.jpg" has no
 * derivable relationship to "hero-c3d4.avif" -- string replacement on the URL
 * silently 404s. That is why <Picture> takes explicit imports.
 *
 * Pages that render a *list* of images from a data array cannot practically do
 * that: /resources alone would need 96 import lines. The tempting shortcut is
 * to parse the hash out of the built URL, but that cannot be done safely --
 * "blog-ai-transformation.jpg" ends in a segment indistinguishable from an
 * eight-character hash, so a regex that strips one strips the other.
 *
 * So this builds the mapping from the SOURCE paths import.meta.glob already
 * provides, and never inspects a hash at all:
 *
 *   glob key    /src/assets/blog-crea-ddf.jpg    (stable, authored)
 *   glob value  /assets/blog-crea-ddf-B7xQ.jpg   (hashed, built)
 *
 * Keying on the former and looking up by the latter is exact.
 */

type UrlMap = Record<string, string>;

const RASTER = import.meta.glob("/src/assets/*.{jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;

const AVIF = import.meta.glob("/src/assets/*.avif", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;

const WEBP = import.meta.glob("/src/assets/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;

/** "/src/assets/blog-crea-ddf.jpg" -> "blog-crea-ddf" */
function stemOf(sourcePath: string): string {
  const file = sourcePath.split("/").pop() ?? "";
  return file.replace(/\.[a-z0-9]+$/i, "");
}

function byStem(map: UrlMap): Map<string, string> {
  return new Map(Object.entries(map).map(([src, url]) => [stemOf(src), url]));
}

const AVIF_BY_STEM = byStem(AVIF);
const WEBP_BY_STEM = byStem(WEBP);

/** built URL -> authored stem. Exact, no hash parsing. */
const STEM_BY_URL = new Map(
  Object.entries(RASTER).map(([src, url]) => [url, stemOf(src)])
);

export interface ResolvedSources {
  src: string;
  avif?: string;
  webp?: string;
  /** `srcset` value with width descriptors, when narrower variants exist. */
  avifSrcSet?: string;
  webpSrcSet?: string;
}

/**
 * Builds a srcset from whichever width variants the optimizer produced.
 *
 * The variants are optional by design: a source narrower than 640px never gets
 * one, because upscaling would ship a bigger file that is no sharper. When
 * none exist this returns undefined and the caller falls back to the single
 * full-width source, which is exactly the previous behaviour.
 */
function srcSetFor(stem: string, ext: "avif" | "webp", full: string): string | undefined {
  const map = ext === "avif" ? AVIF_BY_STEM : WEBP_BY_STEM;
  const parts: string[] = [];
  for (const w of [640, 960]) {
    const v = map.get(`${stem}-${w}w`);
    if (v) parts.push(`${v} ${w}w`);
  }
  if (!parts.length) return undefined;
  // The full-width file closes the set. Its real width is unknown here, so it
  // is described generously; browsers pick the smallest candidate that clears
  // the slot, and an over-stated top end only means it is chosen less often.
  parts.push(`${full} 1600w`);
  return parts.join(", ");
}

/**
 * Given the URL of an imported jpg/png, returns it plus whichever modern
 * siblings exist. An asset with no siblings resolves to just `src`, so a newly
 * added image renders correctly before anyone runs the optimizer.
 */
export function resolveSources(importedUrl: string): ResolvedSources {
  const stem = STEM_BY_URL.get(importedUrl);
  if (!stem) return { src: importedUrl };
  const avif = AVIF_BY_STEM.get(stem);
  const webp = WEBP_BY_STEM.get(stem);
  return {
    src: importedUrl,
    avif,
    webp,
    avifSrcSet: avif ? srcSetFor(stem, "avif", avif) : undefined,
    webpSrcSet: webp ? srcSetFor(stem, "webp", webp) : undefined,
  };
}
