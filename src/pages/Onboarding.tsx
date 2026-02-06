import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import ProfileSetup from "@/components/onboarding/ProfileSetup";
import BusinessGoals from "@/components/onboarding/BusinessGoals";
import ImportContacts from "@/components/onboarding/ImportContacts";
import ChatbotSetup from "@/components/onboarding/ChatbotSetup";
import CalendarIntegration from "@/components/onboarding/CalendarIntegration";
import OnboardingComplete from "@/components/onboarding/OnboardingComplete";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<unknown>({});

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      
      setUserId(session.user.id);
      
      // Load existing profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setProfileData(profile);
        setCurrentStep(profile.onboarding_step || 1);
      }
      
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const saveProgress = async (step: number, data: unknown) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...data,
          onboarding_step: step,
        })
        .eq("id", userId);

      if (error) throw error;
      setProfileData({ ...profileData, ...data });
    } catch (error: unknown) {
      toast.error("Failed to save progress");
    }
  };

  const handleNext = async (data?: unknown) => {
    if (data) {
      await saveProgress(currentStep + 1, data);
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSkip = async () => {
    await saveProgress(currentStep + 1, {});
    setCurrentStep(currentStep + 1);
  };

  const handleComplete = async () => {
    if (!userId) return;

    try {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true, onboarding_step: 6 })
        .eq("id", userId);

      // Call edge function to send welcome email
      await supabase.functions.invoke("send-welcome-email", {
        body: { userId },
      });

      toast.success("Welcome to Realtor Desk AI!");
    } catch (error: unknown) {
      // Error silently handled
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const progress = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {currentStep <= 5 && (
          <>
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      step <= currentStep
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground mt-2">
                Step {currentStep} of 5
              </p>
            </div>

            {/* Step Content */}
            <Card>
              <CardContent className="p-6">
                {currentStep === 1 && (
                  <ProfileSetup
                    profileData={profileData}
                    onNext={handleNext}
                    onSkip={handleSkip}
                    userId={userId}
                  />
                )}
                {currentStep === 2 && (
                  <BusinessGoals
                    profileData={profileData}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 3 && (
                  <ImportContacts
                    userId={userId}
                    onNext={handleNext}
                    onSkip={handleSkip}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 4 && (
                  <ChatbotSetup
                    profileData={profileData}
                    userId={userId}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 5 && (
                  <CalendarIntegration
                    userId={userId}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}

        {currentStep === 6 && (
          <OnboardingComplete
            profileData={profileData}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Onboarding;
