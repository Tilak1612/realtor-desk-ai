import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold gradient-text">404</h1>
        <p className="mb-6 text-2xl text-muted-foreground">
          {t("notFound.heading", "Oops! Page not found")}
        </p>
        <p className="mb-8 text-muted-foreground max-w-md mx-auto">
          {t(
            "notFound.body",
            "The page you're looking for doesn't exist or has been moved."
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
            <Button size="lg" variant={hasSession ? "outline" : "default"} className={hasSession ? "" : "btn-gradient"}>
              {t("notFound.goHome", "Return to home")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
