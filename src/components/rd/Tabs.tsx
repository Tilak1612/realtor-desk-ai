import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Underline-style tabs used on /app/leads and /app/reports. Controlled
// component — parent owns the active value and setter. Matches the
// design's 10px/16px padding, navy underline, slate inactive colour.

export interface RDTabItem {
  value: string;
  label: ReactNode;
  /** Right-aligned count pill, e.g. " · 32". */
  count?: number | string;
}

interface RDTabsProps {
  value: string;
  onValueChange: (v: string) => void;
  items: RDTabItem[];
  className?: string;
}

export function RDTabs({ value, onValueChange, items, className }: RDTabsProps) {
  return (
    <div className={cn("flex gap-0.5 border-b border-rd-line", className)}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onValueChange(item.value)}
            className={cn(
              "px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors",
              active
                ? "text-rd-ink-900 border-rd-navy-800"
                : "text-rd-ink-500 border-transparent hover:text-rd-ink-700"
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ml-1.5 text-rd-ink-400 font-normal">· {item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
