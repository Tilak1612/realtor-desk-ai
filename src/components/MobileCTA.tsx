import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

const MobileCTA = () => {
  const { t } = useTranslation();
  return (
    // Fixed mobile CTA bar - only visible on mobile
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t shadow-2xl animate-fade-in">
      <div className="container-custom py-3 px-3">
        <div className="flex gap-2">
          <Link to="/demo" className="flex-1">
            <Button size="lg" variant="outline" className="w-full min-h-[52px] text-sm font-semibold">
              <Phone className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">{t('nav.bookDemo')}</span>
            </Button>
          </Link>
          <Link to="/signup" className="flex-1">
            <Button size="lg" className="btn-gradient w-full min-h-[52px] text-sm font-semibold">
              <span className="truncate">{t('mobileCTA.title')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileCTA;
