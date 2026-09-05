import type { ImgHTMLAttributes } from "react";

/**
 * <picture> wrapper that serves AVIF, then WebP, then the original.
 *
 * Two things this fixes:
 *
 * 1. Format. Every image on the site was served as the source JPEG/PNG, which
 *    are heavily over-encoded — hero-dashboard-ai.jpg is 1145KB for a 1344x768
 *    image that AVIF renders at 36KB. Across the asset directory that is 8.2MB
 *    of raster where 2.1MB would do.
 *
 * 2. Layout shift. Not one <img> in the codebase carried width/height, so the
 *    browser could not reserve space and every image caused CLS on load. Both
 *    are required here, not optional.
 *
 * Sources are passed as explicit imports rather than derived from the src
 * string, because Vite content-hashes each file independently — "hero-a1b2.jpg"
 * has no predictable relationship to "hero-c3d4.avif", so string replacement
 * would silently 404.
 *
 *   import heroAvif from "@/assets/hero.avif";
 *   import heroWebp from "@/assets/hero.webp";
 *   import heroJpg  from "@/assets/hero.jpg";
 *
 *   <Picture avif={heroAvif} webp={heroWebp} src={heroJpg}
 *            width={1344} height={768} alt="..." priority />
 *
 * Run `node scripts/optimize-images.mjs` after adding a new raster asset to
 * generate its siblings.
 */
export interface PictureProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "loading" | "src"> {
  /** Original JPEG/PNG — the fallback, and what older browsers receive. */
  src: string;
  avif?: string;
  webp?: string;
  /** Intrinsic width in px. Required: without it the browser cannot reserve space. */
  width: number;
  /** Intrinsic height in px. Required, same reason. */
  height: number;
  alt: string;
  /**
   * True only for an image above the fold on first paint — typically one per
   * page. Sets eager loading and high fetch priority. Everything else stays
   * lazy, which is the default.
   */
  priority?: boolean;
  /** Class applied to the <picture> element; `className` goes to the <img>. */
  pictureClassName?: string;
}

export function Picture({
  src,
  avif,
  webp,
  width,
  height,
  alt,
  priority = false,
  pictureClassName,
  className,
  ...rest
}: PictureProps) {
  return (
    <picture className={pictureClassName}>
      {avif && <source srcSet={avif} type="image/avif" />}
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        // fetchPriority is still absent from React's JSX types in some versions;
        // the DOM accepts it and Chrome/Safari honour it for LCP images.
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={className}
        {...rest}
      />
    </picture>
  );
}

export default Picture;
