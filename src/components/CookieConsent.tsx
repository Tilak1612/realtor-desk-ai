import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-slide-up">
      <Card className="max-w-2xl mx-auto p-4 sm:p-5 shadow-lg border-2">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 hidden sm:block" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Cookie Consent</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              We use cookies to enhance your experience. By clicking "Accept All", you consent to our use of cookies.{" "}
              <Link to="/privacy-policy" className="text-primary underline whitespace-nowrap">
                Privacy Policy
              </Link>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAccept} size="sm" className="btn-gradient text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                Accept All
              </Button>
              <Button onClick={handleReject} size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                Necessary Only
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
