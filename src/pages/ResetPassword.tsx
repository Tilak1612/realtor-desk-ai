import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PasswordInput, validatePassword } from "@/components/ui/password-input";
import { useTranslation } from "react-i18next";
import { parseRecoveryFragment } from "@/lib/auth/recoveryLink";
import { isNativeApp } from "@/lib/native/platform";
import "@/i18n/nativeAuth";

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // True once this page has turned the link it was opened with into a session
  // itself (below). The sign-in that produces is the START of a reset, not the
  // end of one, so the listener must not greet it with "Password reset
  // successful!" and leave the page.
  const openedFromLink = useRef(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is in password recovery mode
      } else if (event === "SIGNED_IN" && !openedFromLink.current) {
        toast.success(t('auth.reset.success', 'Password reset successful!'));
        navigate("/today");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, t]);

  // Recovery links the Supabase client does not pick up by itself.
  //
  // 1. A link carrying its credentials in the fragment
  //    (#access_token=...&type=recovery). This is what a reset requested from
  //    the iOS / Android app produces, because a PKCE link would only work
  //    inside the app that asked for it (lib/native/auth/passwordRecovery.ts),
  //    and it is what scripts/recovery-link.sh generates for support. The
  //    client here is configured for PKCE and rejects that shape on start-up,
  //    so the page establishes the session from it explicitly. This is the
  //    one part of this file that runs on the website for the app's benefit:
  //    the link opens in the phone's browser, not in the app. A URL without
  //    such a fragment (every reset started on the website) never enters it.
  //
  // 2. In the app only, a ?code= delivered by a universal link. The app's
  //    client does not read its own URL (detectSessionInUrl is off there), so
  //    the exchange is done here.
  useEffect(() => {
    if (openedFromLink.current) return;
    const tokens = parseRecoveryFragment(window.location.hash);
    const code = isNativeApp() ? new URLSearchParams(window.location.search).get("code") : null;
    if (!tokens && !code) return;
    openedFromLink.current = true;

    // Out of the address bar and the history entry before anything else: these
    // are credentials.
    window.history.replaceState(window.history.state, "", window.location.pathname);

    void (async () => {
      const { error } = tokens
        ? await supabase.auth.setSession({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
          })
        : await supabase.auth.exchangeCodeForSession(code as string);
      if (error) {
        // Expired, or used once already. The provider's wording is not shown.
        toast.error(
          t(
            'nativeAuth.reset.linkInvalid',
            'This reset link has expired or was already used. Request a new one from the sign-in screen.'
          )
        );
      }
    })();
  }, [t]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error(t('auth.reset.fillAll', 'Please fill in all fields'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('auth.reset.noMatch', 'Passwords do not match'));
      return;
    }

    if (!validatePassword(password)) {
      toast.error(t('auth.reset.requirements', 'Password does not meet all requirements'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success(t('auth.reset.updated', 'Password updated successfully!'));
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || t('auth.reset.failed', 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">
              {t('auth.reset.title', 'Set new password')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.reset.subtitle', 'Enter your new password below')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form noValidate onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.reset.newPassword', 'New Password')}</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showValidation={true}
                  onValidationChange={setIsPasswordValid}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.reset.confirmPassword', 'Confirm Password')}</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading || !isPasswordValid}>
                {loading ? t('auth.reset.resetting', 'Resetting...') : t('auth.reset.resetButton', 'Reset Password')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
