import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered reveal, built on one IntersectionObserver per element and
 * no motion library.
 *
 * The usual failure mode of scroll-reveal is that elements start at opacity 0
 * and are animated to visible by JavaScript -- so if the script fails, is
 * blocked, or the observer never fires (an element already past the viewport
 * on load, a browser that restores scroll position before hydration), the
 * content is permanently invisible. That trades a decoration for the entire
 * page.
 *
 * So the contract here is inverted: `revealed` starts FALSE only when we have
 * confirmed both that the browser supports IntersectionObserver and that the
 * user has not asked for reduced motion. In every other case it starts TRUE
 * and the element simply renders, un-animated. The animation is the
 * enhancement; the content is not.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const ref = useRef<T | null>(null);

  const [revealed, setRevealed] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    if (!("IntersectionObserver" in window)) return true;
    // matchMedia is absent in some test environments; absence means no
    // preference expressed, so animate.
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) return true;
    return false;
  });

  useEffect(() => {
    if (revealed) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
          }
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        // Start slightly before the element reaches the viewport so the
        // motion has finished by the time it is properly in view, rather
        // than animating under the reader's eye.
        rootMargin: options.rootMargin ?? "0px 0px -8% 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [revealed, options.threshold, options.rootMargin]);

  return { ref, revealed };
}
