import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NexusIcon = () => (
  <svg width="36" height="36" viewBox="0 0 92 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
    <path d="M18.8834 4.66666C17.4168 4.66666 16.2168 5.86666 16.2168 7.33332V11.56L18.8834 14.2267L21.5501 11.56V7.33332C21.5501 6.59999 21.2568 5.93332 20.7634 5.43999C20.2834 4.95999 19.6168 4.66666 18.8834 4.66666Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.2168 24.44V28.6666C16.2168 30.1333 17.4168 31.3333 18.8834 31.3333C20.3501 31.3333 21.5501 30.1333 21.5501 28.6666V24.44L18.8834 21.7733L16.2168 24.44Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.4434 15.3333H8.21675C6.75008 15.3333 5.55008 16.5333 5.55008 18C5.55008 19.4667 6.75008 20.6667 8.21675 20.6667H12.4434L15.1101 18L12.4434 15.3333Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M29.5502 15.3333H25.3235L22.6569 18L25.3235 20.6667H29.5502C30.2835 20.6667 30.9502 20.3733 31.4302 19.88C31.9235 19.4 32.2169 18.7333 32.2169 18C32.2169 16.5333 31.0169 15.3333 29.5502 15.3333Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28.3101 23.6533L22.6568 18L18.8834 21.7733L24.5368 27.4267C25.5768 28.4667 27.2701 28.4667 28.3101 27.4267C29.3501 26.3867 29.3501 24.6933 28.3101 23.6533Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.2301 8.57329C12.7101 8.05329 12.0301 7.78662 11.3367 7.78662C10.6567 7.78662 9.97673 8.05329 9.45673 8.57329C8.41673 9.61329 8.41673 11.3066 9.45673 12.3466L15.1101 18L18.8834 14.2266L13.2301 8.57329Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.45673 27.4266C8.41673 26.3866 8.41673 24.6933 9.45673 23.6533L24.5367 8.5733C25.5767 7.5333 27.2701 7.5333 28.3101 8.5733C29.3501 9.6133 29.3501 11.3066 28.3101 12.3466L13.2301 27.4266C12.1901 28.4666 10.4967 28.4666 9.45673 27.4266Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

  const navLinks = [
    { name: t('nav.features'), path: "/features" },
    { name: t('footer.howItWorks'), path: "/how-it-works" },
    { name: t('nav.pricing'), path: "/pricing" },
    { name: t('nav.integrations'), path: "/integrations" },
    { name: t('nav.resources'), path: "/resources" },
    { name: t('nav.faq'), path: "/faq" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20 gap-2 sm:gap-4">
          {/* Logo - Mobile Optimized */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <NexusIcon />
            <span className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
              RealtorDesk AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors relative group text-base ${
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

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="outline" className="font-semibold">Sign In</Button>
            </Link>
            <Link to="/demo">
              <Button className="btn-gradient font-semibold">{t('nav.startClosing')}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button - Touch Optimized */}
          <button
            className="md:hidden p-3 -mr-2 touch-manipulation active:scale-95 transition-transform text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Touch Optimized */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in bg-background backdrop-blur-lg shadow-lg">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-medium py-3 px-2 rounded-lg touch-manipulation active:scale-98 transition-all text-base ${
                    isActive(link.path) ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 py-3 px-2">
                <LanguageSwitcher />
              </div>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-2">
                <Button variant="outline" className="w-full min-h-[52px] text-base font-semibold">Sign In</Button>
              </Link>
              <Link to="/demo" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="btn-gradient w-full min-h-[52px] text-base font-semibold">{t('nav.startClosing')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
