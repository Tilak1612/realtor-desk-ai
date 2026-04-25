import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { COMMUNITY_URL, isCommunityEnabled } from "@/lib/community";

// Soft-launch banner pinned to the top of /today for 1 week after the
// community server goes live. Dismissible — once a user clicks the X,
// localStorage stops the banner from rendering for that browser.
//
// Hidden entirely when VITE_COMMUNITY_URL is empty (server not yet
// configured) so we never ship a broken "Join community" CTA into prod.

const STORAGE_KEY = "rd.communityBanner.dismissed";

const CommunityBanner = () => {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (!isCommunityEnabled() || dismissed) return null;

  const handleDismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="flex items-start gap-3 sm:items-center">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {t("communityBanner.heading", "We just launched the Realtor Desk Community")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t(
              "communityBanner.body",
              "Chat with other Canadian agents, share tips, and shape what we build next.",
            )}
          </p>
        </div>
        <a
          href={COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
        >
          {t("communityBanner.cta", "Join community")}
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t("communityBanner.dismiss", "Dismiss community banner")}
          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <a
        href={COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-2 ml-12"
      >
        {t("communityBanner.cta", "Join community")}
        <ArrowRight className="w-3 h-3" aria-hidden="true" />
      </a>
    </Card>
  );
};

export default CommunityBanner;
