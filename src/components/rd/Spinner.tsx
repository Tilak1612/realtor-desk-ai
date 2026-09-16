import { cn } from "@/lib/utils";

/**
 * A loading indicator that still says something when it cannot spin.
 *
 * THE BUG THIS EXISTS TO FIX. There were 33 hand-rolled spinners across 23
 * files, and the pattern was always the same:
 *
 *     <div className="animate-spin rounded-full h-8 w-8 border-b-2" />
 *
 * A bare div. No text, no role, nothing in the accessibility tree. A screen
 * reader announces silence while the page waits.
 *
 * It is worse than it looks, because index.css sets
 *
 *     animation-duration: 0.01ms !important;
 *     animation-iteration-count: 1 !important;
 *
 * for `prefers-reduced-motion`, globally and deliberately. That is right for
 * decorative motion, but it also stops the spinner. So a reduced-motion user
 * got a frozen quarter-circle with no text: not a slow loading state, no
 * loading state at all.
 *
 * Hence two independent affordances, neither depending on the other:
 *
 *   1. role="status" with real text, so it is announced and readable. The
 *      text is visually hidden by default because the ring already carries
 *      the meaning for sighted users -- pass `showLabel` where the wait is
 *      long enough to deserve words on screen.
 *   2. The ring keeps a visible border when motion is reduced, so it reads as
 *      a deliberate indicator rather than a rendering artefact.
 *
 * aria-live is intentionally NOT set here. role="status" already implies
 * aria-live="polite", and doubling it makes some screen readers announce
 * twice.
 */
export function Spinner({
  /** Announced and, with showLabel, displayed. Say what is loading. */
  label,
  size = "md",
  showLabel = false,
  className,
}: {
  label: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const ring = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  }[size];

  return (
    <div
      role="status"
      className={cn("flex items-center gap-3", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "rd-spinner inline-block flex-none rounded-full border-rd-line",
          // border-t is what makes the ring look like it has a leading edge.
          // The other three sides stay visible so the shape survives a
          // stopped animation.
          "border-t-rd-navy-700 animate-spin",
          ring
        )}
      />
      <span className={showLabel ? "text-sm text-rd-ink-600" : "sr-only"}>
        {label}
      </span>
    </div>
  );
}

export default Spinner;
