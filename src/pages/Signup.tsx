import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Link as RouterLink } from "react-router-dom";
import { PasswordInput, validatePassword } from "@/components/ui/password-input";
import { Mail, User, Building2, ArrowRight, Info } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { trackEvent } from "@/utils/analytics";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const flushAnalytics = () => new Promise((resolve) => setTimeout(resolve, 150));

  const signupSchema = z.object({
    email: z.string().email(t('app.validation.email')),
    password: z.string().refine((val) => validatePassword(val), {
      message: t('app.auth.passwordRequirements.notMet', 'Password does not meet all requirements'),
    }),
    fullName: z.string().min(2, t('app.validation.minLength', { min: 2 })),
    phone: z.string().optional(),
    companyName: z.string().min(2, t('app.validation.minLength', { min: 2 })),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: t('app.validation.required'),
    }),
    marketingConsent: z.boolean().optional(),
  });

  type SignupForm = z.infer<typeof signupSchema>;

  const [formData, setFormData] = useState<Partial<SignupForm>>({
    privacyConsent: false,
    marketingConsent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});

  // SEO: Update document title and meta for signup page
  if (typeof document !== 'undefined') {
    document.title = "Start 14-Day Free Trial | Best CRM for Real Estate Agents | RealtorDesk AI";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Start your 14-day free trial of the best CRM for real estate agents. AI lead generation software, 24/7 chatbot, virtual tour integration. No credit card required.');
    }
  }

  const validateForm = () => {
    try {
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignupForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof SignupForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "azure") => {
    try {
      const method = provider === "google" ? "google" : "microsoft";
      sessionStorage.setItem("ga_pending_signup_method", method);
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      sessionStorage.removeItem("ga_pending_signup_method");
      toast.error(error.message || t('app.notifications.errorOccurred'));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { data, error } = await supabase.auth.signUp({
        email: formData.email!,
        password: formData.password!,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            company_name: formData.companyName,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      if (data.user) {
        trackEvent("sign_up", { method: "email" });
        trackEvent("trial_start", { method: "email" });
        await new Promise((resolve) => setTimeout(resolve, 300));

        toast.success(t('app.auth.verifyEmail'), {
          description: t('app.auth.checkYourEmail'),
          duration: 6000,
        });
        
        navigate("/verify-email", { 
          state: { 
            email: formData.email,
            userId: data.user.id 
          } 
        });
      }
    } catch (error: any) {
      console.error("Signup exception:", error);
      toast.error(t('app.common.error'), {
        description: error.message || t('app.notifications.errorOccurred'),
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full px-4 py-3 pl-12 border border-white/10 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-gray-600 transition-all duration-300 hover:border-white/20";

  return (
    <AuthLayout>
      <AuthCard
        title="RealtorDesk AI"
        subtitle="Start your 14-day free trial"
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
              <span className="px-3 bg-gray-800 text-gray-400 font-medium">Or register with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                {t('app.auth.email')} <span className="text-xs text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClassName}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                {t('app.auth.password')} <span className="text-xs text-red-400">*</span>
              </Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                showValidation={true}
                onValidationChange={setIsPasswordValid}
                className="bg-gray-700 border-white/10 text-white placeholder-gray-400 focus:ring-primary focus:bg-gray-600"
              />
              <PasswordStrengthMeter password={formData.password || ""} />
              {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                {t('app.settings.fullName')} <span className="text-xs text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={inputClassName}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.fullName && <p className="text-sm text-red-400">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-200">
                {t('app.contacts.phone')}
              </Label>
              <PhoneInput
                id="phone"
                placeholder="(555) 123-4567"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 pl-12 border border-white/10 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-gray-600 transition-all duration-300 hover:border-white/20"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                {t('app.settings.company')} <span className="text-xs text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="companyName"
                  placeholder="Your Brokerage"
                  value={formData.companyName || ""}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={inputClassName}
                />
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.companyName && <p className="text-sm text-red-400">{errors.companyName}</p>}
            </div>

            {/* PIPEDA Consent */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacyConsent"
                  checked={formData.privacyConsent || false}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, privacyConsent: checked as boolean });
                    if (checked) {
                      setErrors({ ...errors, privacyConsent: undefined });
                    }
                  }}
                  className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="privacyConsent" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <RouterLink to="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </RouterLink>{" "}
                  &{" "}
                  <RouterLink to="/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </RouterLink>
                  {" "}*
                </label>
              </div>
              {errors.privacyConsent && <p className="text-sm text-red-400 ml-7">{errors.privacyConsent}</p>}

              <div className="flex items-start gap-3">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, marketingConsent: checked as boolean })}
                  className="mt-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="marketingConsent" className="text-sm text-gray-300 cursor-pointer">
                  Send me tips & product updates (optional)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-primary/90 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span>{loading ? t('app.common.loading') : t('app.auth.createAccount')}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-700/50 p-3 rounded-lg border border-white/10">
              <Info className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Your data is stored securely on Canadian servers with 256-bit SSL encryption</span>
            </div>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-400">
            {t('app.auth.alreadyHaveAccount')}{" "}
            <Link to="/login" className="text-primary font-medium hover:underline transition-colors">
              {t('app.auth.signIn')}
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Signup;
