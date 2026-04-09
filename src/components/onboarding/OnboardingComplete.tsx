import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Play, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface OnboardingCompleteProps {
  profileData: Record<string, any>;
  onComplete: () => void;
}

const OnboardingComplete = ({ profileData, onComplete }: OnboardingCompleteProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ["#667eea", "#764ba2", "#f093fb"];

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 2;
      // Create confetti using any available method
      // This is a placeholder - you might want to use a library like canvas-confetti
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 60);

  const setupItems = [
    { label: "Profile completed", done: !!profileData.full_name },
    { label: "Business goals set", done: !!profileData.business_preferences },
    { label: "AI Chatbot configured", done: true },
    { label: "Calendar connected", done: true },
  ];

  const handleGoToDashboard = async () => {
    await onComplete();
    navigate("/today");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card className="text-center">
        <CardHeader className="pb-0">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold mb-2">{t('onboarding.complete.title', "You're All Set!")}</CardTitle>
          <p className="text-lg text-muted-foreground">
            {t('onboarding.complete.welcome', 'Welcome to Realtor Desk AI')}, {profileData.full_name}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <p className="text-muted-foreground">
            Your 60-day free trial is now active and will end on{" "}
            <span className="font-semibold">{trialEndDate.toLocaleDateString()}</span>
          </p>

          {/* Setup Checklist */}
          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle className="text-lg">{t('onboarding.complete.whatWeSetUp', 'What We Set Up')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {setupItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        item.done ? "text-green-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className={item.done ? "" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('onboarding.complete.whatsNext', "What's Next?")}</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button
                size="lg"
                className="w-full justify-between group"
                onClick={handleGoToDashboard}
              >
                <span>{t('onboarding.complete.goDashboard', 'Go to Dashboard')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full justify-between group"
              >
                <span>{t('onboarding.complete.watchTutorial', 'Watch Tutorial')}</span>
                <Play className="w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="ghost"
                onClick={handleGoToDashboard}
              >
                {t('onboarding.complete.skipTutorial', 'Skip Tutorial')}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {t('onboarding.complete.needHelp', 'Need help getting started?')}{" "}
              <a href="/contact" className="text-primary hover:underline">
                {t('onboarding.complete.contactSupport', 'Contact our support team')}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingComplete;
