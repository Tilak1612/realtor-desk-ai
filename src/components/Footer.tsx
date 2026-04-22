import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Youtube, Twitter, Facebook, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/realtor-desk-icon.png";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-muted border-t">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img src={logo} alt="Realtor Desk" className="h-9 w-9 object-contain" />
              <span className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                Realtor Desk
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer.tagline')}
            </p>
            <p className="text-xs text-muted-foreground italic mb-4">
              {t('footer.poweredBy', 'Powered by Brainfy AI Inc')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.youtube.com/@RealtorDeskAI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://x.com/Realtor_desk_AI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61583653411571"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.instagram.com/realtor_desk_ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.product')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.features')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.bookDemo')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.resourcesHeading', 'Resources')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.blog')}
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.roadmap', 'Product Roadmap')}
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.integrations')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.careers')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.helpCenter')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-primary" />
                <a href="mailto:support@realtordesk.ai" className="text-muted-foreground hover:text-primary transition-colors">
                  support@realtordesk.ai
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground">
                  Edmonton, Alberta, Canada
                </span>
              </li>
              <li>
                <Link to="/contact" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  {t('footer.contact')} →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                {t('footer.terms')}
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem("cookie-consent");
                  window.location.reload();
                }} 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.cookieSettings', 'Cookie Settings')}
              </button>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                {t('footer.contact')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
