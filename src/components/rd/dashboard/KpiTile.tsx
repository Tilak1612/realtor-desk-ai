import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { IconArrow } from "../icons";

// Dashboard v2 KPI tile. Unlike RDStatCard (deliberately non-interactive),
// every v2 tile is a link to the list it counts — the FUB drill-down pattern
// the August audit found missing. The whole tile is the hit target, and its
// accessible name is its own visible text — label, value, the change or
// overdue line, and the time window — so nothing a sighted user reads is
// withheld from a screen reader.

export type Tone = "good" | "bad" | "neutral" | "warn";

const TONE: Record<Tone, string> = {
  good: "text-rd-success",
  bad: "text-rd-danger",
  // rd-warning (#B88A2E) is 3:1 on white; this darker step clears AA for small text.
  warn: "text-[#8A6516]",
  neutral: "text-rd-ink-500",
};

interface KpiTileProps {
  label: string;
  value: ReactNode;
  unit?: string;
  /** Second line under the value: change vs prior, overdue count, a goal bar… */
  detail?: ReactNode;
  detailTone?: Tone;
  /** Time window, e.g. "Last 7 days". Every tile says its window. */
  window: string;
  href: string;
  openLabel: string;
  emphasis?: boolean;
}

export function KpiTile({
  label,
  value,
  unit,
  detail,
  detailTone = "neutral",
  window,
  href,
  openLabel,
  emphasis,
}: KpiTileProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group bg-rd-card border border-rd-line rounded-rd-lg p-4 flex flex-col gap-1.5 min-h-[124px] no-underline",
        "shadow-[0_1px_2px_rgba(11,37,64,0.04),0_6px_16px_-12px_rgba(11,37,64,0.14)]",
        "transition-colors hover:border-rd-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500",
        "motion-safe:transition-transform motion-safe:hover:-translate-y-px",
        emphasis && "border-rd-terra-300 bg-rd-terra-50"
      )}
    >
      {/* The {" "} nodes are invisible in a flex column but keep the link's
          accessible name readable: "Awaiting reply 2 Right now", not "reply2". */}
      <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-rd-ink-500">{label}</span>{" "}
      <span className="flex items-baseline gap-1">
        <span className="text-[28px] leading-[1.1] font-bold tracking-[-0.02em] text-rd-ink-900 tabular-nums">{value}</span>
        {unit && <span className="text-sm font-semibold text-rd-ink-500">{" "}{unit}</span>}
      </span>{" "}
      {detail && <span className={cn("text-xs font-semibold tabular-nums", TONE[detailTone])}>{detail}</span>}{" "}
      <span className="mt-auto pt-1 flex items-center justify-between gap-2 text-[11px] text-rd-ink-500">
        <span>{window}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-rd-navy-700 group-hover:underline" aria-hidden="true">
          {openLabel} <IconArrow />
        </span>
      </span>
    </Link>
  );
}
