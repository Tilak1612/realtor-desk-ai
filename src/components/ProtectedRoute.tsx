import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/rd";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import MfaChallenge from "@/components/auth/MfaChallenge";
import { noteSessionEnded } from "@/lib/auth/signOut";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

type Status = "loading" | "authenticated" | "unauthenticated" | "mfa-required";

/**
 * Wraps authenticated app routes. Redirects to /login if no active session.
 * Does not check onboarding_completed — individual pages handle that redirect
 * so they can resume at the correct step.
 *
 * SECOND FACTOR. A session can exist and still not be good enough. Supabase
 * issues AAL1 from a password or an OAuth return; a user with a verified TOTP
 * factor only reaches AAL2 after entering a code. Nothing used to check, so
 * enrolling an authenticator changed nothing about how the account was
 * protected. The gate lives here rather than in the login form because every
 * protected route passes through it -- a restored session in a new tab and a
 * deep link into /app/leads are checked the same way a fresh sign-in is.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>("loading");

  const resolve = useCallback(async (hasSession: boolean) => {
    if (!hasSession) {
      setStatus("unauthenticated");
      return;
    }
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    // Fail OPEN on an error here, deliberately: this call needs the network,
    // and a blip must not lock out every user of the app. It fails CLOSED for
    // the case that matters -- a known aal2 requirement that is unmet.
    if (error) {
      setStatus("authenticated");
      return;
    }
    const needsSecondFactor =
      data?.nextLevel === "aal2" && data?.currentLevel !== "aal2";
    setStatus(needsSecondFactor ? "mfa-required" : "authenticated");
  }, []);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) void resolve(!!session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      // MFA_CHALLENGE_VERIFIED raises the assurance level in place, so
      // re-resolve rather than assuming the old answer still holds.
      void resolve(!!session);
      if (event === "SIGNED_OUT") {
        // Distinguishes an expiry from a deliberate sign-out, so /login can
        // say which happened instead of silently showing the form again.
        noteSessionEnded();
        setStatus("unauthenticated");
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [resolve]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner label="Checking your session" showLabel />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "mfa-required") {
    return (
      <AuthLayout>
        <AuthCard
          title="Realtor Desk"
          subtitle={t("auth.mfa.title", "Two-step verification")}
        >
          <MfaChallenge onVerified={() => setStatus("authenticated")} />
        </AuthCard>
      </AuthLayout>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
