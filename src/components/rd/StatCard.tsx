import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// KPI tile rendered in the /app dashboard 4-up grid. Port of RDKpi.
// Label (upper caps), value (30px tabular), optional delta + tone, optional
// sparkline slot. Surface is paper with a 1px slate border.

type DeltaTone = "success" | "danger" | "neutral";

interface RDStatCardProps {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: DeltaTone;
  /** Small sparkline slot; usually an <svg>. */
  sparkline?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const DELTA_COLOUR: Record<DeltaTone, string> = {
  success: "text-rd-success",
  danger: "text-rd-danger",
  neutral: "text-rd-ink-500",
};

export function RDStatCard({
  label,
  value,
  delta,
  deltaTone = "success",
  sparkline,
  className,
  style,
}: RDStatCardProps) {
  return (
    <div
      className={cn(
        // A resting shadow only -- no lift, no hover. A KPI tile is something
        // you read, not something you click, and a hover affordance here would
        // promise an interaction that does not exist. The shadow just stops the
        // tile sitting flat in the canvas.
        "bg-rd-card border border-rd-line rounded-rd-lg p-5 flex flex-col gap-2.5",
        "shadow-[0_1px_2px_rgba(11,37,64,0.04),0_6px_16px_-12px_rgba(11,37,64,0.14)]",
        className
      )}
      style={style}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-rd-ink-500">
        {label}
      </div>
      <div className="flex items-baseline gap-2.5">
        <div className="text-[30px] font-bold tracking-[-0.02em] text-rd-ink-900 tabular-nums">
          {value}
        </div>
        {delta && (
          <span className={cn("text-xs font-semibold", DELTA_COLOUR[deltaTone])}>{delta}</span>
        )}
      </div>
      {sparkline}
    </div>
  );
}
