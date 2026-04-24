import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Globe, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RDWordmark } from "../Logo";
import { RDButton } from "../Button";

// The single public-site header. Sits on paper (light) or dark sections;
// pass `tone="dark"` for the latter. This component is rendered directly
// via MarketingLayout on the redesigned pages (/, /features, /pricing,
// /compare/*) AND delegated to by the legacy `Navbar` shim so the older
// pages (/how-it-works, /resources, blog/*, switch-from-*, 404, etc.)
// pick up the unified chrome without touching 60+ page files. The
// outer .rd-reset wrapper means Inter font + box-sizing apply even when
// this renders outside a MarketingLayout.
//
// Mobile drawer is a Radix Dialog (real modal, portal-rendered). Radix
// owns: focus trap, Escape, backdrop click, scroll lock, aria-modal.
// Overlay z-60, content z-70 — above the sticky <header> (z-40), below
// the Sonner toast stack (z-100).

type Tone = "paper" | "dark";

interface MarketingHeaderProps {
  tone?: Tone;
  /** Override the nav links. Pass {labelKey, to} to resolve through t(), or
   *  {label, to} for literal strings. If omitted, DEFAULT_LINK_KEYS is used. */
  links?: ({ label: string; to: string } | { labelKey: string; to: string })[];
  className?: string;
  showLanguageToggle?: boolean;
}

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

  const resolvedLinks: { label: string; to: string }[] = (
    links ?? DEFAULT_LINK_KEYS
  ).map((l) =>
    "labelKey" in l ? { label: t(l.labelKey), to: l.to } : l,
  );

  const activeLang = (i18n.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
  const setLang = (next: "en" | "fr") => {
    if (next !== activeLang) void i18n.changeLanguage(next);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
    <div className="rd-reset">
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

          {/* Desktop nav — active item gets an underlined treatment via a
              bottom border inside a fixed-height link so the baseline
              doesn't shift between active and inactive states. */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {resolvedLinks.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex items-center text-sm font-medium transition-colors whitespace-nowrap py-1",
                    active
                      ? dark
                        ? "text-white"
                        : "text-rd-ink-900"
                      : dark
                        ? "text-white/75 hover:text-white"
                        : "text-rd-ink-700 hover:text-rd-ink-900"
                  )}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-all",
                      dark ? "bg-white" : "bg-rd-navy-900",
                      active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {showLanguageToggle && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    aria-label={t("marketingHeader.langAriaLabel")}
                    className={cn(
                      "hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400",
                      dark
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-rd-ink-700 hover:text-rd-ink-900 hover:bg-rd-ink-50"
                    )}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" />
                    {activeLang === "fr" ? "FR" : "EN"}
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    className="rd-reset z-[60] min-w-[9rem] rounded-md border border-rd-line bg-white p-1 shadow-lg text-rd-ink-900 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
                  >
                    <DropdownMenu.Item
                      onSelect={() => setLang("en")}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-rd-ink-50 data-[highlighted]:bg-rd-ink-50",
                        activeLang === "en" && "font-semibold"
                      )}
                    >
                      English
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => setLang("fr")}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-rd-ink-50 data-[highlighted]:bg-rd-ink-50",
                        activeLang === "fr" && "font-semibold"
                      )}
                    >
                      Français
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
            <Link to="/login" className="hidden sm:block">
              <RDButton variant={dark ? "light" : "outline"} size="sm">
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
                    "rd-reset fixed inset-y-0 right-0 z-[70] flex h-full w-full max-w-sm flex-col shadow-2xl outline-none",
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
                              aria-current={active ? "page" : undefined}
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
                      <RDButton variant={dark ? "light" : "outline"} size="lg" className="w-full min-h-[44px]">
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
    </div>
  );
}
