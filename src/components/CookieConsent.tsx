import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Cookie, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-slide-up">
      <Card className="max-w-3xl mx-auto p-4 sm:p-6 shadow-lg border-2 bg-background">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 hidden sm:block" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg mb-2">🍪 Cookie Preferences</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              We use cookies to enhance your browsing experience and analyze site traffic. You can customize your cookie preferences or accept all.{" "}
              <Link to="/privacy-policy" className="text-primary underline hover:text-primary/80 transition-colors">
                Privacy Policy
              </Link>
            </p>

            {!showSettings ? (
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleAcceptAll} 
                  size="sm" 
                  className="btn-gradient text-xs sm:text-sm h-9 px-4"
                >
                  Accept All Cookies
                </Button>
                <Button 
                  onClick={handleRejectAll} 
                  size="sm" 
                  variant="outline" 
                  className="text-xs sm:text-sm h-9 px-4"
                >
                  Necessary Only
                </Button>
                <Button 
                  onClick={() => setShowSettings(true)} 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs sm:text-sm h-9 px-4"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Necessary Cookies</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Required for basic site functionality. Cannot be disabled.
                      </p>
                    </div>
                    <Switch 
                      checked={true} 
                      disabled 
                      aria-label="Necessary cookies (always enabled)"
                    />
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Analytics Cookies</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Help us understand how visitors interact with our website.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.analytics} 
                      onCheckedChange={() => togglePreference('analytics')}
                      aria-label="Toggle analytics cookies"
                    />
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Marketing Cookies</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Used to deliver personalized advertisements relevant to you.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.marketing} 
                      onCheckedChange={() => togglePreference('marketing')}
                      aria-label="Toggle marketing cookies"
                    />
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Functional Cookies</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enable enhanced functionality like chat widgets and preferences.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.functional} 
                      onCheckedChange={() => togglePreference('functional')}
                      aria-label="Toggle functional cookies"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button 
                    onClick={handleSavePreferences} 
                    size="sm" 
                    className="btn-gradient text-xs sm:text-sm h-9 px-4"
                  >
                    Save Preferences
                  </Button>
                  <Button 
                    onClick={() => setShowSettings(false)} 
                    size="sm" 
                    variant="outline" 
                    className="text-xs sm:text-sm h-9 px-4"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0 h-8 w-8"
            aria-label="Close cookie consent banner"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
