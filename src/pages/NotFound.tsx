import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

// 404. Wraps recovery UI in the global Navbar + Footer so users who
// hit an unknown route still have the site chrome (nav links, lang
// switcher, legal links in footer) — being stranded on a standalone
// 404 was flagged in the 2026-04-24 audit.

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    // 404 tracking could be sent to analytics service here
  }, [location.pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* noindex so Googlebot doesn't SERP-list the 404 component body
          when it lands on a soft-404 route. The SPA returns HTTP 200
          for every unknown route until SSR lands; meta robots is the
          only signal we can give crawlers today. */}
      <SEO
        title={t("notFound.seoTitle", "Page not found — Realtor Desk")}
        description={t(
          "notFound.seoDesc",
          "The page you're looking for doesn't exist or has been moved.",
        )}
        noindex
      />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="text-center max-w-xl">
          <h1 className="mb-4 text-6xl font-bold gradient-text">404</h1>
          <p className="mb-6 text-2xl text-muted-foreground">
            {t("notFound.heading", "Oops! Page not found")}
          </p>
          <p className="mb-8 text-muted-foreground">
            {t(
              "notFound.body",
              "The page you're looking for doesn't exist or has been moved.",
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasSession && (
              <Link to="/dashboard">
                <Button size="lg" className="btn-gradient">
                  {t("notFound.goDashboard", "Go to dashboard")}
                </Button>
              </Link>
            )}
            <Link to="/">
              <Button
                size="lg"
                variant={hasSession ? "outline" : "default"}
                className={hasSession ? "" : "btn-gradient"}
              >
                {t("notFound.goHome", "Return to home")}
              </Button>
            </Link>
          </div>

          {/* Helpful landing points — keeps a stranded visitor one
              click away from the most-searched destinations. */}
          <div className="mt-10 pt-6 border-t text-sm text-muted-foreground">
            <p className="mb-3">{t("notFound.tryInstead", "Try one of these instead:")}</p>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/features" className="hover:text-primary transition-colors">
                {t("marketingHeader.navFeatures", "Features")}
              </Link>
              <Link to="/pricing" className="hover:text-primary transition-colors">
                {t("marketingHeader.navPricing", "Pricing")}
              </Link>
              <Link to="/resources" className="hover:text-primary transition-colors">
                {t("marketingHeader.navResources", "Resources")}
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                {t("footer.contact", "Contact")}
              </Link>
            </nav>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
