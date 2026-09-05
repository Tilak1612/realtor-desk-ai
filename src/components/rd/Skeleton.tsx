import { cn } from "@/lib/utils";

/**
 * Loading placeholders for the RD product shell.
 *
 * There was no skeleton usage anywhere in src/pages/rd/app or
 * src/components/rd — every loading state rendered bare "Loading…" text in a
 * container far shorter than the content that replaced it. The activity feed
 * collapsed to roughly one line and then expanded to six rows; the KPI tiles
 * swapped a short string for a 52px number. Both shifted the page under the
 * reader after paint.
 *
 * These reserve the space the real content will occupy, so nothing moves when
 * it arrives. The shapes deliberately mirror their live counterparts rather
 * than being generic grey boxes.
 *
 * The pulse is a CSS animation, so it is already covered by the global
 * prefers-reduced-motion block in index.css.
 */

function Bar({ className }: { className?: string }) {
  return <div className={cn("bg-rd-ink-100 rounded-[4px] animate-pulse", className)} />;
}

/** One KPI tile. Height matches RDStatCard's 52px value plus its label. */
export function SkeletonStatCard() {
  return (
    <div className="bg-white border border-rd-line rounded-rd-lg p-5 shadow-rd-sm">
      <Bar className="h-3 w-24 mb-4" />
      <Bar className="h-[38px] w-20" />
    </div>
  );
}

/** The dashboard KPI row. */
export function SkeletonStatRow({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}

/**
 * Rows inside a card that already has its own header and border — the activity
 * feed, follow-ups, and the pipeline/source lists.
 */
export function SkeletonRows({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("px-6 py-4 flex flex-col gap-3.5", className)} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Bar className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <Bar className="h-3 w-1/3 mb-2" />
            <Bar className="h-2.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Simple stacked lines, for list cards without an avatar column. */
export function SkeletonLines({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("p-5 flex flex-col gap-3", className)} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <Bar className="h-3 flex-1 max-w-[45%]" />
          <Bar className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

export default SkeletonRows;
