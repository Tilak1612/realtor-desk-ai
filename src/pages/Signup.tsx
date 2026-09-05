import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput, validatePassword } from "@/components/ui/password-input";
import { emailLocalPart } from "@/lib/auth/commonPasswords";
import { Mail, User, Building2, ArrowRight, Info, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { trackEvent } from "@/utils/analytics";
import { SEO } from "@/components/SEO";
import SignupAside from "@/components/auth/SignupAside";
import BillingDisclosure from "@/components/auth/BillingDisclosure";
import { TRIAL_PERIOD_DAYS } from "@/config/billing";
import ContinueConsentNotice from "@/components/auth/ContinueConsentNotice";
import { buildConsentRecord } from "@/config/legal";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signupSchema = z.object({
    email: z.string().email(t('app.validation.email')),
    password: z.string().refine((val) => validatePassword(val), {
      message: t('app.auth.passwordRequirements.notMet', 'Password does not meet all requirements'),
    }),
    fullName: z.string().min(2, t('app.validation.minLength', { min: 2 })),
    // Optional on purpose. Brokerage and phone are captured in onboarding,
    // where the user has already committed; blocking signup on them cost a
    // required field for data we get anyway one screen later.
    phone: z.string().optional(),
    companyName: z.string().optional(),
    // Terms acceptance is now the inline "By continuing..." notice under the
    // CTA (sign-in-wrap), recorded via buildConsentRecord() rather than a tick
    // box. marketingConsent stays an explicit, unchecked opt-in: CASL requires
    // express consent for commercial electronic messages and passive
    // "by continuing" consent does not satisfy it.
    marketingConsent: z.boolean().optional(),
  }).superRefine((data, ctx) => {
    // Checked at the object level because it needs a sibling field. A password
    // built from the user's own email is the commonest guessable choice and no
    // generic denylist can see it -- only this form knows the address.
    if (data.password && !validatePassword(data.password, emailLocalPart(data.email))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: t(
          'app.auth.passwordRequirements.tooSimilar',
          'Password must not contain your name or email address'
        ),
      });
    }
  });

  type SignupForm = z.infer<typeof signupSchema>;

  const [formData, setFormData] = useState<Partial<SignupForm>>({
    marketingConsent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Announced to assistive tech on validation failure, submission, and error.
  const [statusMessage, setStatusMessage] = useState("");

  // SEO is handled by <SEO /> in JSX below so <title>/<meta> update on
  // locale change (previously hardcoded EN via document.title side-effect).

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

  // Azure/Microsoft is NOT enabled on the Supabase project, so the button
// that called this only ever produced a Supabase error page. Re-add it
// here and in the UI together once the provider is actually enabled.
  const handleOAuthSignIn = async (provider: "google") => {
    try {
      const method = provider === "google" ? "google" : "microsoft";
      sessionStorage.setItem("ga_pending_signup_method", method);
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
      sessionStorage.removeItem("ga_pending_signup_method");
      toast.error(error.message || t('app.notifications.errorOccurred'));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guard against double submission: a second click before the request
    // settles would create a duplicate account attempt.
    if (loading) return;

    if (!validateForm()) {
      setStatusMessage(t('auth.signup.status.invalid', 'Please fix the errors below and try again.'));
      return;
    }

    setSubmitError(null);
    setStatusMessage(t('auth.signup.status.creating', 'Creating your account…'));
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
            // Audit trail for the inline consent notice: which versions of the
            // Terms and Privacy Policy were live at acceptance, and when.
            ...buildConsentRecord(formData.marketingConsent === true),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        trackEvent("sign_up", { method: "email" });
        trackEvent("trial_start", { method: "email" });
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Welcome email is sent after onboarding completes (Onboarding.tsx handleComplete)
        // to avoid sending it before the user has verified their email.

        // Route on what actually came back. When email confirmation is
        // required Supabase returns no session and /verify-email is correct.
        // When the project auto-confirms, a session IS returned and sending
        // the user to /verify-email stranded them on a dead end waiting for
        // mail that will never arrive.
        if (data.session) {
          navigate("/onboarding", { replace: true });
        } else {
          toast.success(t('app.auth.verifyEmail'), {
            description: t('app.auth.checkYourEmail'),
            duration: 6000,
          });
          navigate("/verify-email", {
            state: { email: formData.email, userId: data.user.id },
          });
        }
      }
    } catch (error: any) {
      // Every entered value is preserved: formData is untouched on failure,
      // so the user never retypes the form because the network blipped.
      const message = error?.message || t('app.notifications.errorOccurred');
      setSubmitError(message);
      setStatusMessage(t('auth.signup.status.failed', 'We could not create your account. {{message}}', { message }));
      toast.error(t('app.common.error'), { description: message, duration: 6000 });
    } finally {
      setLoading(false);
    }
  };


  // Reserves one line of vertical space whether or not an error is showing,
  // so validation never shifts the layout under the user's cursor.
  const FieldError = ({ id, message }: { id: string; message?: string }) => (
    <p id={id} className="min-h-[18px] text-sm leading-[18px] text-red-300" aria-live="polite">
      {message ?? ""}
    </p>
  );

  const inputClassName = "w-full px-4 py-3 pl-12 border border-rd-line rounded-xl bg-white text-rd-ink-900 placeholder-rd-ink-400 focus:ring-2 focus:ring-rd-navy-500 focus:border-transparent transition-all duration-200 hover:border-rd-line-strong";

  return (
    <AuthLayout aside={<SignupAside />}>
      <SEO
        title={t("pageSeo.signupTitle")}
        description={t("pageSeo.signupDesc")}
        noindex
      />
      <AuthCard
        title="Realtor Desk"
        subtitle={t('auth.signup.subtitle', 'Start your {{days}}-day free trial. A card is required; cancel anytime before it ends and you are not charged.', { days: TRIAL_PERIOD_DAYS })}
      >
        <div className="space-y-6">
          {/* OAuth Buttons */}
          {/* Full width so it lines up with the inputs below. It used to sit
              in a 2-col grid with one child — half width, left aligned. */}
          <div>
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="w-full min-h-[44px] flex items-center justify-center px-4 py-3 border border-rd-line rounded-xl bg-white hover:bg-rd-ink-50 transition-all duration-200 hover:border-rd-line-strong hover:shadow-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500"
            >
              <svg className="w-5 h-5 text-rd-ink-600 group-hover:text-rd-ink-900 transition-colors" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-rd-ink-700 group-hover:text-rd-ink-900 transition-colors">{t('auth.signup.continueGoogle', 'Continue with Google')}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-rd-line" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-rd-ink-500 font-medium">{t('auth.signup.orEmail', 'Or register with email')}</span>
            </div>
          </div>

          {/* Form */}
          <form noValidate onSubmit={handleSignup} className="space-y-4">
            {/* Identity before credentials: asking who you are, then how to
                reach you, then a password, reads as an introduction. The old
                order (email, password, confirm, name) read as paperwork. */}

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium text-rd-ink-800">
                {t('app.settings.fullName')} <span aria-hidden="true" className="text-red-300">*</span>
                <span className="sr-only">{t('app.validation.requiredField', '(required)')}</span>
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.fullName}
                  aria-describedby="fullName-error"
                  placeholder={t('auth.signup.ph.name', 'Jane Tremblay')}
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={inputClassName}
                />
                <User aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rd-ink-400" />
              </div>
              <FieldError id="fullName-error" message={errors.fullName} />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-rd-ink-800">
                {t('app.auth.email')} <span aria-hidden="true" className="text-red-300">*</span>
                <span className="sr-only">{t('app.validation.requiredField', '(required)')}</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  placeholder={t('auth.signup.ph.email', 'you@brokerage.ca')}
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClassName}
                />
                <Mail aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rd-ink-400" />
              </div>
              <FieldError id="email-error" message={errors.email} />
            </div>

            {/* Password. Confirm-password is gone: the show/hide toggle plus
                live criteria is the current standard and removes a field. */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-rd-ink-800">
                {t('app.auth.password')} <span aria-hidden="true" className="text-red-300">*</span>
                <span className="sr-only">{t('app.validation.requiredField', '(required)')}</span>
              </Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                required
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                placeholder="••••••••"
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                showValidation={true}
                disallowList={emailLocalPart(formData.email)}
                className="bg-white border-rd-line text-rd-ink-900 placeholder-rd-ink-400 focus:ring-rd-navy-500"
              />
              <PasswordStrengthMeter password={formData.password || ""} />
              <FieldError id="password-error" message={errors.password} />
            </div>

            {/* Optional group — visibly separated so it reads as skippable.
                Neither field blocks submission; both are collected again in
                onboarding if left blank. */}
            <fieldset className="space-y-3 rounded-xl border border-rd-line bg-rd-paper-2 p-3.5">
              <legend className="px-1 text-xs font-semibold uppercase tracking-[0.08em] text-rd-ink-500">
                {t('auth.signup.optionalGroup', 'Optional — you can add these later')}
              </legend>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-rd-ink-800">
                  {t('app.contacts.phone')}
                </Label>
                <PhoneInput
                  id="phone"
                  autoComplete="tel"
                  placeholder={t('auth.signup.ph.phone', '(604) 555-0123')}
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 pl-12 border border-rd-line rounded-xl bg-white text-rd-ink-900 placeholder-rd-ink-400 focus:ring-2 focus:ring-rd-navy-500 focus:border-transparent transition-all duration-200 hover:border-rd-line-strong"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-sm font-medium text-rd-ink-800">
                  {t('app.settings.company')}
                </Label>
                <div className="relative">
                  <Input
                    id="companyName"
                    name="companyName"
                    autoComplete="organization"
                    placeholder={t('auth.signup.ph.company', 'Your brokerage')}
                    value={formData.companyName || ""}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className={inputClassName}
                  />
                  <Building2 aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rd-ink-400" />
                </div>
              </div>
            </fieldset>

            {/* Marketing consent — separate, unchecked, purpose-specific.
                Terms acceptance is the inline notice under the CTA. */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, marketingConsent: checked as boolean })}
                  className="mt-0.5 border-rd-line-strong data-[state=checked]:bg-rd-terra-600 data-[state=checked]:border-rd-terra-600 focus-visible:ring-rd-navy-500"
                />
                {/* CASL express consent + Law 25: separate, unbundled, never
                    pre-checked, and labelled with its actual purpose. */}
                <label htmlFor="marketingConsent" className="text-sm text-rd-ink-700 leading-relaxed cursor-pointer">
                  {t('auth.signup.marketingConsent', 'Email me product updates and Canadian real estate tips. You can unsubscribe anytime.')}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            {submitError && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200"
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full min-h-[48px] bg-rd-navy-800 text-white py-3 px-4 rounded-full font-semibold hover:bg-rd-navy-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500 focus-visible:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />
                  <span>{t('auth.signup.cta.loading', 'Creating your account…')}</span>
                </>
              ) : (
                <>
                  <span>{t('auth.signup.cta.default', 'Start my {{days}}-day free trial', { days: TRIAL_PERIOD_DAYS })}</span>
                  <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </>
              )}
            </button>

            <ContinueConsentNotice />

            {/* Every figure derived, none hardcoded in markup. */}
            <BillingDisclosure />

            {/* Single polite live region for validation + submission state. */}
            <p aria-live="polite" role="status" className="sr-only">{statusMessage}</p>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-rd-ink-700 bg-rd-navy-50 p-3 rounded-lg border border-rd-navy-200">
              <Info aria-hidden="true" className="w-4 h-4 text-rd-navy-600 flex-shrink-0" />
              <span>{t('auth.signup.sslNote', 'Your data is stored securely on Canadian servers with 256-bit SSL encryption')}</span>
            </div>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-rd-ink-600">
            {t('app.auth.alreadyHaveAccount')}{" "}
            <Link to="/login" className="text-rd-navy-700 font-semibold underline underline-offset-2 hover:text-rd-navy-800 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500">
              {t('app.auth.signIn')}
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Signup;
