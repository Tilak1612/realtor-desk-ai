import type { CSSProperties } from "react";

// Deterministic initials-on-colour avatar, ported from rd-shared.jsx.
// The same name always produces the same background colour — good for
// the leads table, kanban cards, and inbox list where stability matters.

const PALETTE = ["#0B2540", "#1F4A72", "#BE552F", "#1F7A4D", "#6B4FA8", "#B88A2E"];

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
