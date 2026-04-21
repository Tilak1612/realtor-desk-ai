import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Redesign Input. Two visual modes:
//   `inset` — sits inside a pill-style search shell (topbar search, inbox
//             filter). Caller wraps the input with icons; this variant is
//             border-free, inherits background.
//   `bordered` — standard form input with paper background + slate border.
//                Default.
// Pass `leading`/`trailing` for inline icons in either mode.

type Variant = "inset" | "bordered";

export interface RDInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  leading?: ReactNode;
  trailing?: ReactNode;
  wrapperClassName?: string;
}

const WRAPPER: Record<Variant, string> = {
  inset: "flex items-center gap-2 bg-rd-ink-50 border border-rd-line rounded-rd-md px-3.5 py-2 text-rd-ink-500",
  bordered:
    "flex items-center gap-2 bg-white border border-rd-ink-300 rounded-rd-md px-3.5 py-2 text-rd-ink-900 focus-within:border-rd-navy-500",
};

export const RDInput = forwardRef<HTMLInputElement, RDInputProps>(
  ({ variant = "bordered", leading, trailing, className, wrapperClassName, ...rest }, ref) => (
    <label className={cn(WRAPPER[variant], wrapperClassName)}>
      {leading}
      <input
        ref={ref}
        className={cn(
          "flex-1 bg-transparent outline-none text-sm text-rd-ink-900 placeholder:text-rd-ink-400",
          className
        )}
        {...rest}
      />
      {trailing}
    </label>
  )
);
RDInput.displayName = "RDInput";
