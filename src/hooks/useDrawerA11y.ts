import { useEffect, useRef } from "react";
import { useMediaQuery } from "./useMediaQuery";

/**
 * Keyboard and screen-reader behaviour for an off-canvas navigation drawer.
 *
 * Both sidebars in this app are the same shape: a static column at lg and up,
 * a modal overlay below it, moved off-screen with `-translate-x-full`. Both had
 * the same three faults, so the fix lives here rather than twice.
 *
 *  1. TRANSLATED IS NOT HIDDEN. `-translate-x-full` moves the drawer out of
 *     sight but leaves it in the tab order. A keyboard user tabbing the page
 *     walked through nav links they could not see, with focus apparently
 *     vanishing. `inert` fixes both the tab order and the a11y tree.
 *  2. NO ESCAPE. A modal you cannot dismiss from the keyboard traps the user.
 *  3. NO FOCUS MOVE OR RETURN. Opening left focus behind the overlay, so the
 *     next Tab walked the page underneath; closing dropped focus to <body>,
 *     losing the user's place entirely.
 *
 * Returns a ref to put on the drawer element, plus the ARIA that must change
 * with the breakpoint -- a static navigation column must NOT claim to be a
 * dialog, and ARIA cannot read media queries, so this has to come from JS.
 */
export function useDrawerA11y({
  open,
  onClose,
  /** Width at or above which the drawer becomes a static column. */
  staticFrom = "(min-width: 1024px)",
  label = "Navigation",
}: {
  open: boolean;
  onClose: () => void;
  staticFrom?: string;
  label?: string;
}) {
  const isStatic = useMediaQuery(staticFrom);
  const ref = useRef<HTMLElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  // Escape closes it. Bound only while open and only while it is an overlay,
  // so Escape keeps its normal meaning everywhere else.
  useEffect(() => {
    if (isStatic || !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isStatic, onClose]);

  // Focus in on open, back to the trigger on close.
  useEffect(() => {
    if (isStatic) return;
    if (open) {
      restoreTo.current = document.activeElement as HTMLElement | null;
      ref.current?.querySelector<HTMLElement>("button, a, [tabindex]")?.focus();
    } else if (restoreTo.current) {
      restoreTo.current.focus();
      restoreTo.current = null;
    }
  }, [open, isStatic]);

  return {
    ref,
    isStatic,
    /** Spread onto the drawer element. */
    drawerProps: {
      role: isStatic ? undefined : ("dialog" as const),
      "aria-modal": isStatic ? undefined : true,
      "aria-label": isStatic ? undefined : label,
      inert: !isStatic && !open ? true : undefined,
    },
  };
}

export default useDrawerA11y;
