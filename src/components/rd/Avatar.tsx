import type { CSSProperties } from "react";

// Deterministic initials-on-colour avatar, ported from rd-shared.jsx.
// The same name always produces the same background colour — good for
// the leads table, kanban cards, and inbox list where stability matters.

// Every entry must clear 4.5:1 against the white initials drawn on it.
// #B88A2E was 3.13:1 -- the only failing member, and it appeared on any name
// whose char-code sum landed on it, so the defect was intermittent by name.
const PALETTE = ["#0B2540", "#1F4A72", "#BE552F", "#1F7A4D", "#6B4FA8", "#85621B"];

function hashedColor(name: string): string {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface RDAvatarProps {
  name: string;
  size?: number;
  /** Override the hashed background colour. */
  tone?: string;
  className?: string;
  style?: CSSProperties;
}

export function RDAvatar({ name, size = 32, tone, className, style }: RDAvatarProps) {
  const bg = tone ?? hashedColor(name);
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 600,
        letterSpacing: 0.2,
        flexShrink: 0,
        ...style,
      }}
    >
      {initials(name)}
    </div>
  );
}
