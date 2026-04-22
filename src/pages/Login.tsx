import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Info, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .single();

        if (profile?.onboarding_completed) {
          navigate("/today");
        } else {
          navigate("/onboarding");
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleOAuthSignIn = async (provider: "google" | "azure") => {
    try {
      // Redirect to /today so ProtectedRoute + Today.tsx handle the
      // onboarding_completed check — avoids stranding users on the landing page.
      const redirectUrl = `${window.location.origin}/today`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || t('app.notifications.errorOccurred'));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t('app.validation.required'));
      return;
    }

    setLoading(true);
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

        if (profile?.onboarding_completed) {
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

  const inputClassName = "w-full px-4 py-3 pl-12 border border-white/10 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-gray-600 transition-all duration-300 hover:border-white/20";

  return (
    <AuthLayout>
      <AuthCard
        title="Realtor Desk AI"
        subtitle={t('auth.login.subtitle', 'Sign in to your workspace')}
      >
        <div className="space-y-6">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl hover:bg-gray-700 transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-md group"
            >
              <svg className="w-5 h-5 text-gray-200 group-hover:text-primary transition-colors" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-200 group-hover:text-white transition-colors">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn("azure")}
              className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl hover:bg-gray-700 transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-md group"
            >
              <svg className="w-5 h-5 text-gray-200 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0l9.1-16.2L3.5 0h8.2l8.2 24z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-200 group-hover:text-white transition-colors">Microsoft</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-800 text-gray-400 font-medium">{t('auth.login.orEmail', 'Or continue with email')}</span>
            </div>
          </div>

          {/* Form */}
          <form noValidate onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                {t('auth.login.emailAddress', 'Email address')} <span className="text-xs text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClassName}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                {t('auth.login.password', 'Password')} <span className="text-xs text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClassName} pr-12`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
              >
                {t('auth.login.forgotPassword', 'Forgot password?')}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-primary/90 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span>{loading ? t('app.common.loading') : t('auth.login.signInSecurely', 'Sign in securely')}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-700/50 p-3 rounded-lg border border-white/10">
              <Info className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{t('auth.login.sslNotice', 'Your connection is secured with 256-bit SSL encryption')}</span>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400">
            {t('auth.login.noAccount', "Don't have an account?")}{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline transition-colors">
              {t('auth.login.startTrial', 'Start your free trial')}
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
