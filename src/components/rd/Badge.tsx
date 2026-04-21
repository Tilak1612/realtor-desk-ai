import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Redesign Badge (pill). Tones match rd-shared.jsx RDBadge. Sizes map to:
//   sm — 11px text, tight padding (used inside cards, nav counters)
//   md — 12px text, default
// Always uses the pill radius. Always has a 1px border for the slight
// institutional separation from the surface behind it.

type Tone = "neutral" | "navy" | "terra" | "success" | "warning" | "danger" | "dark" | "ghost";
type Size = "sm" | "md";

export interface RDBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
}

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-rd-ink-100 text-rd-ink-700 border-rd-ink-200",
  navy: "bg-rd-navy-100 text-rd-navy-800 border-rd-navy-200",
  terra: "bg-rd-terra-100 text-rd-terra-800 border-rd-terra-200",
  success: "bg-rd-success-bg text-rd-success border-[#BFE2CF]",
  warning: "bg-rd-warning-bg text-[#6F5111] border-[#ECD79C]",
  danger: "bg-rd-danger-bg text-rd-danger border-[#EFB8B8]",
  dark: "bg-rd-ink-900 text-white border-rd-ink-900",
  ghost: "bg-transparent text-rd-ink-600 border-rd-ink-200",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-2 py-[2px] text-[11px]",
  md: "px-2.5 py-[3px] text-xs",
};

export function RDBadge({ tone = "neutral", size = "md", className, children, ...rest }: RDBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-rd-pill border font-semibold tracking-[0.02em]",
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
