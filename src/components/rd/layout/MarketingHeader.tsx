import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RDWordmark } from "../Logo";
import { RDButton } from "../Button";

// Marketing-site nav (MarketingNav in rd-marketing.jsx). Sits on paper
// (light) or dark sections; pass `tone="dark"` for the latter.
//
// Mobile drawer is a Radix Dialog (real modal, portal-rendered). Radix
// owns: focus trap, Escape, backdrop click, scroll lock, aria-modal.
// We layer custom z-indices (overlay z-60, content z-70) so the drawer
// sits above the sticky <header> (z-40) but below the Sonner toast
// stack (z-100). Before this PR the drawer was a `position: absolute`
// dropdown anchored to the nav element — it didn't lock body scroll,
// had no backdrop, and the hero H1 bled through on translucent theme.

type Tone = "paper" | "dark";

interface MarketingHeaderProps {
  tone?: Tone;
  /** Override the nav links. Pass {labelKey, to} to resolve through t(), or
   *  {label, to} for literal strings. If omitted, DEFAULT_LINK_KEYS is used. */
  links?: ({ label: string; to: string } | { labelKey: string; to: string })[];
  className?: string;
  showLanguageToggle?: boolean;
}

// Link targets are static; labels resolve through t() at render time so
// the FR toggle swaps them without a page reload. Keys live in the
// `marketingHeader.nav*` namespace.
const DEFAULT_LINK_KEYS: { labelKey: string; to: string }[] = [
  { labelKey: "marketingHeader.navFeatures", to: "/features" },
  { labelKey: "marketingHeader.navHowItWorks", to: "/how-it-works" },
  { labelKey: "marketingHeader.navPricing", to: "/pricing" },
  { labelKey: "marketingHeader.navCompare", to: "/compare/boldtrail" },
  { labelKey: "marketingHeader.navResources", to: "/resources" },
];

const MD_BREAKPOINT = 768;

