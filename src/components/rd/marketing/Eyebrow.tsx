import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// "Eyebrow" section label — short caps rule + copy, used above every h2.
// Tone mirrors the parent surface: light (paper sections) or dark (navy
// or ink-900 sections).

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]",
        tone === "dark" ? "text-rd-terra-400" : "text-rd-terra-700",
        className
      )}
    >
      <span className="block w-5 h-px bg-current opacity-50" />
      {children}
    </div>
  );
}
