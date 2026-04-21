import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Redesign Card. Three tones:
//   paper — white surface, slate border, small shadow (default)
//   navy  — navy surface, white text (feature sections on light pages)
//   dark  — near-black surface, white text (CRM preview sections)
// Padding defaults to 24px; pass `padding={0}` to build list-style cards
// where internal sections own their own padding.

type Tone = "paper" | "navy" | "dark";

export interface RDCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  /** px value. 0 means no padding — caller handles internal spacing. */
  padding?: number;
}

const TONE_CLASSES: Record<Tone, string> = {
  paper: "bg-rd-card text-rd-ink-900 border border-rd-line shadow-rd-sm",
  navy: "bg-rd-navy-800 text-white border-transparent",
  dark: "bg-rd-ink-900 text-white border-transparent",
};

export const RDCard = forwardRef<HTMLDivElement, RDCardProps>(
  ({ tone = "paper", padding = 24, className, style, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-rd-lg", TONE_CLASSES[tone], className)}
      style={{ padding, ...style }}
      {...rest}
    />
  )
);
RDCard.displayName = "RDCard";
