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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg border-2">
        <div className="flex items-start gap-4">
          <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">We Value Your Privacy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies and similar technologies to enhance your experience, analyze site traffic, 
              and personalize content. By clicking "Accept All", you consent to our use of cookies. 
              You can manage your preferences or learn more in our{" "}
              <Link to="/privacy-policy" className="text-primary underline">
                Privacy Policy
              </Link>.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground mb-4">
              <p><strong>Necessary Cookies:</strong> Required for basic site functionality (always enabled)</p>
              <p><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</p>
              <p><strong>Marketing Cookies:</strong> Used to deliver relevant ads and track campaign performance</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAccept} size="sm" className="btn-gradient">
                Accept All Cookies
              </Button>
              <Button onClick={handleReject} size="sm" variant="outline">
                Necessary Only
              </Button>
              <Button 
                onClick={() => setShowBanner(false)} 
                size="sm" 
                variant="ghost"
              >
                Close
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
