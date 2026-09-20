import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { SEO } from "@/components/SEO";
import ContinueConsentNotice from "@/components/auth/ContinueConsentNotice";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { setRememberMe, isRemembered } from "@/lib/auth/sessionPersistence";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => isRemembered());

  // A failed provider round-trip comes back as query params on this page and
  // used to vanish silently -- the visitor saw the form again with no reason
  // given. Surface it once, then strip it so a refresh does not repeat it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error_description") || params.get("error");
    if (!err) return;
    toast.error(
      /access_denied|cancel/i.test(err)
        ? t("auth.oauth.cancelled", "Sign-in was cancelled.")
        : t("auth.oauth.failed", "Could not start sign-in with that provider. Please try again.")
    );
    window.history.replaceState({}, "", window.location.pathname);
  }, [t]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .single();

        if (profile?.onboarding_completed !== false) {
          navigate("/today");
        } else {
          navigate("/onboarding");
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t('app.validation.required'));
      return;
    }

    setLoading(true);
    // Chosen BEFORE the call: the session is written during it.
    setRememberMe(remember);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", data.user.id)
          .single();

        if (profile?.onboarding_completed !== false) {
          navigate("/today");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error(t('app.auth.invalidCredentials'));
      } else {
        toast.error(error.message || t('app.notifications.errorOccurred'));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full px-4 py-3 pl-12 border border-rd-line rounded-xl bg-white text-rd-ink-900 placeholder-rd-ink-400 focus:ring-2 focus:ring-rd-navy-500 focus:border-transparent transition-all duration-200 hover:border-rd-line-strong";

  return (
    <AuthLayout>
      <SEO
        title={t("pageSeo.loginTitle")}
        description={t("pageSeo.loginDesc")}
        noindex
      />
      <AuthCard
        title="Realtor Desk"
        subtitle={t('auth.login.subtitle', 'Sign in to your workspace')}
      >
        <div className="space-y-6">
          {/* Continue with Google / Microsoft — full width, stacked. */}
          <OAuthButtons remember={remember} redirectPath="/today" />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-rd-line" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-rd-ink-500 font-medium">{t('auth.login.orEmail', 'Or continue with email')}</span>
            </div>
          </div>

          {/* Form */}
          <form noValidate onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-rd-ink-800 flex items-center gap-2">
                {t('auth.login.emailAddress', 'Email address')} <span className="text-xs text-red-700">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClassName}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rd-ink-400" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-rd-ink-800 flex items-center gap-2">
                {t('auth.login.password', 'Password')} <span className="text-xs text-red-700">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClassName} pr-12`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rd-ink-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  // An icon-only button with no accessible name: a screen
                  // reader announced "button" and nothing else, on the control
                  // that reveals your password. axe rates this CRITICAL, above
                  // every contrast finding on the site.
                  aria-label={
                    showPassword
                      ? t("app.auth.hidePassword", "Hide password")
                      : t("app.auth.showPassword", "Show password")
                  }
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-rd-ink-400 hover:text-rd-ink-700 transition-colors p-1 rounded-md hover:bg-rd-ink-100"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me · Forgot password */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <label
                htmlFor="remember"
                className="inline-flex items-center gap-2 text-sm text-rd-ink-700 cursor-pointer min-h-[24px]"
              >
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-rd-line text-rd-navy-800 focus-visible:ring-2 focus-visible:ring-rd-navy-500"
                />
                {t('auth.login.rememberMe', 'Remember me')}
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-rd-navy-700 hover:text-rd-navy-800 font-medium underline underline-offset-2 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500 inline-flex items-center min-h-[24px]"
              >
                {t('auth.login.forgotPassword', 'Forgot password?')}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rd-navy-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-rd-navy-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span>{loading ? t('app.common.loading') : t('auth.login.signInSecurely', 'Sign in securely')}</span>
              {/* aria-hidden: the state is already announced by the label text
                    swapping to "Loading". Under prefers-reduced-motion the
                    global rule freezes the rotation, leaving a static glyph
                    beside that text -- still an indicator, just not moving. */}
                {loading && (
                  <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />
                )}
                {!loading && <ArrowRight aria-hidden="true" className="w-4 h-4" />}
            </button>

            {/* Same notice as signup. Login had none at all, so a returning
                user was never shown the terms they are bound by. */}
            <ContinueConsentNotice />

          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-rd-ink-600">
            {t('auth.login.noAccount', "Don't have an account?")}{" "}
            <Link to="/signup" className="text-rd-navy-700 font-medium underline underline-offset-2 hover:text-rd-navy-800 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500">
              {t('auth.login.startTrial', 'Start your free trial')}
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
