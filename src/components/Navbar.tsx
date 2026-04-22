import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { RDMark } from "@/components/rd/Logo";

// Legacy marketing navbar. Mobile drawer is a Radix Dialog modal —
// portal-rendered, with focus trap, Escape, scroll lock, aria-modal.
// Overlay z-60 and content z-70 sit above the sticky <header> (z-40)
// and below the toast stack (z-100). Before this PR the drawer was an
// inline conditional <div> under the nav, which didn't lock body
// scroll and had no backdrop — hero content bled through.

const MD_BREAKPOINT = 768;

const Navbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close drawer when crossing into md+ viewport.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsMobileMenuOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const navLinks = [
    { name: t('nav.features'), path: "/features" },
    { name: t('footer.howItWorks'), path: "/how-it-works" },
    { name: t('nav.pricing'), path: "/pricing" },
    { name: t('nav.integrations'), path: "/integrations" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background/95 backdrop-blur-sm"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20 gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 group shrink-0" aria-label="Realtor Desk">
            <RDMark size={36} />
            <span className="text-xl font-bold text-foreground group-hover:text-accent transition-colors whitespace-nowrap">
              Realtor Desk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors relative group text-base whitespace-nowrap ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                    isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="outline" className="font-semibold text-sm lg:text-base">{t('app.auth.signIn')}</Button>
            </Link>
            <Link to="/demo">
              <Button className="btn-gradient font-semibold text-sm lg:text-base whitespace-nowrap">
                <span className="hidden lg:inline">{t('nav.startClosing')}</span>
                <span className="lg:hidden">{t('nav.getStarted', 'Get Started')}</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu — Radix Dialog modal */}
          <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <Dialog.Trigger asChild>
              <button
                className="md:hidden p-3 -mr-2 touch-manipulation active:scale-95 transition-transform text-foreground min-w-[44px] min-h-[44px]"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <Menu className="w-7 h-7" aria-hidden="true" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay
                className={cn(
                  "fixed inset-0 z-[60] bg-foreground/55 backdrop-blur-sm",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none"
                )}
              />
              <Dialog.Content
                className={cn(
                  "fixed inset-y-0 right-0 z-[70] flex h-full w-full max-w-sm flex-col bg-background text-foreground shadow-2xl outline-none border-l",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-300 data-[state=closed]:duration-200 motion-reduce:animate-none"
                )}
              >
                <Dialog.Title className="sr-only">Realtor Desk navigation</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Main navigation menu
                </Dialog.Description>

                <div className="flex items-center justify-between px-4 py-4 border-b">
                  <Link
                    to="/"
                    className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    aria-label="Realtor Desk"
                  >
                    <RDMark size={32} />
                    <span className="text-lg font-bold">Realtor Desk</span>
                  </Link>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="w-11 h-11 flex items-center justify-center rounded-md border border-border hover:bg-muted touch-manipulation"
                    >
                      <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-4">
                  <ul className="flex flex-col">
                    {navLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`flex items-center min-h-[44px] font-medium py-3 px-2 rounded-lg touch-manipulation active:scale-[0.98] transition-all text-base ${
                            isActive(link.path) ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 py-4 border-t mt-4">
                    <LanguageSwitcher />
                  </div>
                </nav>

                <div className="flex flex-col gap-3 px-4 py-4 border-t">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full min-h-[48px] text-base font-semibold">
                      {t('app.auth.signIn')}
                    </Button>
                  </Link>
                  <Link to="/demo" className="w-full">
                    <Button className="btn-gradient w-full min-h-[48px] text-base font-semibold">
                      {t('nav.startClosing')}
                    </Button>
                  </Link>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
