import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const userId = location.state?.userId || "";
  
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Check email verification status
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!userId) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setEmailVerified(true);
      }
    };

    checkEmailVerification();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        setEmailVerified(true);
        // Redirect to dashboard once email is verified
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    });

    return () => subscription.unsubscribe();
  }, [userId]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email address not found. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success("Verification email resent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              {emailVerified ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <Mail className="w-12 h-12 text-primary" />
              )}
            </div>
            <CardTitle className="text-3xl font-bold">
              Verify Your Email
            </CardTitle>
            <CardDescription>
              Please check your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Verification Section */}
            <div className="space-y-4">
              {!emailVerified ? (
                <>
                  <p className="text-sm text-muted-foreground text-center">
                    We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    Please click the link in your email to verify your account.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResendEmail}
                    disabled={loading || emailSent}
                  >
                    {loading ? "Sending..." : emailSent ? "Email sent!" : "Resend verification email"}
                  </Button>
                </>
              ) : (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    ✓ Email verified successfully! Redirecting to dashboard...
                  </p>
                </div>
              )}
            </div>

            <div className="text-center">
              <Link to="/login" className="text-sm text-primary hover:underline">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
