import { useState } from "react";
import { useFormAnalytics } from "@/hooks/useFormAnalytics";
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
import OAuthButtons from "@/components/auth/OAuthButtons";
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

  const { onStart, onSubmitted } = useFormAnalytics("signup");


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
        onSubmitted();
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
    <p id={id} className="min-h-[18px] text-sm leading-[18px] text-red-700" aria-live="polite">
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
          {/* Shared with /login so both pages offer the same providers and
              the same wording. Microsoft appears once the provider is
              enabled; see OAuthButtons. */}
          <OAuthButtons
            redirectPath="/today"
            onBeforeRedirect={(provider) =>
              sessionStorage.setItem(
                "ga_pending_signup_method",
                provider === "azure" ? "microsoft" : "google"
              )
            }
          />

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
          <form noValidate onFocusCapture={onStart} onSubmit={handleSignup} className="space-y-4">
            {/* Identity before credentials: asking who you are, then how to
                reach you, then a password, reads as an introduction. The old
                order (email, password, confirm, name) read as paperwork. */}

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium text-rd-ink-800">
                {t('app.settings.fullName')} <span aria-hidden="true" className="text-red-700">*</span>
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
                {t('app.auth.email')} <span aria-hidden="true" className="text-red-700">*</span>
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
                {t('app.auth.password')} <span aria-hidden="true" className="text-red-700">*</span>
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
              <legend className="px-1 text-xs font-semibold uppercase tracking-[0.08em] text-rd-ink-600">
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
                // Was text-red-200 on bg-red-500/10 -- a dark-theme banner left
                // behind by the light-theme migration. Measured 1.27:1 over the
                // paper ground: the signup failure message was effectively
                // invisible. This pairing measures 7.6:1.
                className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800"
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
