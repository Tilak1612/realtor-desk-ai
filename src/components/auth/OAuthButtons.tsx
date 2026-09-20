import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GoogleIcon, MicrosoftIcon } from "./ProviderIcons";
import { setRememberMe } from "@/lib/auth/sessionPersistence";

/**
 * Continue with Google / Continue with Microsoft.
 *
 * Full width and stacked, replacing the half-width icon-and-word Google chip
 * that used to sit alone in a two-column grid with an empty second cell.
 *
 * MICROSOFT IS FEATURE-FLAGGED. `azure` is not enabled on the Supabase
 * project: signInWithOAuth would bounce the visitor to a Supabase error page
 * reading "Unsupported provider". Shipping a button that fails for everyone is
 * worse than not shipping it, so it renders only when
 * VITE_ENABLE_MICROSOFT_OAUTH is "true" -- flip that the moment the Entra app
 * and the Supabase provider are configured, no code change needed. If the flag
 * is turned on early, the disabled-provider error is caught and explained
 * instead of leaving the page.
 *
 * Redirects go to an ABSOLUTE url built from the current origin, so preview
 * and production each return to themselves, and both must be listed in the
 * Supabase redirect allowlist.
 */

const MICROSOFT_ENABLED = import.meta.env.VITE_ENABLE_MICROSOFT_OAUTH === "true";

type Provider = "google" | "azure";

export function OAuthButtons({
  remember = true,
  /** Where to land after the provider returns. Must be on the allowlist. */
  redirectPath = "/today",
  onBeforeRedirect,
}: {
  remember?: boolean;
  redirectPath?: string;
  onBeforeRedirect?: (provider: Provider) => void;
}) {
  const { t } = useTranslation();
  const [pending, setPending] = useState<Provider | null>(null);

  const start = async (provider: Provider) => {
    setPending(provider);
    // The provider round-trip leaves the page, so the choice has to be stored
    // before we go: the session is written on the way back.
    setRememberMe(remember);
    onBeforeRedirect?.(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`,
          // Microsoft needs offline_access to issue a refresh token; without
          // it the session cannot be renewed and the user is signed out when
          // the access token expires.
          ...(provider === "azure"
            ? { scopes: "openid profile email offline_access" }
            : {}),
        },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const notEnabled = /unsupported provider|provider is not enabled/i.test(message);
      toast.error(
        notEnabled
          ? t("auth.oauth.providerUnavailable", "That sign-in method is not available yet. Use your email and password.")
          : t("auth.oauth.failed", "Could not start sign-in with that provider. Please try again.")
      );
      setPending(null);
    }
  };

  const base =
    "w-full min-h-11 flex items-center justify-center gap-3 px-4 py-3 border border-rd-line rounded-xl bg-white text-sm font-medium text-rd-ink-800 hover:bg-rd-ink-50 hover:border-rd-line-strong transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500 focus-visible:ring-offset-2";

  return (
    <div className="space-y-3">
      <button type="button" onClick={() => start("google")} disabled={pending !== null} className={base}>
        {pending === "google" ? <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        <span>{t("auth.oauth.google", "Continue with Google")}</span>
      </button>

      {MICROSOFT_ENABLED && (
        <button type="button" onClick={() => start("azure")} disabled={pending !== null} className={base}>
          {pending === "azure" ? <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin" /> : <MicrosoftIcon />}
          <span>{t("auth.oauth.microsoft", "Continue with Microsoft")}</span>
        </button>
      )}
    </div>
  );
}

export default OAuthButtons;
