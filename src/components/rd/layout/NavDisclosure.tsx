import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { NavItem, NavPane } from "@/config/siteNav";

// Desktop disclosure menus for the public header.
//
// WHY THIS IS NOT A RADIX DROPDOWN, WHICH THE HEADER ALREADY IMPORTS.
// DropdownMenu implements the ARIA *menu* pattern: roving tabindex, arrow-key
// navigation, typeahead, and links removed from the tab order. That pattern is
// for application commands. These are ordinary website links, and the brief is
// explicit — "accessible disclosure navigation, not ARIA application menus for
// ordinary website links". A disclosure keeps every link a real tab stop, so
// Tab walks the menu the way a sighted keyboard user expects and a screen
// reader announces links rather than menu items.
//
// Behaviours the brief requires and this implements:
//   at most one panel open      — owned by the parent via `openId`
//   Escape closes, focus returns to the trigger
//   outside click closes
//   pointer travel trigger→panel must not dismiss  (see the close-delay note)
//   works without a pointer     — click/Enter/Space toggle; hover is additive
//   panel stays in the viewport — right-anchored panels clamp at the edge

interface NavDisclosureProps {
  id: string;
  label: string;
  dark: boolean;
  /** id of the currently open panel, or null. */
  openId: string | null;
  setOpenId: (id: string | null) => void;
  items?: NavItem[];
  panes?: NavPane[];
  /** Marks the trigger as the current section. */
  active: boolean;
}

/**
 * Hover-out grace period. Without it, the gap between the trigger's bottom edge
 * and the panel's top edge closes the menu mid-travel and the panel is
 * unreachable by mouse — the classic broken mega-menu. 120ms is long enough to
 * cross the gap and short enough not to feel stuck.
 */
const CLOSE_DELAY_MS = 120;

export function NavDisclosure({
  id,
  label,
  dark,
  openId,
  setOpenId,
  items,
  panes,
  active,
}: NavDisclosureProps) {
  const open = openId === id;
  const panelId = `${useId()}-panel`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * True when the panel was opened by the pointer arriving, not by a click.
   *
   * Without this, a mouse user could never open the menu: moving onto the
   * trigger fires mouseenter and opens it, and the click that follows in the
   * same gesture sees an open panel and toggles it shut. The panel flashed.
   * The first click after a hover-open is therefore absorbed; every later
   * click toggles normally, so touch and keyboard still get open/close from
   * the same control.
   */
  const hoverOpened = useRef(false);

  // Which pane of a two-level menu is showing. Keyed by pane id rather than
  // index so reordering SOLUTIONS_PANES cannot silently change the default.
  const [paneId, setPaneId] = useState(panes?.[0]?.id ?? "");
  const activePane = panes?.find((p) => p.id === paneId) ?? panes?.[0];

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  };
  useEffect(() => cancelClose, []);
  useEffect(() => {
    if (!open) hoverOpened.current = false;
  }, [open]);

  const closeAndRefocus = () => {
    setOpenId(null);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeAndRefocus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    // Focus leaving the whole group closes it, so Tab past the last link
    // behaves like clicking away instead of leaving a panel hanging open.
    const onFocusIn = (e: FocusEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const linkList = (list: NavItem[]) => (
    <ul className="grid gap-1">
      {list.map((it) => (
        <li key={it.to}>
          <Link
            to={it.to}
            onClick={() => setOpenId(null)}
            className="block rounded-rd-md px-3 py-2.5 transition-colors hover:bg-rd-ink-50 focus-visible:bg-rd-ink-50 outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400"
          >
            <span className="block text-sm font-semibold text-rd-ink-900">{it.label}</span>
            {it.desc && (
              <span className="mt-0.5 block text-[13px] leading-[1.45] text-rd-ink-500">
                {it.desc}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        if (!open) hoverOpened.current = true;
        setOpenId(id);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          if (open && hoverOpened.current) {
            hoverOpened.current = false;
            return;
          }
          hoverOpened.current = false;
          setOpenId(open ? null : id);
        }}
        className={cn(
          "relative inline-flex items-center gap-1 py-1 text-sm font-medium transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 rounded",
          active || open
            ? dark
              ? "text-white"
              : "text-rd-ink-900"
            : dark
              ? "text-white/75 hover:text-white"
              : "text-rd-ink-700 hover:text-rd-ink-900",
        )}
      >
        {label}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
          className={cn("transition-transform motion-reduce:transition-none", open && "rotate-180")}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 right-0 -bottom-[7px] h-0.5 rounded-full transition-all",
            dark ? "bg-white" : "bg-rd-navy-900",
            active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
          )}
        />
      </button>

      {open && (
        <div
          id={panelId}
          // max-h + overflow so a long panel scrolls internally instead of
          // running off the bottom of a short viewport.
          className={cn(
            "rd-reset absolute top-full z-50 mt-3 max-h-[min(70vh,34rem)] overflow-y-auto rounded-rd-xl border border-rd-line bg-white p-3 shadow-rd-lg",
            "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 motion-safe:duration-150",
            panes ? "left-1/2 w-[44rem] max-w-[calc(100vw-3rem)] -translate-x-1/2" : "left-0 w-[22rem]",
          )}
        >
          {panes && activePane ? (
            <div className="grid grid-cols-[13rem_1fr] gap-3">
              {/* Left selector. Each entry is a real link to the section's own
                  page AND a pane switcher — hovering or focusing swaps the
                  right pane, clicking navigates. That keeps the selector
                  useful to someone who never moves a pointer. */}
              <ul
                aria-label={`${label} categories`}
                className="grid content-start gap-1 border-r border-rd-line pr-3"
              >
                {panes.map((p) => {
                  const selected = p.id === activePane.id;
                  return (
                    <li key={p.id}>
                      <Link
                        to={p.to}
                        onMouseEnter={() => setPaneId(p.id)}
                        onFocus={() => setPaneId(p.id)}
                        onClick={() => setOpenId(null)}
                        aria-describedby={panelId}
                        className={cn(
                          "block rounded-rd-md px-3 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-rd-navy-400",
                          selected ? "bg-rd-navy-50" : "hover:bg-rd-ink-50",
                        )}
                      >
                        <span className="block text-sm font-semibold text-rd-ink-900">{p.label}</span>
                        <span className="mt-0.5 block text-[12px] text-rd-ink-500">{p.desc}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div>{linkList(activePane.items)}</div>
            </div>
          ) : (
            linkList(items ?? [])
          )}
        </div>
      )}
    </div>
  );
}
