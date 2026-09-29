import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CtaLink } from "@/components/rd/marketing/CtaLink";
import { CAL_ROUTE } from "@/config/booking";
import { useTranslation } from "react-i18next";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Globe, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "@/config/siteNav";
import { NavDisclosure } from "./NavDisclosure";
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
  // No `links` override prop. The nav comes from src/config/siteNav.ts and
  // nowhere else — an override would reintroduce exactly the second source of
  // truth the registry exists to remove. Nothing passed one.
  className?: string;
  showLanguageToggle?: boolean;
}

// The desktop nav carries five groups plus three actions; below 1024 it no
// longer fits, so the drawer takes over at lg rather than md. This constant and
// the Tailwind `lg:` prefixes must move together.
const DESKTOP_BREAKPOINT = 1024;

export function MarketingHeader({
  tone = "paper",
  className,
  showLanguageToggle = true,
}: MarketingHeaderProps) {
  const dark = tone === "dark";
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  /** id of the single open desktop panel, or null. */
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const activeLang = (i18n.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
  const setLang = (next: "en" | "fr") => {
    if (next !== activeLang) void i18n.changeLanguage(next);
  };

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
      else setOpenMenu(null);
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

          {/* Desktop nav. Groups come from the registry so the drawer and the
              footer cannot drift from what is shown here. A group with a `to`
              renders as a plain link (Pricing); the rest are disclosures.
              `openId` lives here rather than inside each disclosure, which is
              what enforces "at most one panel open". */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {PRIMARY_NAV.map((g) => {
              const label = t(g.labelKey, g.label);
              const groupRoutes = [
                ...(g.to ? [g.to] : []),
                ...(g.items ?? []).map((i) => i.to),
                ...(g.panes ?? []).flatMap((p) => [p.to, ...p.items.map((i) => i.to)]),
              ];
              const active = groupRoutes.includes(location.pathname);

              if (g.to) {
                return (
                  <Link
                    key={g.id}
                    to={g.to}
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
                    {label}
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
              }

              return (
                <NavDisclosure
                  key={g.id}
                  id={g.id}
                  label={label}
                  dark={dark}
                  openId={openMenu}
                  setOpenId={setOpenMenu}
                  items={g.items}
                  panes={g.panes}
                  active={active}
                />
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
            {/* lg and up only. The header already carries two CTAs plus the menu
                trigger; a third at md crowds them into the nav links. Ghost keeps
                the hierarchy -- Start free trial stays the one primary action. */}
            <CtaLink
              to={CAL_ROUTE}
              location="header"
              label="book_demo"
              variant="ghost"
              size="sm"
              className={cn("hidden lg:inline-flex", dark && "text-white hover:text-white")}
            >
              {t("marketingHeader.ctaBookDemo", "Book a demo")}
            </CtaLink>
            <CtaLink
              to="/login"
              location="header"
              variant={dark ? "light" : "outline"}
              size="sm"
              className="hidden sm:inline-flex"
            >
              {t("marketingHeader.ctaSignIn")}
            </CtaLink>
            <CtaLink
              to="/signup"
              location="header"
              variant={dark ? "terra" : "primary"}
              size="sm"
              className="hidden sm:inline-flex"
            >
              {t("marketingHeader.ctaStartFreeTrial")}
            </CtaLink>

            <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label={mobileOpen ? t("marketingHeader.closeMenu") : t("marketingHeader.openMenu")}
                  className={cn(
                    "lg:hidden w-11 h-11 flex items-center justify-center rounded-md border",
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
                    {/* Same registry, nested <details> disclosures. Native
                        <details> gives keyboard operation, the expanded state
                        and screen-reader semantics without a state machine, and
                        degrades to open content if scripting fails. Radix owns
                        the focus trap and scroll lock for the drawer itself. */}
                    <ul className="flex flex-col">
                      {PRIMARY_NAV.map((g) => {
                        const label = t(g.labelKey, g.label);
                        // A two-level group keeps its pane headings here too.
                        // Flattening Solutions produced one undifferentiated
                        // ten-item list where "Roadmap" sat directly under
                        // "Bilingual workflows" with nothing to say why.
                        const sections = g.panes?.length
                          ? g.panes.map((p) => ({ heading: p.label, headingKey: p.labelKey, items: p.items }))
                          : [{ heading: null, headingKey: null, items: g.items ?? [] }];
                        const border = dark ? "border-white/10" : "border-rd-line";

                        if (g.to) {
                          const active = location.pathname === g.to;
                          return (
                            <li key={g.id}>
                              <Link
                                to={g.to}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                  "flex items-center min-h-[44px] py-3 text-base font-medium border-b",
                                  border,
                                  active ? "opacity-100" : "opacity-80 hover:opacity-100"
                                )}
                              >
                                {label}
                              </Link>
                            </li>
                          );
                        }

                        return (
                          <li key={g.id} className={cn("border-b", border)}>
                            <details className="group">
                              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between py-3 text-base font-medium outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400 rounded">
                                {label}
                                <svg
                                  width="12"
                                  height="7"
                                  viewBox="0 0 10 6"
                                  fill="none"
                                  aria-hidden="true"
                                  className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
                                >
                                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                              </summary>
                              <div className="pb-2">
                                {sections.map((sec, si) => (
                                  <div key={sec.heading ?? si} className={cn(si > 0 && "mt-3")}>
                                    {sec.heading && (
                                      <div className="pl-3 pb-1 text-[11px] font-bold uppercase tracking-[0.08em] opacity-50">
                                        {sec.headingKey ? t(sec.headingKey, sec.heading) : sec.heading}
                                      </div>
                                    )}
                                    <ul>
                                      {sec.items.map((it) => {
                                        const active = location.pathname === it.to;
                                        return (
                                          <li key={it.to}>
                                            <Link
                                              to={it.to}
                                              aria-current={active ? "page" : undefined}
                                              className={cn(
                                                "flex min-h-[44px] items-center py-2.5 pl-3 text-[15px]",
                                                active ? "opacity-100 font-medium" : "opacity-75 hover:opacity-100"
                                              )}
                                            >
                                              {t(it.labelKey, it.label)}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </li>
                        );
                      })}
                    </ul>

                    {showLanguageToggle && (
                      <div
                        className={cn(
                          // No border-t: the nav list above already ends on a
                          // rule, and stacking both drew two lines with a gap.
                          "flex items-center gap-3 pt-5"
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
                    {/* CtaLink, not <Link><RDButton/></Link>. That pattern nests
                        interactive content inside an anchor: invalid HTML, two tab
                        stops per control, and it emitted no analytics -- so mobile CTA
                        clicks were invisible while the desktop ones were tracked.
                        Same appearance. The menu closes itself on route change. */}
                    <CtaLink
                      to={CAL_ROUTE}
                      location="mobile_menu"
                      label="book_demo"
                      variant={dark ? "light" : "outline"}
                      size="lg"
                      full
                      className="min-h-[44px]"
                    >
                      {t("marketingHeader.ctaBookDemo", "Book a demo")}
                    </CtaLink>
                    <CtaLink
                      to="/login"
                      location="mobile_menu"
                      variant="ghost"
                      size="lg"
                      full
                      className={cn("min-h-[44px]", dark && "text-white hover:text-white")}
                    >
                      {t("marketingHeader.ctaSignIn")}
                    </CtaLink>
                    <CtaLink
                      to="/signup"
                      location="mobile_menu"
                      variant={dark ? "terra" : "primary"}
                      size="lg"
                      full
                      className="min-h-[44px]"
                    >
                      {t("marketingHeader.ctaStartFreeTrial")}
                    </CtaLink>
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
