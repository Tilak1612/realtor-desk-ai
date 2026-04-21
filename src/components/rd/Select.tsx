import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { IconChevron } from "./icons";

// Plain native <select> styled to the redesign. We deliberately do not
// reach for Radix here — the filter bar and table controls use short,
// known lists; native preserves keyboard + accessibility for free.

export interface RDSelectOption {
  value: string;
  label: string;
}

export interface RDSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: RDSelectOption[];
  /** Renders a muted label to the left of the select, e.g. "Stage". */
  label?: string;
}

export const RDSelect = forwardRef<HTMLSelectElement, RDSelectProps>(
  ({ options, label, className, ...rest }, ref) => (
    <label className="inline-flex items-center gap-2 bg-white border border-rd-ink-300 rounded-rd-md px-3 py-1.5 text-sm text-rd-ink-900 focus-within:border-rd-navy-500">
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-rd-ink-500">
          {label}
        </span>
      )}
      <select
        ref={ref}
        className={cn(
          "appearance-none bg-transparent outline-none text-sm pr-5 text-rd-ink-900",
          className
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <IconChevron className="text-rd-ink-500 -ml-5 pointer-events-none" />
    </label>
  )
);
RDSelect.displayName = "RDSelect";
