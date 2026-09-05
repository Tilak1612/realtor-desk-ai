import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/motion/useReveal";

/**
 * Wraps a section so it rises and fades once as it enters the viewport.
 *
 * The hidden class is applied only while `revealed` is false, and useReveal
 * guarantees that is never the case when the browser cannot reveal or the
 * user has asked for reduced motion. Content is visible by default and
 * animated as an enhancement, not the other way round.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger = false,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Offsets direct children in sequence. Use on grids and lists, not prose. */
  stagger?: boolean;
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={cn(
        "rd-reveal",
        revealed ? "rd-reveal-shown" : "rd-reveal-hidden",
        stagger && "rd-stagger",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
