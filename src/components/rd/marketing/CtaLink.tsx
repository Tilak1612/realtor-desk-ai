import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { rdButtonClasses, type RDButtonVariant, type RDButtonSize } from "@/components/rd/Button";
import { trackEvent } from "@/utils/analytics";

/**
 * A marketing call-to-action that is one element and reports itself.
 *
 * Two problems it fixes:
 *
 * 1. Attribution. Primary CTAs emitted no event at all — only a pageview — so
 *    it was impossible to tell which page or section produced a trial, and
 *    paid traffic could not be optimised or even attributed. `sign_up` fires
 *    at the end of the funnel; nothing recorded the click that started it.
 *
 * 2. Markup. The previous pattern was `<Link><RDButton/></Link>`, which
 *    renders interactive content nested inside an anchor: invalid HTML, two
 *    tab stops for one control, and an unpredictable screen-reader
 *    announcement. This renders a single anchor styled with the same class
 *    recipe, so it looks identical.
 *
 * `location` should say where on the page this instance sits ("hero",
 * "pricing_solo", "footer") — that is the whole point of the event.
 */
export function CtaLink({
  to,
  location,
  label,
  variant = "primary",
  size = "lg",
  full,
  className,
  trailingIcon,
  children,
}: {
  to: string;
  location: string;
  /** Stable analytics label. Defaults to the destination, not the visible
   *  text, so a copy change or a language switch does not fork the metric. */
  label?: string;
  variant?: RDButtonVariant;
  size?: RDButtonSize;
  full?: boolean;
  className?: string;
  trailingIcon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={rdButtonClasses(variant, size, full, className)}
      onClick={() =>
        trackEvent("cta_click", {
          cta_location: location,
          cta_label: label ?? to,
          destination: to,
        })
      }
    >
      {children}
      {trailingIcon}
    </Link>
  );
}
