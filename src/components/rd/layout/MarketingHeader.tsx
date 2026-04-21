import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RDWordmark } from "../Logo";
import { RDButton } from "../Button";

// Marketing-site nav (MarketingNav in rd-marketing.jsx). Sits on paper
// (light) or dark sections; pass `tone="dark"` for the latter.
// Language toggle is visual-only today — the parent <LanguageSwitcher />
// in the legacy site still owns the i18n state machine.

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

  return (
    <nav
      className={cn(
        "flex items-center justify-between px-8 md:px-14 py-5 backdrop-blur-md",
        dark
          ? "bg-rd-navy-800/60 border-b border-white/10 text-white"
          : "bg-white/70 border-b border-rd-line text-rd-ink-900",
        className
      )}
    >
      <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 rounded">
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

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "hidden sm:flex text-xs font-semibold gap-1",
            dark ? "text-white/70" : "text-rd-ink-600"
          )}
          aria-label="Language"
        >
          <span className={dark ? "text-white" : "text-rd-ink-900"}>EN</span>
          <span className="opacity-50">/</span>
          <span>FR</span>
        </div>
        <Link to="/login">
          <RDButton variant={dark ? "light" : "ghost"} size="sm">
            Sign in
          </RDButton>
        </Link>
        <Link to="/signup">
          <RDButton variant={dark ? "terra" : "primary"} size="sm">
            Start free trial
          </RDButton>
        </Link>
      </div>
    </nav>
  );
}
