import type { ReactNode } from "react";
import { MarketingHeader } from "../layout/MarketingHeader";
import { MarketingFooter } from "./MarketingFooter";

// Wraps every redesigned marketing page with the scoped rd-reset class
// (so the paper background + Inter type apply), the marketing nav, and
// the shared footer. Pages pass their section stack as children.

interface MarketingLayoutProps {
  children: ReactNode;
  /** Render the header with the dark tone for navy hero sections. */
  headerTone?: "paper" | "dark";
}

export function MarketingLayout({ children, headerTone = "paper" }: MarketingLayoutProps) {
  return (
    <div className="rd-reset min-h-screen bg-rd-paper text-rd-ink-900">
      <MarketingHeader tone={headerTone} />
      {children}
      <MarketingFooter />
    </div>
  );
}
