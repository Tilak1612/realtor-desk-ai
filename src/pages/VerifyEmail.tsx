import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const phone = location.state?.phone || "";
  const userId = location.state?.userId || "";
  
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

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

  const handleVerifyPhone = async () => {
    if (!phoneCode || phoneCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      // Get user metadata to check verification code
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("User not found. Please sign up again.");
        return;
      }

      const storedCode = user.user_metadata?.phone_verification_code;

      if (phoneCode === storedCode) {
        // Update user metadata to mark phone as verified
        const { error } = await supabase.auth.updateUser({
          data: { phone_verified: true }
        });

        if (error) throw error;

        setPhoneVerified(true);
        toast.success("Phone verified successfully!");

        // If both verifications are complete, redirect to dashboard
        if (emailVerified) {
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error: any) {
      console.error("Phone verification error:", error);
      toast.error(error.message || "Failed to verify phone");
    } finally {
      setLoading(false);
    }
  };

  const handleResendPhoneCode = async () => {
    if (!phone || !userId) {
      toast.error("Phone information not found. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      // Generate new code
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Update user metadata with new code
      const { error: updateError } = await supabase.auth.updateUser({
        data: { phone_verification_code: newCode }
      });

      if (updateError) throw updateError;

      // Send new SMS
      const { error: smsError } = await supabase.functions.invoke("send-phone-verification", {
        body: {
          phone,
          code: newCode,
        },
      });

      if (smsError) throw smsError;

      toast.success("New verification code sent to your phone!");
    } catch (error: any) {
      console.error("Resend phone code error:", error);
      toast.error(error.message || "Failed to resend code");
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
              {emailVerified && phoneVerified ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <div className="flex gap-4">
                  <Mail className={`w-12 h-12 ${emailVerified ? 'text-green-500' : 'text-primary'}`} />
                  <Phone className={`w-12 h-12 ${phoneVerified ? 'text-green-500' : 'text-primary'}`} />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold">
              Verify Your Account
            </CardTitle>
            <CardDescription>
              Please verify both your email and phone number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Verification Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className={`w-5 h-5 ${emailVerified ? 'text-green-500' : 'text-primary'}`} />
                <h3 className="font-semibold">Email Verification</h3>
                {emailVerified && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
              </div>
              
              {!emailVerified ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResendEmail}
                    disabled={loading || emailSent}
                  >
                    {loading ? "Sending..." : emailSent ? "Email sent!" : "Resend email"}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-green-600">✓ Email verified successfully</p>
              )}
            </div>

            {/* Phone Verification Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className={`w-5 h-5 ${phoneVerified ? 'text-green-500' : 'text-primary'}`} />
                <h3 className="font-semibold">Phone Verification</h3>
                {phoneVerified && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
              </div>
              
              {!phoneVerified ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to <span className="font-medium text-foreground">{phone}</span>
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="phoneCode">Verification Code</Label>
                    <Input
                      id="phoneCode"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      disabled={loading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleVerifyPhone}
                      disabled={loading || phoneCode.length !== 6}
                      className="flex-1"
                    >
                      {loading ? "Verifying..." : "Verify Phone"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleResendPhoneCode}
                      disabled={loading}
                    >
                      Resend
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-green-600">✓ Phone verified successfully</p>
              )}
            </div>

            {/* Status Message */}
            {emailVerified && phoneVerified && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Account fully verified! Redirecting to dashboard...
                </p>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              <p>Both verifications must be completed to access your account.</p>
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
