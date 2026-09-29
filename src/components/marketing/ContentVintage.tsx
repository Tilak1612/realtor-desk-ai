// A visible "when was this written" line for dated editorial pages.
//
// WHY THIS EXISTS. Four pages carry a year in their title — "Canada Housing
// Market Forecast 2025-2026", "Edmonton Real Estate Market 2025", "Toronto vs
// Vancouver Real Estate 2025", "First-Time Home Buyer Guide for Canada 2025" —
// and none of them told a reader when they were written. They were authored in
// January 2026 (git), so by late 2026 a visitor was reading market commentary
// of unknown vintage presented as current.
//
// The fix is to date it, not to relabel it. Quietly bumping "2025" to "2026"
// in a title would make stale analysis look fresh, which is worse than looking
// old. Someone can then decide to refresh the content on evidence rather than
// on a title that no longer matches the calendar.
//
// `published` is an ISO date. Keep it truthful: it is the date the analysis was
// written, not the date the file was last touched by a formatting pass.

interface ContentVintageProps {
  /** ISO date the analysis was written, e.g. "2026-01-02". */
  published: string;
  /** Optional note about what would change if it were refreshed. */
  note?: string;
  className?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function ContentVintage({ published, note, className }: ContentVintageProps) {
  // Parsed by hand rather than through Date, which shifts an ISO date across
  // the day boundary for anyone west of UTC and would print the wrong month.
  const [y, m] = published.split("-").map(Number);
  const label = Number.isFinite(y) && Number.isFinite(m) ? `${MONTHS[m - 1]} ${y}` : published;

  return (
    <aside
      className={`rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground ${className ?? ""}`}
    >
      <p>
        <strong className="font-semibold text-foreground">Written {label}.</strong>
      </p>
      {/* The standing sentence is kept free of interpolation on purpose. The
          prerenderer lifts static JSX prose but skips an element containing an
          expression, so folding this into the line above hid the whole
          disclosure from every crawler that does not run JavaScript — which is
          exactly the reader most likely to mistake old analysis for current. */}
      <p className="mt-1">
        Market conditions move, and this page has not been revised since. Treat
        the figures and outlook as a snapshot of that date rather than
        today&rsquo;s market, and check a current source before advising a
        client.
      </p>
      {note ? <p className="mt-1">{note}</p> : null}
    </aside>
  );
}
