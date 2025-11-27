import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
const MobileCTA = () => {
  const {
    t
  } = useTranslation();
  return (
    // Fixed mobile CTA bar - only visible on mobile
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background border-t-2 border-border shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-fade-in">
      <div className="container-custom py-3">
        <div className="flex gap-2">
          
          <Link to="/signup" className="flex-[2]">
            <Button size="lg" className="btn-gradient w-full min-h-[52px] text-base font-semibold">
              {t('mobileCTA.title')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default MobileCTA;