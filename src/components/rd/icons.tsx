import type { SVGProps } from "react";

// Redesign icon set. Ported from rd-shared.jsx RDI — stroke-based, matches
// the institutional tone the brand calls for. Stroke-width 1.6 default,
// 14×14 box at home size. Accepts all standard SVG props so callers can
// override size / className / colour.

type IconProps = SVGProps<SVGSVGElement>;

const base = (w: number, h: number) => ({
  width: w,
  height: h,
  viewBox: `0 0 ${w} ${h}`,
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
});

export const IconSearch = (p: IconProps) => (
  <svg {...base(16, 16)} viewBox="0 0 20 20" {...p}>
    <circle cx="9" cy="9" r="6" />
    <path d="M14 14l4 4" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base(14, 14)} strokeWidth={1.8} {...p}>
    <path d="M7 2v10M2 7h10" />
  </svg>
);

export const IconArrow = (p: IconProps) => (
  <svg {...base(14, 14)} strokeWidth={1.8} {...p}>
    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(14, 14)} strokeWidth={2} {...p}>
    <path d="M2.5 7.5L5.5 10.5L11.5 3.5" />
  </svg>
);

export const IconChevron = (p: IconProps) => (
  <svg {...base(12, 12)} strokeWidth={1.8} {...p}>
    <path d="M3 5l3 3 3-3" />
  </svg>
);

export const IconSparkle = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden {...p}>
    <path d="M7 0l1.6 4.4L13 6 8.6 7.6 7 12 5.4 7.6 1 6l4.4-1.6L7 0z" />
  </svg>
);

export const IconSparkles = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden {...p}>
    <path d="M5 0l1 2.5L8.5 3.5 6 4.5 5 7 4 4.5 1.5 3.5 4 2.5 5 0zM10.5 6l.7 1.8L13 8.5l-1.8.7-.7 1.8-.7-1.8L8 8.5l1.8-.7.7-1.8z" />
  </svg>
);

export const IconDot = (p: IconProps) => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden {...p}>
    <circle cx="4" cy="4" r="3" />
  </svg>
);

export const IconMenu = (p: IconProps) => (
  <svg {...base(18, 18)} strokeWidth={1.8} {...p}>
    <path d="M3 5h12M3 9h12M3 13h12" />
  </svg>
);

export const IconFilter = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <path d="M2 3h10l-4 5v4l-2 1V8L2 3z" />
  </svg>
);

export const IconBell = (p: IconProps) => (
  <svg {...base(16, 16)} viewBox="0 0 18 18" {...p}>
    <path d="M9 2v1M4 8a5 5 0 0110 0v3l1 2H3l1-2V8zM7 15h4" />
  </svg>
);

export const IconPhone = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <path d="M3 2l2 0 1 3-1.5 1a8 8 0 004 4L9.5 9 12 10v2a1 1 0 01-1 1A9 9 0 012 4a1 1 0 011-1z" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <rect x="1.5" y="3" width="11" height="8" rx="1" />
    <path d="M1.5 4l5.5 4 5.5-4" />
  </svg>
);

export const IconHome = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <path d="M2 6l5-4 5 4v6H2z" />
  </svg>
);

export const IconCalendar = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <rect x="1.5" y="2.5" width="11" height="10" rx="1" />
    <path d="M1.5 5.5h11M5 1v2M9 1v2" />
  </svg>
);

export const IconPie = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <path d="M7 1v6l5 3A6 6 0 117 1z" />
  </svg>
);

export const IconCog = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <circle cx="7" cy="7" r="2.2" />
    <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.7 2.7l1.1 1.1M10.2 10.2l1.1 1.1M2.7 11.3l1.1-1.1M10.2 3.8l1.1-1.1" />
  </svg>
);

export const IconLead = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <circle cx="7" cy="5" r="2.2" />
    <path d="M2.5 12c0-2.2 2-3.8 4.5-3.8S11.5 9.8 11.5 12" />
  </svg>
);

export const IconPipeline = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <rect x="1" y="2" width="3.5" height="10" />
    <rect x="5.2" y="2" width="3.5" height="7" />
    <rect x="9.4" y="2" width="3.5" height="4" />
  </svg>
);

export const IconShield = (p: IconProps) => (
  <svg {...base(14, 14)} {...p}>
    <path d="M7 1l5 2v4c0 3-2.2 5.2-5 6-2.8-.8-5-3-5-6V3l5-2z" />
  </svg>
);

export const IconGlobe = (p: IconProps) => (
  <svg {...base(14, 14)} strokeWidth={1.5} {...p}>
    <circle cx="7" cy="7" r="5.5" />
    <path d="M1.5 7h11M7 1.5c1.8 2 2.8 4 2.8 5.5S8.8 10.5 7 12.5M7 1.5C5.2 3.5 4.2 5.5 4.2 7S5.2 10.5 7 12.5" />
  </svg>
);

export const IconBolt = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden {...p}>
    <path d="M8 0L2 8h4l-1 6 6-8H7l1-6z" />
  </svg>
);

export const IconMaple = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden {...p}>
    <path d="M10 1l1.5 3.5 3.5-1.5-1 3 3 1.5-3 1.5 1 3-3.5-1.5L10 14l-1.5-3.5L5 12l1-3-3-1.5 3-1.5-1-3 3.5 1.5L10 1z" />
  </svg>
);
