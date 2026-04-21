import type { CSSProperties } from "react";

// Refined house-R mark from rd-shared.jsx. Reads as a premium institutional
// mark at 16px and at 400px. Tone: navy (default), paper (for dark
// surfaces), or terra (accent variant).

type Tone = "navy" | "paper" | "terra";

interface RDMarkProps {
  size?: number;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
}

export function RDMark({ size = 28, tone = "navy", className, style }: RDMarkProps) {
  const fill =
    tone === "paper" ? "#FFFFFF" : tone === "terra" ? "var(--rd-terra-600)" : "var(--rd-navy-800)";
  const accent = tone === "paper" ? "var(--rd-terra-400)" : "var(--rd-terra-600)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      style={style}
      aria-hidden
    >
      {/* roof */}
      <path d="M20 4L4 15v2.6L20 7.4L36 17.6V15L20 4z" fill={fill} />
      {/* chimney notch */}
      <rect x="26.5" y="6" width="3" height="4.2" fill={fill} />
      {/* slab R */}
      <path
        d="M9 15.5h11.2c3.6 0 6.2 2.3 6.2 5.9 0 2.5-1.3 4.4-3.4 5.3L27 34.5h-4.4l-3.3-6.6H13V34.5H9V15.5zm4 4v4.8h6.6c1.5 0 2.5-.9 2.5-2.4s-1-2.4-2.5-2.4H13z"
        fill={fill}
      />
      {/* accent dot on roof window */}
      <circle cx="20" cy="13.2" r="1.4" fill={accent} />
    </svg>
  );
}

interface RDWordmarkProps {
  size?: number;
  tone?: Tone;
  showAI?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function RDWordmark({
  size = 20,
  tone = "navy",
  showAI = true,
  className,
  style,
}: RDWordmarkProps) {
  const fill = tone === "paper" ? "#FFFFFF" : "var(--rd-navy-800)";
  const accent = tone === "paper" ? "var(--rd-terra-400)" : "var(--rd-terra-600)";
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.45,
        fontFamily: "var(--rd-font-sans)",
        fontWeight: 700,
        fontSize: size,
        letterSpacing: -0.3,
        color: fill,
        lineHeight: 1,
        ...style,
      }}
    >
      <RDMark size={size * 1.35} tone={tone} />
      <span style={{ display: "inline-flex", gap: "0.32em", alignItems: "baseline" }}>
        <span>RealtorDesk</span>
        {showAI && <span style={{ color: accent, fontWeight: 600 }}>AI</span>}
      </span>
    </span>
  );
}
