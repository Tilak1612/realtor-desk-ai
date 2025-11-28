import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address (e.g., you@example.com)"),
  password: z.string().min(8, "Please create a password with at least 8 characters for security"),
  fullName: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  phone: z.string().optional(),
  companyName: z.string().min(2, "Please enter your company or brokerage name"),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Please accept the Privacy Policy and Terms of Service to continue",
  }),
  marketingConsent: z.boolean().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SignupForm>>({
    privacyConsent: false,
    marketingConsent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});

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
      toast.error(error.message || "Failed to sign in with OAuth");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form data:", formData);
    
    if (!validateForm()) {
      console.log("Validation failed");
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
        
        toast.success("Account Created! Please verify your email.", {
          description: "Check your email for a verification link.",
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
      toast.error("Unable to Create Account", {
        description: error.message || "There was an error creating your account. Please try again or contact support.",
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
              Create your account
            </CardTitle>
            <CardDescription className="text-center">
              Start your 14-day free trial today - no credit card required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("google")}
              >
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("azure")}
              >
                Continue with Microsoft
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="fullName">Full Name</Label>
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
                <Label htmlFor="phone">Phone</Label>
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
                <Label htmlFor="companyName">Company Name</Label>
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
                      // Clear the error when checkbox is checked
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
                    I agree to the{" "}
                    <RouterLink to="/privacy-policy" className="text-primary underline">
                      Privacy Policy
                    </RouterLink>{" "}
                    and{" "}
                    <RouterLink to="/terms-of-service" className="text-primary underline">
                      Terms of Service
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
                      I consent to receive marketing communications and updates (Optional)
                    </label>
                    <p className="text-xs text-muted-foreground">
                      You can unsubscribe at any time as per PIPEDA regulations
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
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
