import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Cookie, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CookieConsent = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
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
    if (key === 'necessary') return;
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
            <h3 className="font-semibold text-base sm:text-lg mb-2">{t('cookie.title', '🍪 Cookie Preferences')}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              {t('cookie.description', 'We use cookies to enhance your browsing experience and analyze site traffic. You can customize your cookie preferences or accept all.')}{" "}
              <Link to="/privacy-policy" className="text-primary underline hover:text-primary/80 transition-colors">
                {t('cookie.privacyLink', 'Privacy Policy')}
              </Link>
            </p>

            {!showSettings ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAcceptAll}
                  size="sm"
                  className="btn-gradient text-xs sm:text-sm h-9 px-4"
                >
                  {t('cookie.acceptAll', 'Accept All Cookies')}
                </Button>
                <Button
                  onClick={handleRejectAll}
                  size="sm"
                  variant="outline"
                  className="text-xs sm:text-sm h-9 px-4"
                >
                  {t('cookie.necessaryOnly', 'Necessary Only')}
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  size="sm"
                  variant="ghost"
                  className="text-xs sm:text-sm h-9 px-4"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('cookie.customize', 'Customize')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{t('cookie.necessary', 'Necessary Cookies')}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('cookie.necessaryDesc', 'Required for basic site functionality. Cannot be disabled.')}
                      </p>
                    </div>
                    <Switch checked={true} disabled aria-label={t('cookie.necessaryAria', 'Necessary cookies (always enabled)')} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{t('cookie.analytics', 'Analytics Cookies')}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('cookie.analyticsDesc', 'Help us understand how visitors interact with our website.')}
                      </p>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={() => togglePreference('analytics')}
                      aria-label={t('cookie.analyticsAria', 'Toggle analytics cookies')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{t('cookie.marketing', 'Marketing Cookies')}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('cookie.marketingDesc', 'Used to deliver personalized advertisements relevant to you.')}
                      </p>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={() => togglePreference('marketing')}
                      aria-label={t('cookie.marketingAria', 'Toggle marketing cookies')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{t('cookie.functional', 'Functional Cookies')}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('cookie.functionalDesc', 'Enable enhanced functionality like chat widgets and preferences.')}
                      </p>
                    </div>
                    <Switch
                      checked={preferences.functional}
                      onCheckedChange={() => togglePreference('functional')}
                      aria-label={t('cookie.functionalAria', 'Toggle functional cookies')}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    onClick={handleSavePreferences}
                    size="sm"
                    className="btn-gradient text-xs sm:text-sm h-9 px-4"
                  >
                    {t('cookie.savePreferences', 'Save Preferences')}
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    size="sm"
                    variant="outline"
                    className="text-xs sm:text-sm h-9 px-4"
                  >
                    {t('cookie.back', 'Back')}
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
            aria-label={t('cookie.closeAria', 'Close cookie consent banner')}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
