import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t('auth.forgot.enterEmail', 'Please enter your email address'));
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setSent(true);
      toast.success(t('auth.forgot.emailSent', 'Password reset email sent!'));
    } catch (error: any) {
      toast.error(error.message || t('auth.forgot.sendFailed', 'Failed to send reset email'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Card className="w-full max-w-md">
          {!sent ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-bold text-center">
                  {t('auth.forgot.title', 'Reset password')}
                </CardTitle>
                <CardDescription className="text-center">
                  {t('auth.forgot.subtitle', "Enter your email and we'll send you a reset link")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form noValidate onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('app.auth.email', 'Email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? t('auth.forgot.sending', 'Sending...') : t('auth.forgot.sendLink', 'Send reset link')}
                  </Button>
                </form>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('auth.forgot.backToLogin', 'Back to sign in')}
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                  <Mail className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">{t('auth.forgot.checkEmail', 'Check your email')}</CardTitle>
                <CardDescription>
                  {t('auth.forgot.sentTo', "We've sent a password reset link to")}
                </CardDescription>
                <p className="text-base font-medium text-foreground">{email}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 text-center text-sm text-muted-foreground">
                  <p>{t('auth.forgot.linkExpiry', 'Click the link in the email to reset your password. The link will expire in 1 hour.')}</p>
                  <p>{t('auth.forgot.checkSpam', "If you don't see the email, check your spam folder.")}</p>
                </div>

                <div className="text-center">
                  <Link to="/login" className="text-sm text-primary hover:underline">
                    {t('auth.forgot.backToLogin', 'Back to sign in')}
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
