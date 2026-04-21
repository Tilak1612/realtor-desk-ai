import type { ReactNode, HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Low-level semantic table primitives for /app/leads. We do not pull
// TanStack Table here — the leads list is a known N-row, 8-column grid,
// and the design uses CSS grid (not HTML <table>) for the header row.
// These primitives are thin so each screen can compose the exact grid
// template it needs.

export function RDTable({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white border border-rd-line rounded-rd-lg shadow-rd-sm overflow-hidden",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function RDTableHead({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-rd-ink-50 border-b border-rd-line text-[11px] font-bold uppercase tracking-[0.06em] text-rd-ink-500",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function RDTableRow({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-b border-rd-line last:border-b-0 text-[13px] text-rd-ink-900", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function RDTableHeaderCell({
  className,
  children,
  ...rest
}: ThHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center", className)} {...rest}>
      {children}
    </div>
  );
}

export function RDTableCell({
  className,
  children,
  ...rest
}: TdHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center", className)} {...rest}>
      {children}
    </div>
  );
}

/** Shared grid template preset for the leads table — 8 tracks as
 *  specified in rd-app.jsx line 379. Consumers apply this template on
 *  both the <RDTableHead /> row and every <RDTableRow />. */
export const LEADS_GRID_TEMPLATE = "24px 2fr 1.4fr 1fr 1.4fr 1fr 1.2fr 100px";

export function gridRow(template: string): { display: string; gridTemplateColumns: string } {
  return { display: "grid", gridTemplateColumns: template };
}

/** Optional renderless helper for <Table> consumers. */
export function TableChildren({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
