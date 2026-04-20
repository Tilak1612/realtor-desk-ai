import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type State = "idle" | "working" | "success" | "error" | "manual";

/**
 * CASL-compliant unsubscribe page.
 * - Clicked via signed token link from every system email: auto-opts-out immediately.
 * - Fallback: user types their email and submits (source = unsubscribe_link, same suppression row).
 * Either way writes to email_suppressions so every send-* edge function stops mailing that address.
 */
const Unsubscribe = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [processedEmail, setProcessedEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    const emailParam = params.get("email");

    if (!token && !emailParam) {
      setState("manual");
      return;
    }

    const run = async () => {
      setState("working");
      const { data, error } = await supabase.functions.invoke("process-unsubscribe", {
        body: token ? { token } : { email: emailParam },
      });
      if (error || (data && (data as { error?: string }).error)) {
        setErrorMsg((data as { error?: string })?.error ?? error?.message ?? "unknown_error");
        setState("error");
        return;
      }
      setProcessedEmail((data as { email?: string })?.email ?? emailParam ?? null);
      setState("success");
    };
    run();
  }, [params]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("working");
    const { data, error } = await supabase.functions.invoke("process-unsubscribe", {
      body: { email },
    });
    if (error || (data && (data as { error?: string }).error)) {
      setErrorMsg((data as { error?: string })?.error ?? error?.message ?? "unknown_error");
      setState("error");
      return;
    }
    setProcessedEmail(email);
    setState("success");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold">
            {t("unsubscribe.title", "Unsubscribe from RealtorDesk AI emails")}
          </h1>

          {state === "working" && (
            <p className="text-muted-foreground">
              {t("unsubscribe.working", "Processing your request…")}
            </p>
          )}

          {state === "success" && (
            <div className="space-y-3">
              <p className="text-foreground">
                {t(
                  "unsubscribe.success",
                  "You've been unsubscribed. We will not send further emails to"
                )}{" "}
                <strong>{processedEmail ?? t("unsubscribe.thisAddress", "this address")}</strong>.
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "unsubscribe.effectiveImmediate",
                  "Your opt-out is effective immediately per CASL §11."
                )}
              </p>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-3">
              <p className="text-destructive">
                {t(
                  "unsubscribe.error",
                  "We couldn't process your unsubscribe request automatically."
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "unsubscribe.fallback",
                  "Please email"
                )}{" "}
                <a
                  href="mailto:support@realtordesk.ai?subject=Unsubscribe"
                  className="text-primary underline"
                >
                  support@realtordesk.ai
                </a>{" "}
                {t(
                  "unsubscribe.fallback2",
                  "with the word 'unsubscribe' in the subject and we'll remove you within 10 business days."
                )}
              </p>
              {errorMsg && (
                <p className="text-xs text-muted-foreground">Reference: {errorMsg}</p>
              )}
            </div>
          )}

          {(state === "idle" || state === "manual") && (
            <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
              <p className="text-muted-foreground text-sm">
                {t(
                  "unsubscribe.manualPrompt",
                  "Enter the email address you want removed from our list."
                )}
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-border rounded-md bg-background"
              />
              <Button type="submit" className="w-full">
                {t("unsubscribe.cta", "Unsubscribe")}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t(
                  "unsubscribe.casl",
                  "Operated under CASL by Brainfy AI Inc. (RealtorDesk AI)."
                )}
              </p>
            </form>
          )}

          <Link to="/" className="inline-block text-sm text-primary hover:underline">
            ← {t("unsubscribe.back", "Back to RealtorDesk AI")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
