import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CSS-drawn device bezels that hold a real product screenshot.
 *
 * This is the fallback tier described in the asset plan, and it ships first
 * on purpose. A generated device shell (assets H-03 to H-05) is a refinement
 * of the bezel, not of the content -- the screenshot inside is identical
 * either way. Building the CSS frame first means the marketing page shows the
 * real product regardless of whether image generation ever happens.
 *
 * Nothing here renders interface: the children are a screenshot of the running
 * application, never a reconstruction of one.
 */

type Variant = "laptop" | "tablet" | "phone";

const SHELL: Record<Variant, string> = {
  // Aspect ratios match the capture sizes in scripts/capture-screenshots.mjs,
  // so a screenshot drops in without letterboxing or distortion.
  laptop: "rounded-t-[12px] rounded-b-[4px] p-[10px] pb-[14px]",
  tablet: "rounded-[18px] p-[12px]",
  phone: "rounded-[34px] p-[8px]",
};

const SCREEN: Record<Variant, string> = {
  laptop: "rounded-[4px]",
  tablet: "rounded-[10px]",
  phone: "rounded-[27px]",
};

export function DeviceFrame({
  variant,
  children,
  className,
  shadow = true,
}: {
  variant: Variant;
  /** A real screenshot. Pass <Picture>, which enforces width/height. */
  children: ReactNode;
  className?: string;
  shadow?: boolean;
}) {
  return (
    // data-device-frame is what verify-live.mjs looks for. Detecting product
    // screenshots by filename pattern would mean guessing, and a rename would
    // silently disable the check rather than fail it -- the same mistake that
    // made the pricing-card locator match nothing.
    <div className={cn("relative", className)} data-device-frame={variant}>
      <div
        className={cn(
          "bg-rd-ink-900 ring-1 ring-black/10",
          SHELL[variant],
          shadow && "shadow-[0_24px_60px_-16px_rgba(11,37,64,0.35)]"
        )}
      >
        <div className={cn("overflow-hidden bg-white", SCREEN[variant])}>
          {children}
        </div>
      </div>

      {/* The laptop's base. Drawn rather than imaged so it scales with the
          frame and costs nothing to download. */}
      {variant === "laptop" && (
        <div
          aria-hidden="true"
          className="mx-auto h-[10px] w-[112%] -translate-x-[5.4%] rounded-b-[10px] bg-rd-ink-800 shadow-[0_10px_24px_-8px_rgba(11,37,64,0.4)]"
        />
      )}

      {/* Phone speaker slot. Decorative; announced to nobody. */}
      {variant === "phone" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[14px] h-[5px] w-[86px] -translate-x-1/2 rounded-full bg-black/70"
        />
      )}
    </div>
  );
}

export default DeviceFrame;
