import { useEffect, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { ExternalLink, CalendarDays, AlertCircle } from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import { rdButtonClasses } from "@/components/rd/Button";
import { CAL_EVENT_URL, CAL_NAMESPACE, CAL_LINK } from "@/config/booking";

/**
 * The Cal.com booking calendar, with somewhere to go when it does not load.
 *
 * A third-party embed has more ways to fail than a component usually does: an
 * ad blocker eats the script, a corporate network blocks the origin, the CSP
 * is wrong, the visitor is offline, or cal.com is simply down. Any of those on
 * a booking page means the visitor cannot book and there is nothing on screen
 * telling them what to do -- the worst outcome for the page whose entire job
 * is conversion.
 *
 * So the fallback link is not an error state bolted on afterwards. It renders
 * from the very first paint, underneath the calendar, and simply stays there:
 * if the embed works the visitor never needs it, and if the embed never
 * appears the visitor still has a working way to book. Nothing has to detect
 * failure for the page to remain usable, which matters because the failures
 * above are not all detectable from inside this document.
 *
 * The timeout is a second line rather than the mechanism. It only changes the
 * WORDING -- promoting the link from a quiet alternative to the primary
 * instruction -- so a mis-tuned timeout can never remove the way out.
 */

const LOAD_TIMEOUT_MS = 8000;

type State = "loading" | "ready" | "slow";

export function CalEmbed({ location = "demo_page" }: { location?: string }) {
  const [state, setState] = useState<State>("loading");
  // Tracking is fire-once. The Cal embed re-renders on resize and route
  // changes, and an event per render would make the funnel meaningless.
  const reported = useRef({ loaded: false, booked: false, slow: false });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cal = await getCalApi({ namespace: CAL_NAMESPACE });
        if (cancelled) return;

        cal("ui", {
          // Cal's own theme, tuned to the RD palette. Passing hex here rather
          // than CSS vars on purpose: this config crosses into the embed's
          // iframe, where our stylesheet -- and so var(--rd-*) -- does not
          // exist and would resolve to nothing.
          cssVarsPerTheme: {
            light: { "cal-brand": "#0B2540" },
            dark: { "cal-brand": "#D7714E" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });

        cal("on", {
          action: "linkReady",
          callback: () => {
            if (cancelled) return;
            setState("ready");
            if (!reported.current.loaded) {
              reported.current.loaded = true;
              trackEvent("demo_calendar_loaded", { cta_location: location });
            }
          },
        });

        cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            // The conversion this page exists for. Fires inside the embed, so
            // it is the only signal that a booking actually completed -- a
            // click on "Book a demo" says nothing about whether one happened.
            if (reported.current.booked) return;
            reported.current.booked = true;
            trackEvent("demo_booking_completed", { cta_location: location });
          },
        });
      } catch {
        // getCalApi throws when the embed script cannot load at all. Say so
        // in the copy; the link below was already on screen regardless.
        if (!cancelled) setState("slow");
      }
    })();

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      setState((s) => {
        if (s === "ready") return s;
        if (!reported.current.slow) {
          reported.current.slow = true;
          trackEvent("demo_calendar_unavailable", { cta_location: location });
        }
        return "slow";
      });
    }, LOAD_TIMEOUT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [location]);

  return (
    <div className="w-full">
      <div className="relative rounded-rd-lg border border-rd-line bg-white overflow-hidden">
        {state === "loading" && <CalSkeleton />}

        {/* Mounted from the start, not gated behind `ready`. Waiting for the
            ready event before mounting would mean the embed never initialises,
            since the event only fires once it has. The skeleton sits on top
            until it does. */}
        <div
          className={state === "ready" ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}
          aria-hidden={state !== "ready"}
        >
          <Cal
            namespace={CAL_NAMESPACE}
            calLink={CAL_LINK}
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view" }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <a
          href={CAL_EVENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("cta_click", {
              cta_location: `${location}_fallback`,
              cta_label: "cal_direct",
              destination: CAL_EVENT_URL,
            })
          }
          className={rdButtonClasses(
            state === "slow" ? "primary" : "outline",
            "md",
            false,
            "inline-flex items-center gap-2"
          )}
        >
          {state === "slow" ? (
            <AlertCircle aria-hidden="true" className="w-4 h-4" />
          ) : (
            <CalendarDays aria-hidden="true" className="w-4 h-4" />
          )}
          Open the booking page
          <ExternalLink aria-hidden="true" className="w-3.5 h-3.5" />
        </a>

        <p
          className="text-sm text-rd-ink-600"
          // Announced only when it becomes the instruction rather than an
          // aside, so a screen reader is not interrupted while the calendar
          // is still loading normally.
          role={state === "slow" ? "status" : undefined}
        >
          {state === "slow"
            ? "The calendar is not loading — an ad blocker or network policy may be blocking it. The link opens the same times in a new tab."
            : "Prefer a new tab, or blocking scripts? This opens the same calendar."}
        </p>
      </div>
    </div>
  );
}

/**
 * Occupies the calendar's space while it loads.
 *
 * Sized to the embed's own month view so the page does not jump when the real
 * thing arrives -- the reason it is a shaped skeleton rather than a spinner.
 */
function CalSkeleton() {
  return (
    <div className="p-5 sm:p-6" aria-hidden="true">
      <div className="animate-pulse space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-rd-ink-100" />
          <div className="h-8 w-28 rounded-rd-md bg-rd-ink-100" />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-rd-ink-100" />
          ))}
        </div>
        <div className="h-4 w-2/3 rounded bg-rd-ink-100" />
      </div>
      <span className="sr-only">Loading the booking calendar</span>
    </div>
  );
}

export default CalEmbed;
