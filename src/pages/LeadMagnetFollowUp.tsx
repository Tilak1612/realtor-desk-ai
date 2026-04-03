import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/utils/analytics";
import { CheckCircle, Clock, FileText, Calculator } from "lucide-react";

const LEAD_MAGNET_SOURCE = "slow-follow-up-calculator-campaign-01";

const LeadMagnetFollowUp = () => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — hidden from real users
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setIsSubmitting(true);
    try {
      // 1. Store in email_captures
      const { error: captureError } = await supabase
        .from("email_captures")
        .insert({ email, source: LEAD_MAGNET_SOURCE, status: "active" });

      // Ignore duplicate email errors (unique constraint) so the email still sends
      if (captureError && !captureError.message.includes("duplicate")) {
        throw captureError;
      }

      // 2. Send delivery email via edge function (website field is honeypot)
      const { error: fnError } = await supabase.functions.invoke(
        "send-lead-magnet-email",
        { body: { firstName, email, website } }
      );

      if (fnError) throw fnError;

      trackEvent("lead_magnet_signup", { source: LEAD_MAGNET_SOURCE });
      setSubmitted(true);
    } catch (err) {
      console.error("Lead magnet submission error:", err);
      toast({
        title: "Something went wrong",
        description:
          "We couldn't process your request. Please try again or email support@realtordesk.ai.",
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Free: Slow Follow-Up Calculator + 5 Scripts for Canadian Realtors"
        description="Find out how much slow lead response is costing you in lost GCI — then get 5 done-for-you follow-up scripts written for Canadian real estate agents."
        keywords="real estate follow up scripts Canada, lead response time calculator, slow follow up cost realtor, Canadian real estate lead scripts"
        canonicalUrl="https://www.realtordesk.ai/resources/slow-follow-up-calculator-canadian-realtors"
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-5xl">

            {/* ── Hero ── */}
            <div className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
                Free Download — Canadian Agents Only
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                How Much Is Slow Follow-Up
                <br className="hidden md:block" /> Costing You?
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A 5-minute GCI loss calculator + 5 done-for-you response scripts for
                Canadian real estate agents. Copy, paste, send.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-start">

              {/* ── Left: What's inside ── */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    What you'll walk away with:
                  </h2>
                  <ul className="space-y-4">
                    {[
                      {
                        icon: <Calculator className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
                        title: "Your annual GCI loss estimate",
                        body: "A simple 4-input calculator that shows exactly how much slow response time is costing you in real dollars — most agents land between $30K–$120K/year.",
                      },
                      {
                        icon: <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
                        title: "The 5 highest-impact follow-up windows",
                        body: "Showings, overnight leads, long weekends, back-to-back days, and offer nights — know exactly when you're most vulnerable and what to send.",
                      },
                      {
                        icon: <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
                        title: "5 copy-paste response scripts",
                        body: "Written for Canadian buyers and sellers. Immediate auto-reply, overnight leads, 48-hour follow-up, and re-engagement — ready to use today.",
                      },
                      {
                        icon: <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
                        title: "A 3-step coverage framework",
                        body: "Not just what to send — a simple system you can set up this week to close the coverage gap, with or without an AI CRM.",
                      },
                    ].map(({ icon, title, body }) => (
                      <li key={title} className="flex gap-3">
                        {icon}
                        <div>
                          <p className="font-semibold text-foreground text-sm">{title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social proof */}
                <div className="rounded-xl bg-muted/50 p-5 border">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "The first agent to respond wins. Not the best agent — the fastest.
                    RealtorDesk AI makes sure that's always you."
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 font-medium">
                    — RealtorDesk AI | Built for Canadian Real Estate Agents
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Already using RealtorDesk?{" "}
                  <Link to="/dashboard" className="text-primary hover:underline">
                    Go to your dashboard →
                  </Link>
                </p>
              </div>

              {/* ── Right: Opt-in form or success state ── */}
              <div className="rounded-2xl border bg-card p-8 shadow-sm">
                {submitted ? (
                  <SuccessState firstName={firstName} />
                ) : (
                  <OptInForm
                    firstName={firstName}
                    email={email}
                    website={website}
                    isSubmitting={isSubmitting}
                    onFirstNameChange={setFirstName}
                    onEmailChange={setEmail}
                    onWebsiteChange={setWebsite}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>

            {/* ── Bottom CTA strip ── */}
            <div className="mt-16 rounded-xl bg-gradient-to-r from-primary to-primary/80 p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">
                Ready to stop losing leads to faster agents?
              </h2>
              <p className="text-white/85 mb-6 max-w-xl mx-auto">
                RealtorDesk AI responds to every lead in seconds — CREA DDF integrated,
                PIPEDA compliant, bilingual. Starting at $149/month CAD.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  Start your 14-day free trial
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center border border-white/40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Book a demo
                </Link>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

interface OptInFormProps {
  firstName: string;
  email: string;
  website: string;
  isSubmitting: boolean;
  onFirstNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onWebsiteChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const OptInForm = ({
  firstName,
  email,
  website,
  isSubmitting,
  onFirstNameChange,
  onEmailChange,
  onWebsiteChange,
  onSubmit,
}: OptInFormProps) => (
  <form onSubmit={onSubmit} className="space-y-5">
    {/* Honeypot — hidden from real users, bots fill it, edge function rejects non-empty */}
    <input
      type="text"
      name="website"
      value={website}
      onChange={(e) => onWebsiteChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
    />
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-1">
        Send me the calculator + scripts
      </h2>
      <p className="text-sm text-muted-foreground">
        For Canadian real estate agents. No spam — unsubscribe any time.
      </p>
    </div>

    <div className="space-y-1.5">
      <Label htmlFor="firstName">First name</Label>
      <Input
        id="firstName"
        type="text"
        placeholder="Alex"
        value={firstName}
        onChange={(e) => onFirstNameChange(e.target.value)}
        required
        minLength={2}
        maxLength={50}
        autoComplete="given-name"
      />
    </div>

    <div className="space-y-1.5">
      <Label htmlFor="email">Email address</Label>
      <Input
        id="email"
        type="email"
        placeholder="alex@yourbrokerage.ca"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        maxLength={255}
        autoComplete="email"
      />
    </div>

    <Button
      type="submit"
      className="w-full"
      size="lg"
      disabled={isSubmitting || !firstName || !email}
    >
      {isSubmitting ? "Sending…" : "Send me the calculator + scripts"}
    </Button>

    <p className="text-xs text-center text-muted-foreground">
      No spam. For Canadian real estate agents only. Unsubscribe any time.
    </p>
  </form>
);

const SuccessState = ({ firstName }: { firstName: string }) => (
  <div className="text-center space-y-4 py-4">
    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
      <CheckCircle className="w-7 h-7 text-green-600" />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-1">
        Check your inbox, {firstName}.
      </h2>
      <p className="text-muted-foreground text-sm">
        The calculator and scripts are on their way from{" "}
        <span className="font-medium">support@realtordesk.ai</span>.
        Check your spam folder if it doesn't arrive within 2 minutes.
      </p>
    </div>
    <div className="pt-2 space-y-3">
      <p className="text-sm font-medium text-foreground">
        While you wait — see 24/7 AI follow-up in action:
      </p>
      <Link
        to="/signup"
        className="block w-full text-center bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        Start your 14-day free trial
      </Link>
      <Link
        to="/demo"
        className="block w-full text-center border border-border text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-muted transition-colors"
      >
        Book a demo instead
      </Link>
    </div>
  </div>
);

export default LeadMagnetFollowUp;
