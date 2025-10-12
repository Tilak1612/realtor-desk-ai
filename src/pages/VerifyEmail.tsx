import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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

      setSent(true);
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
              {sent ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <Mail className="w-16 h-16 text-primary" />
              )}
            </div>
            <CardTitle className="text-3xl font-bold">
              Check your email
            </CardTitle>
            <CardDescription>
              We've sent a verification link to
            </CardDescription>
            <p className="text-base font-medium text-foreground">{email}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-center text-sm text-muted-foreground">
              <p>
                Click the link in the email to verify your account and complete your
                registration.
              </p>
              <p>
                If you don't see the email, check your spam folder or request a new one.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={loading || sent}
            >
              {loading ? "Sending..." : sent ? "Email sent!" : "Resend verification email"}
            </Button>

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
