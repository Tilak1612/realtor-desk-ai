import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconFilter, IconSearch } from "./icons";
import { RDInput } from "./Input";
import { RDSelect, type RDSelectOption } from "./Select";

// Filter bar used on /app/pipeline (v2) and /app/leads. Accepts any number
// of labelled selects + a free-text search. Kept layout-agnostic so a
// page can place this inside or outside its main content grid.

export interface RDFilterDefinition {
  key: string;
  label: string;
  value: string;
  options: RDSelectOption[];
  onChange: (v: string) => void;
}

interface RDFilterBarProps {
  filters: RDFilterDefinition[];
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  /** Renders after the filters (usually actions — New lead, Export). */
  actions?: ReactNode;
  className?: string;
}

export function RDFilterBar({
  filters,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search leads, listings, conversations…",
  actions,
  className,
}: RDFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 bg-white border border-rd-line rounded-rd-md px-3 py-2",
        className
      )}
    >
      <div className="flex items-center gap-1.5 pl-1 pr-2 text-rd-ink-500">
        <IconFilter />
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]">Filters</span>
      </div>

      {filters.map((f) => (
        <RDSelect
          key={f.key}
          label={f.label}
          value={f.value}
          options={f.options}
          onChange={(e) => f.onChange(e.currentTarget.value)}
        />
      ))}

      {onSearchChange !== undefined && (
        <div className="flex-1 min-w-[220px]">
          <RDInput
            variant="inset"
            value={searchValue}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
            placeholder={searchPlaceholder}
            leading={<IconSearch />}
          />
        </div>
      )}

      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}
