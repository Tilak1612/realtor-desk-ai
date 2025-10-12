import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUserId(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const handleCompleteOnboarding = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Welcome to Realtor Desk AI!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Failed to complete onboarding");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold">
            Welcome to Realtor Desk AI!
          </CardTitle>
          <CardDescription className="text-lg">
            You're all set to start your 60-day free trial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="font-semibold mb-2">✨ What's included:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• AI-powered lead management and follow-ups</li>
                <li>• Automated client communication</li>
                <li>• Smart scheduling and calendar integration</li>
                <li>• Transaction management tools</li>
                <li>• Performance analytics and insights</li>
              </ul>
            </div>

            <div className="p-4 bg-secondary/5 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 Next steps:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Explore your dashboard and features</li>
                <li>• Connect your email and calendar</li>
                <li>• Import your existing contacts</li>
                <li>• Set up your first AI automation</li>
              </ul>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleCompleteOnboarding}
            disabled={loading}
          >
            {loading ? "Setting up..." : "Get Started"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            No credit card required during your trial period
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