export function MarketingHeader({
  tone = "paper",
  links,
  className,
  showLanguageToggle = true,
}: MarketingHeaderProps) {
  const dark = tone === "dark";
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Resolve nav links: either caller-provided (with label or labelKey) or
  // the defaults keyed through t(). Produces a uniform {label, to} shape
  // for the render paths below.
  const resolvedLinks: { label: string; to: string }[] = (
    links ?? DEFAULT_LINK_KEYS
  ).map((l) =>
    "labelKey" in l ? { label: t(l.labelKey), to: l.to } : l,
  );

  const activeLang = (i18n.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
  const setLang = (next: "en" | "fr") => {
    if (next !== activeLang) void i18n.changeLanguage(next);
  };

  // Close on route change. Radix handles Escape + backdrop click + scroll
  // lock itself; react-router navigations need explicit handling because
  // the drawer's siblings (Link components) don't unmount the Dialog.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close when crossing into md+ viewport — drawer is mobile-only and
  // leaving it open past the breakpoint would leave the portal trapping
  // focus while the desktop nav is already visible.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur-md",
        dark
          ? "bg-rd-navy-800/95 border-b border-white/10 text-white"
          : "bg-white/95 border-b border-rd-line text-rd-ink-900",
        className
      )}
    >
      <nav className="relative flex items-center justify-between gap-6 px-6 sm:px-8 md:px-14 py-5">
        <Link
          to="/"
          className="flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 rounded"
          aria-label="Realtor Desk — home"
        >
          <RDWordmark size={20} tone={dark ? "paper" : "navy"} />
        </Link>

        {/* Desktop nav — gap-6 default, widens to gap-8 at lg. FR labels
            run ~130% of EN length (e.g. "Fonctionnalités" vs "Features"),
            so the tighter default gap + whitespace-nowrap on each link
            prevents wrapping on the 768–1023px md range. */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {resolvedLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "text-sm font-medium transition-opacity whitespace-nowrap",
                  active ? "opacity-100" : "opacity-80 hover:opacity-100"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {showLanguageToggle && (
            <div
              className="hidden sm:flex text-xs font-semibold gap-1"
              role="group"
              aria-label={t("marketingHeader.langAriaLabel")}
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
          )}
          <Link to="/login" className="hidden sm:block">
            <RDButton variant={dark ? "light" : "ghost"} size="sm">
              {t("marketingHeader.ctaSignIn")}
            </RDButton>
          </Link>
          <Link to="/signup" className="hidden sm:block">
            <RDButton variant={dark ? "terra" : "primary"} size="sm">
              {t("marketingHeader.ctaStartFreeTrial")}
            </RDButton>
          </Link>

          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={mobileOpen ? t("marketingHeader.closeMenu") : t("marketingHeader.openMenu")}
                className={cn(
                  "md:hidden w-11 h-11 flex items-center justify-center rounded-md border",
                  dark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-rd-line text-rd-ink-900 hover:bg-rd-ink-50"
                )}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <line x1="2.5" y1="4.5" x2="13.5" y2="4.5" />
                  <line x1="2.5" y1="8" x2="13.5" y2="8" />
                  <line x1="2.5" y1="11.5" x2="13.5" y2="11.5" />
                </svg>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay
                className="fixed inset-0 z-[60] bg-rd-ink-900/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none"
              />
              <Dialog.Content
                className={cn(
                  "fixed inset-y-0 right-0 z-[70] flex h-full w-full max-w-sm flex-col shadow-2xl outline-none",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-300 data-[state=closed]:duration-200 motion-reduce:animate-none",
                  dark
                    ? "bg-rd-navy-800 text-white border-l border-white/10"
                    : "bg-white text-rd-ink-900 border-l border-rd-line"
                )}
              >
                <Dialog.Title className="sr-only">{t("marketingHeader.drawerTitle")}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  {t("marketingHeader.drawerNavLabel")}
                </Dialog.Description>

                <div className={cn(
                  "flex items-center justify-between px-6 py-5 border-b",
                  dark ? "border-white/10" : "border-rd-line"
                )}>
                  <Link
                    to="/"
                    className="outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 rounded"
                    aria-label="Realtor Desk — home"
                  >
                    <RDWordmark size={20} tone={dark ? "paper" : "navy"} />
                  </Link>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label={t("marketingHeader.closeMenu")}
                      className={cn(
                        "w-11 h-11 flex items-center justify-center rounded-md border",
                        dark
                          ? "border-white/20 text-white hover:bg-white/10"
                          : "border-rd-line text-rd-ink-900 hover:bg-rd-ink-50"
                      )}
                    >
                      <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="flex flex-col">
                    {resolvedLinks.map((l) => {
                      const active = location.pathname === l.to;
                      return (
                        <li key={l.to}>
                          <Link
                            to={l.to}
                            className={cn(
                              "flex items-center min-h-[44px] py-3 text-base font-medium border-b",
                              dark ? "border-white/10" : "border-rd-line",
                              active ? "opacity-100" : "opacity-80 hover:opacity-100"
                            )}
                          >
                            {l.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {showLanguageToggle && (
                    <div
                      className={cn(
                        "flex items-center gap-3 pt-5 mt-5 border-t",
                        dark ? "border-white/10" : "border-rd-line"
                      )}
                      role="group"
                      aria-label={t("marketingHeader.langAriaLabel")}
                    >
                      <button
                        type="button"
                        onClick={() => setLang("en")}
                        aria-pressed={activeLang === "en"}
                        className={cn(
                          "min-h-[44px] min-w-[44px] px-3 text-sm font-semibold rounded-md border",
                          activeLang === "en"
                            ? dark
                              ? "border-white text-white"
                              : "border-rd-ink-900 text-rd-ink-900"
                            : dark
                              ? "border-white/20 text-white/60"
                              : "border-rd-line text-rd-ink-500"
                        )}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        onClick={() => setLang("fr")}
                        aria-pressed={activeLang === "fr"}
                        className={cn(
                          "min-h-[44px] min-w-[44px] px-3 text-sm font-semibold rounded-md border",
                          activeLang === "fr"
                            ? dark
                              ? "border-white text-white"
                              : "border-rd-ink-900 text-rd-ink-900"
                            : dark
                              ? "border-white/20 text-white/60"
                              : "border-rd-line text-rd-ink-500"
                        )}
                      >
                        FR
                      </button>
                    </div>
                  )}
                </nav>

                <div className={cn(
                  "flex flex-col gap-3 px-6 py-5 border-t",
                  dark ? "border-white/10" : "border-rd-line"
                )}>
                  <Link to="/login" className="w-full">
                    <RDButton variant={dark ? "light" : "ghost"} size="lg" className="w-full min-h-[44px]">
                      {t("marketingHeader.ctaSignIn")}
                    </RDButton>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <RDButton variant={dark ? "terra" : "primary"} size="lg" className="w-full min-h-[44px]">
                      {t("marketingHeader.ctaStartFreeTrial")}
                    </RDButton>
                  </Link>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}
