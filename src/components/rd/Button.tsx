import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Redesign Button. Variants mirror rd-shared.jsx RDButton:
//   primary — navy surface, white text (default marketing + product CTA)
//   terra   — terracotta surface, white text (emphasis / "sparkle")
//   outline — transparent with slate border (secondary CTA)
//   ghost   — transparent, slate text (nav / toolbar)
//   dark    — near-black surface (dark-on-light sections)
//   soft    — navy tint with navy text (tertiary CTA)
//   light   — white surface with navy text (on dark sections)
// All variants share the pill radius and 1px border — no gradients.

type Variant = "primary" | "terra" | "outline" | "ghost" | "dark" | "soft" | "light";
type Size = "sm" | "md" | "lg";

export interface RDButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  full?: boolean;
}

const SIZES: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-[13px]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-[15px]",
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-rd-navy-800 text-white border-rd-navy-800 hover:bg-rd-navy-900 hover:border-rd-navy-900",
  terra:
    "bg-rd-terra-600 text-white border-rd-terra-600 hover:bg-rd-terra-700 hover:border-rd-terra-700",
  outline:
    "bg-transparent text-rd-navy-800 border-rd-ink-300 hover:border-rd-ink-500",
  ghost:
    "bg-transparent text-rd-ink-700 hover:bg-rd-ink-50 border-transparent",
  dark:
    "bg-rd-ink-900 text-white border-rd-ink-900 hover:bg-rd-ink-800",
  soft:
    "bg-rd-navy-100 text-rd-navy-800 border-rd-navy-100 hover:bg-rd-navy-200 hover:border-rd-navy-200",
  light:
    "bg-white text-rd-navy-800 border-rd-ink-200 hover:bg-rd-ink-50",
};

export const RDButton = forwardRef<HTMLButtonElement, RDButtonProps>(
  (
    { variant = "primary", size = "md", icon, trailingIcon, full, className, children, ...rest },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
        "font-rd-sans font-semibold leading-tight",
        "rounded-rd-pill border transition-[background-color,border-color,color] duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60",
        SIZES[size],
        VARIANTS[variant],
        full && "w-full",
        className
      )}
      {...rest}
    >
      {icon}
      {children}
      {trailingIcon}
    </button>
  )
);
RDButton.displayName = "RDButton";
