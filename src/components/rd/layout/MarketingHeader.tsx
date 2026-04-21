import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { RDWordmark } from "../Logo";
import { RDButton } from "../Button";

// Marketing-site nav (MarketingNav in rd-marketing.jsx). Sits on paper
// (light) or dark sections; pass `tone="dark"` for the latter.
//
// The EN/FR toggle now calls i18n.changeLanguage so the (still-mostly
// English) marketing copy that *is* wrapped in t() will flip, instead
// of the toggle being a dead control. Landing translation coverage is
// a separate follow-up — this just stops the CTA from lying to users.

type Tone = "paper" | "dark";

interface MarketingHeaderProps {
  tone?: Tone;
  /** Override the default link list. */
  links?: { label: string; to: string }[];
  className?: string;
}

const DEFAULT_LINKS = [
  { label: "Features", to: "/features" },
  { label: "How it works", to: "/how-it-works" },
  { label: "Pricing", to: "/pricing" },
  { label: "Compare", to: "/compare/boldtrail" },
  { label: "Resources", to: "/resources" },
];

export function MarketingHeader({
  tone = "paper",
  links = DEFAULT_LINKS,
  className,
}: MarketingHeaderProps) {
  const dark = tone === "dark";
  const location = useLocation();
  const { i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLang = (i18n.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
  const setLang = (next: "en" | "fr") => {
    if (next !== activeLang) void i18n.changeLanguage(next);
  };

  return (
    <nav
      className={cn(
        "relative flex items-center justify-between gap-6 px-6 sm:px-8 md:px-14 py-5 backdrop-blur-md",
        dark
          ? "bg-rd-navy-800/60 border-b border-white/10 text-white"
          : "bg-white/70 border-b border-rd-line text-rd-ink-900",
        className
      )}
    >
      <Link
        to="/"
        className="flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 rounded"
      >
        <RDWordmark size={20} tone={dark ? "paper" : "navy"} />
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => {
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-sm font-medium transition-opacity",
                active ? "opacity-100" : "opacity-80 hover:opacity-100"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div
          className="hidden sm:flex text-xs font-semibold gap-1"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            onClick={() => setLang("en")}
            aria-pressed={activeLang === "en"}
            className={cn(
              "cursor-pointer transition-opacity",
              activeLang === "en"
                ? dark
                  ? "text-white"
                  : "text-rd-ink-900"
                : "opacity-50 hover:opacity-90"
            )}
          >
            EN
          </button>
          <span className="opacity-50">/</span>
          <button
            type="button"
            onClick={() => setLang("fr")}
            aria-pressed={activeLang === "fr"}
            className={cn(
              "cursor-pointer transition-opacity",
              activeLang === "fr"
                ? dark
                  ? "text-white"
                  : "text-rd-ink-900"
                : "opacity-50 hover:opacity-90"
            )}
          >
            FR
          </button>
        </div>
        <Link to="/login" className="hidden sm:block">
          <RDButton variant={dark ? "light" : "ghost"} size="sm">
            Sign in
          </RDButton>
        </Link>
        <Link to="/signup" className="hidden sm:block">
          <RDButton variant={dark ? "terra" : "primary"} size="sm">
            Start free trial
          </RDButton>
        </Link>

        {/* Mobile hamburger — sm:hidden so it only shows under 640px. */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className={cn(
            "md:hidden w-9 h-9 flex items-center justify-center rounded-md border",
            dark
              ? "border-white/20 text-white hover:bg-white/10"
              : "border-rd-line text-rd-ink-900 hover:bg-rd-ink-50"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </>
            ) : (
              <>
                <line x1="2.5" y1="4.5" x2="13.5" y2="4.5" />
                <line x1="2.5" y1="8" x2="13.5" y2="8" />
                <line x1="2.5" y1="11.5" x2="13.5" y2="11.5" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer — absolute-positioned so it doesn't reflow the bar. */}
      {mobileOpen && (
        <div
          className={cn(
            "md:hidden absolute top-full inset-x-0 flex flex-col gap-1 px-6 py-4 border-b z-40",
            dark
              ? "bg-rd-navy-800 border-white/10 text-white"
              : "bg-white border-rd-line text-rd-ink-900"
          )}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium py-2"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-3 border-t border-current/10 mt-2">
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={activeLang === "en"}
              className={cn(
                "text-xs font-semibold",
                activeLang === "en" ? "opacity-100" : "opacity-50"
              )}
            >
              EN
            </button>
            <span className="opacity-30 text-xs">/</span>
            <button
              type="button"
              onClick={() => setLang("fr")}
              aria-pressed={activeLang === "fr"}
              className={cn(
                "text-xs font-semibold",
                activeLang === "fr" ? "opacity-100" : "opacity-50"
              )}
            >
              FR
            </button>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="ml-auto">
              <RDButton variant={dark ? "light" : "ghost"} size="sm">
                Sign in
              </RDButton>
            </Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)}>
              <RDButton variant={dark ? "terra" : "primary"} size="sm">
                Start free trial
              </RDButton>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
