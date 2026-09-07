import { DeviceFrame } from "./DeviceFrame";
import { Picture } from "@/components/Picture";
import {
  SHOTS,
  RASTER_BY_STEM,
  AVIF_BY_STEM,
  WEBP_BY_STEM,
  type ShotName,
} from "./dashboardShots";

/**
 * Renders a real product screenshot inside a device bezel -- or nothing at all.
 *
 * The gap this closes is the LAST step. DeviceFrame already existed and was
 * rendered nowhere, so even after capturing the screenshots someone would still
 * have had to hand-edit JSX to place them. Looking the asset up at build time
 * and returning null when it is absent makes
 *
 *   npm run capture:screenshots && npm run optimize:images
 *
 * the whole procedure -- no follow-up edit, and nothing to forget.
 *
 * Returning null rather than an empty bezel is the point. A frame with no
 * screenshot in it reads as a product image that failed to load, which puts a
 * claim on the page without the evidence behind it -- the same fault as the
 * AI-generated fake screenshot this replaces.
 */
export function DashboardPreview({
  shot,
  alt,
  className,
  priority = false,
}: {
  shot: ShotName;
  /** Describe what the screenshot SHOWS. Never assert a result it cannot support. */
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const src = RASTER_BY_STEM.get(shot);
  if (!src) return null;

  const { w, h, variant } = SHOTS[shot];

  return (
    <DeviceFrame variant={variant} className={className}>
      <Picture
        src={src}
        avif={AVIF_BY_STEM.get(shot)}
        webp={WEBP_BY_STEM.get(shot)}
        width={w}
        height={h}
        alt={alt}
        priority={priority}
        className="w-full h-auto block"
      />
    </DeviceFrame>
  );
}

export default DashboardPreview;
