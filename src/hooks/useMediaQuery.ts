import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query from JS.
 *
 * Exists because ARIA is not media-query aware. The app rail is one element in
 * two modes -- a static column at lg and up, a modal overlay drawer below it --
 * and CSS alone can switch the appearance but not `role`, `aria-modal`, or
 * whether the thing should be in the tab order. That needs the breakpoint in
 * JS, which is what this returns.
 *
 * Separate from the existing use-mobile.tsx, which is shadcn's and pinned to
 * 768px; the rail switches at 1024. Left that one alone rather than widening
 * its contract underneath its other callers.
 *
 * Returns false until mounted, so SSR and the first paint agree. Callers must
 * treat false as "not yet known" where that matters -- the Sidebar does, by
 * only applying modal semantics once it knows it is below the breakpoint.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // matchMedia is absent in some test environments. Absence means the query
    // cannot be evaluated, not that it is false -- but false is the safe
    // default here: it leaves the rail as a plain <aside> with no modal
    // semantics, which is the more forgiving of the two states.
    const mq = window.matchMedia?.(query);
    if (!mq) return;

    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
