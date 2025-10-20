import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

const MobileCTA = () => {
  return (
    // Fixed mobile CTA bar - only visible on mobile
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t shadow-2xl animate-fade-in">
      <div className="container-custom py-3">
        <div className="flex gap-2">
          <Link to="/demo" className="flex-1">
            <Button size="lg" variant="outline" className="w-full min-h-[52px] text-base">
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </Button>
          </Link>
          <Link to="/signup" className="flex-[2]">
            <Button size="lg" className="btn-gradient w-full min-h-[52px] text-base">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileCTA;
