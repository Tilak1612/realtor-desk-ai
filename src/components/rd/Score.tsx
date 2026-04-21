import type { CSSProperties } from "react";
import type { LeadScoreBand } from "@/types/rd";

// Lead-score bar. Bands: hot (80+), warm (60–79), cool (40–59), cold (<40).
// Render inline in the leads table + lead detail header. The colour token
// is a --rd-score-* var so the band mapping lives in one place.

export function scoreBand(value: number): LeadScoreBand {
  if (value >= 80) return "hot";
  if (value >= 60) return "warm";
  if (value >= 40) return "cool";
  return "cold";
}

const BAND_COLOUR: Record<LeadScoreBand, string> = {
  hot: "var(--rd-score-hot)",
  warm: "var(--rd-score-warm)",
  cool: "var(--rd-score-cool)",
  cold: "var(--rd-score-cold)",
};

interface RDScoreProps {
  /** 0–100 */
  value: number;
  className?: string;
  style?: CSSProperties;
  /** Width of the bar track, px. Default 56 matches the leads table. */
  barWidth?: number;
  /** Hide the numeric readout — bar only. */
  barOnly?: boolean;
}

export function RDScore({ value, className, style, barWidth = 56, barOnly = false }: RDScoreProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const colour = BAND_COLOUR[scoreBand(clamped)];
  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, ...style }}
    >
      <div
        style={{
          width: barWidth,
          height: 4,
          background: "var(--rd-ink-100)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${clamped}%`, height: "100%", background: colour }} />
      </div>
      {!barOnly && (
        <span
          style={{
            fontVariantNumeric: "tabular-nums",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--rd-ink-900)",
          }}
        >
          {clamped}
        </span>
      )}
    </div>
  );
}
