import { useId } from "react";

// Reusable FAQ block for marketing pages.
//
// Native <details>/<summary>, not a JS accordion. It is keyboard operable and
// announced correctly with no state to manage, it survives a failed hydration,
// and — the reason that matters here — the answer text is in the DOM whether or
// not the item is open, so a crawler reads all of it. A JS accordion that
// mounts answers on expand hides them from the prerendered HTML, which would
// make FAQPage markup describe text the page does not visibly contain.
//
// Callers that emit FAQPage JSON-LD must build it from the SAME array they pass
// here. The brief and Google both require the visible text to match the markup.

export interface FaqItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FaqItem[];
  /** Renders each question at this level. Defaults to h3. */
  headingLevel?: "h3" | "h4";
  className?: string;
}

export function FAQAccordion({ items, headingLevel = "h3", className }: FAQAccordionProps) {
  const base = useId();
  const H = headingLevel;

  return (
    <div className={className}>
      {items.map((item, i) => (
        <details
          key={item.q}
          className="group border-b border-rd-line last:border-b-0"
          // The first one open gives the section a visible answer at rest, so
          // it does not read as a wall of unanswered questions.
          open={i === 0}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 rounded">
            <H className="text-[17px] font-semibold text-rd-ink-900 leading-[1.45]">{item.q}</H>
            <span
              aria-hidden="true"
              className="mt-1 flex-shrink-0 text-rd-ink-500 transition-transform group-open:rotate-180 motion-reduce:transition-none"
            >
              <svg width="12" height="8" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p
            id={`${base}-${i}`}
            className="pb-5 pr-8 text-[15px] leading-[1.65] text-rd-ink-600 max-w-[68ch]"
          >
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
