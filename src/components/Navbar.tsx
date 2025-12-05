import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/realtor-desk-logo-new.png";

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
          <Link to="/" className="flex items-center group shrink-0">
            <img 
              src={logo} 
              alt="RealtorDesk AI Logo - Canadian Real Estate AI Platform" 
              className="h-14 sm:h-12 md:h-13 lg:h-14 w-auto group-hover:scale-105 transition-transform"
            />
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
