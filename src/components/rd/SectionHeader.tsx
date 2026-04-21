import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Two variants of the "eyebrow + H2 + lede" pattern the marketing site
// uses on every feature section (rd-marketing.jsx Eyebrow + h2). The
// `tone` prop flips foreground colours for dark navy or ink-900 sections.

type Tone = "light" | "dark";

interface RDSectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Italic serif accent word(s) appended inside the h2. */
  accent?: ReactNode;
  subtitle?: ReactNode;
  tone?: Tone;
  className?: string;
  /** Optional right-aligned lede paragraph (pairs with title on the left). */
  lede?: ReactNode;
}

export function RDSectionHeader({
  eyebrow,
  title,
  accent,
  subtitle,
  tone = "light",
  className,
  lede,
}: RDSectionHeaderProps) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end md:justify-between gap-6",
        className
      )}
    >
      <div className="max-w-[720px]">
        {eyebrow && (
          <div
            className={cn(
              "text-[11px] font-bold uppercase tracking-[0.14em]",
              dark ? "text-rd-terra-400" : "text-rd-terra-700"
            )}
          >
            {eyebrow}
          </div>
        )}
        <h2
          className={cn(
            "mt-2.5 text-[40px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.08]",
            dark ? "text-white" : "text-rd-ink-900"
          )}
        >
          {title}
          {accent && (
            <>
              {" "}
              <span
                className={cn(
                  "font-rd-serif italic font-normal",
                  dark ? "text-rd-terra-400" : "text-rd-terra-600"
                )}
              >
                {accent}
              </span>
            </>
          )}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-4 text-base md:text-[17px] leading-[1.6]",
              dark ? "text-white/70" : "text-rd-ink-600"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {lede && (
        <p
          className={cn(
            "max-w-[340px] text-base leading-[1.55]",
            dark ? "text-white/60" : "text-rd-ink-600"
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
