/**
 * Which product screenshots exist, and where.
 *
 * Kept apart from DashboardPreview.tsx deliberately: that file should export a
 * component and nothing else, or Fast Refresh stops working for it. This is
 * data and lookup, not UI.
 *
 * The screenshots are not in the repo. scripts/capture-screenshots.mjs signs
 * into a demo account and writes them to src/assets/product/, which needs
 * credentials the operator supplies at runtime. Until someone runs it there is
 * no honest image to show -- the brief forbids inventing dashboard text, and a
 * mocked-up dashboard is exactly that.
 *
 * import.meta.glob is resolved by Vite at build time, so the absent case costs
 * nothing at runtime: the lookup is an empty Map and files that do not exist
 * are never referenced in the bundle.
 */

type UrlMap = Record<string, string>;

const RASTER = import.meta.glob("/src/assets/product/*.{png,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;

const AVIF = import.meta.glob("/src/assets/product/*.avif", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;

const WEBP = import.meta.glob("/src/assets/product/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;

/** "/src/assets/product/shot-dashboard-desktop.png" -> "shot-dashboard-desktop" */
function stemOf(path: string): string {
  return (path.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");
}

function byStem(map: UrlMap): Map<string, string> {
  return new Map(Object.entries(map).map(([p, url]) => [stemOf(p), url]));
}

export const RASTER_BY_STEM = byStem(RASTER);
export const AVIF_BY_STEM = byStem(AVIF);
export const WEBP_BY_STEM = byStem(WEBP);

/**
 * The shots scripts/capture-screenshots.mjs produces, at the size it captures
 * them. The dimensions are what let the browser reserve the box before the
 * bytes arrive; a disagreement with the script means every preview ships the
 * wrong aspect ratio and reflows on load, so a test cross-checks them.
 */
export const SHOTS = {
  "shot-dashboard-desktop": { w: 1440, h: 900, variant: "laptop" },
  "shot-leads-desktop": { w: 1440, h: 900, variant: "laptop" },
  "shot-pipeline-desktop": { w: 1440, h: 900, variant: "laptop" },
  "shot-inbox-desktop": { w: 1440, h: 900, variant: "laptop" },
  "shot-dashboard-mobile": { w: 390, h: 844, variant: "phone" },
  "shot-inbox-mobile": { w: 390, h: 844, variant: "phone" },
} as const;

export type ShotName = keyof typeof SHOTS;

/**
 * True when the screenshot has been captured. Lets a caller drop a whole
 * section -- heading and all -- rather than leave an orphaned title above
 * nothing.
 */
export function hasShot(name: ShotName): boolean {
  return RASTER_BY_STEM.has(name);
}
