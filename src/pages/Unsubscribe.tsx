import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type State = "idle" | "verifying" | "success" | "error" | "linkRequested";

/**
 * CASL-compliant unsubscribe page.
 *
 * Two flows:
 * 1. Arrived via an email footer (has `?token=<signed>`): we call
 *    process-unsubscribe, which HMAC-verifies the token, enforces a
 *    30-day expiry, and opts the recipient out immediately.
 * 2. Arrived without a token (or with only `?email=`): we do NOT
 *    auto-opt-out — that would let anyone unsubscribe anyone by URL.
 *    We show a manual form that calls request-unsubscribe-link, which
 *    emails a signed confirmation link to the address. Response is
 *    always 200 so we don't leak whether the address is in our DB.
 */
const Unsubscribe = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const [errorReason, setErrorReason] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    if (!token) return; // no auto-submit without a signed token

    const run = async () => {
      setState("verifying");
      const { data, error } = await supabase.functions.invoke("process-unsubscribe", {
        body: { token },
      });
      const errKey = (data as { error?: string })?.error;
      if (error || errKey) {
        setErrorReason(errKey ?? error?.message ?? "unknown_error");
        setState("error");
        return;
      }
      setConfirmedEmail((data as { email?: string })?.email ?? null);
      setState("success");
    };
    run();
  }, [params]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("verifying");
    await supabase.functions.invoke("request-unsubscribe-link", {
      body: { email: email.trim().toLowerCase() },
    });
    // Endpoint is deliberately opaque (always 200) — treat the response as
    // always successful so we don't leak DB membership to probes.
    setState("linkRequested");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Transactional page with one-time tokens in the URL — must never
          be indexed. robots.txt blocks the path, this meta is the second
          layer for crawlers that ignore robots or follow inbound links. */}
      <SEO
        title="Unsubscribe | RealtorDesk AI"
        description="Unsubscribe from RealtorDesk AI emails."
        noindex
      />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold">
            {t("unsubscribe.title", "Unsubscribe from RealtorDesk AI emails")}
          </h1>

          {state === "verifying" && (
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
                <strong>{confirmedEmail ?? t("unsubscribe.thisAddress", "this address")}</strong>.
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
                {errorReason === "expired"
                  ? t(
                      "unsubscribe.errorExpired",
                      "This unsubscribe link has expired. Request a fresh one below."
                    )
                  : t(
                      "unsubscribe.errorInvalid",
                      "This unsubscribe link is invalid. Request a fresh one below."
                    )}
              </p>
              <ManualForm
                email={email}
                setEmail={setEmail}
                onSubmit={handleManualSubmit}
                t={tWrap(t)}
              />
            </div>
          )}

          {state === "linkRequested" && (
            <div className="space-y-3">
              <p className="text-foreground">
                {t(
                  "unsubscribe.linkSent",
                  "If this address is on our list, we just sent you a confirmation link. Click it to finish opting out."
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(
                  "unsubscribe.linkSentNote",
                  "Links expire in 30 days. Check your spam folder if you don't see it in a minute."
                )}
              </p>
            </div>
          )}

          {state === "idle" && (
            <ManualForm
              email={email}
              setEmail={setEmail}
              onSubmit={handleManualSubmit}
              t={tWrap(t)}
            />
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

interface ManualFormProps {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  t: (key: string, def?: string) => string;
}

// Wrapper to satisfy our simple t signature against i18next's TFunction overloads.
const tWrap = (tFn: ReturnType<typeof useTranslation>["t"]) =>
  (key: string, def?: string): string => (def !== undefined ? (tFn as any)(key, def) : (tFn as any)(key));

const ManualForm = ({ email, setEmail, onSubmit, t }: ManualFormProps) => (
  <form noValidate onSubmit={onSubmit} className="space-y-4 text-left">
    <p className="text-muted-foreground text-sm">
      {t(
        "unsubscribe.manualPrompt",
        "Enter the email address you want removed from our list. We will send you a one-click confirmation link."
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
      {t("unsubscribe.ctaSendLink", "Send me an unsubscribe link")}
    </Button>
    <p className="text-xs text-muted-foreground">
      {t("unsubscribe.casl", "Operated under CASL by Brainfy AI Inc. (RealtorDesk AI).")}
    </p>
  </form>
);

export default Unsubscribe;
