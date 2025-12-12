import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Link as RouterLink } from "react-router-dom";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signupSchema = z.object({
    email: z.string().email(t('app.validation.email')),
    password: z.string().min(8, t('app.auth.passwordMinLength')),
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
      const redirectUrl = `${window.location.origin}/`;
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
        console.log("User created successfully:", data.user);
        
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">
              {t('app.auth.createAccount')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('hero.trustLine')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("google")}
              >
                {t('app.auth.signIn')} Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("azure")}
              >
                {t('app.auth.signIn')} Microsoft
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('demo.form.orStart')} {t('app.auth.email').toLowerCase()}
                </span>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('app.auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('app.auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">{t('app.settings.fullName')}</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('app.contacts.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">{t('app.settings.company')}</Label>
                <Input
                  id="companyName"
                  placeholder="Your Brokerage"
                  value={formData.companyName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName}</p>
                )}
              </div>

              {/* PIPEDA Compliance - Privacy Consent */}
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
                    className="mt-1"
                  />
                  <label
                    htmlFor="privacyConsent"
                    className="text-sm font-medium leading-relaxed cursor-pointer block flex-1"
                  >
                    {t('footer.privacy')}{" "}
                    <RouterLink to="/privacy-policy" className="text-primary underline">
                      {t('footer.privacy')}
                    </RouterLink>{" "}
                    &{" "}
                    <RouterLink to="/terms-of-service" className="text-primary underline">
                      {t('footer.terms')}
                    </RouterLink>
                    {" "}*
                  </label>
                </div>
                {errors.privacyConsent && (
                  <p className="text-sm text-destructive ml-7">{errors.privacyConsent}</p>
                )}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="marketingConsent"
                    checked={formData.marketingConsent || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, marketingConsent: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor="marketingConsent"
                      className="text-sm font-medium leading-relaxed cursor-pointer block"
                    >
                      {t('app.common.optional')}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      PIPEDA
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? t('app.common.loading') : t('app.auth.createAccount')}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {t('app.auth.alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('app.auth.signIn')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
