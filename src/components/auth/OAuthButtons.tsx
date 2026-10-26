import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppleIcon, GoogleIcon, MicrosoftIcon } from "./ProviderIcons";
import { setRememberMe } from "@/lib/auth/sessionPersistence";
import { authLinkOrigin, isNativeApp } from "@/lib/native/platform";
import { oauthOffer, startNativeOAuth, type OAuthProvider } from "@/lib/native/auth/oauth";
import "@/i18n/nativeAuth";

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
 *
 * INSIDE THE iOS / ANDROID APP this component renders nothing by default: the
 * app signs in with email and password. Google refuses to run in an embedded
 * webview, and Apple requires Sign in with Apple wherever a third-party login
 * is offered on iOS, which this project has not set up. The native flow
 * (system browser out, deep link back) is implemented and switched on by build
 * flags; see lib/native/auth/oauth.ts for the flags and the reasoning. Nothing
 * about the web path changes: oauthOffer() always answers "Google, and
 * Microsoft if its flag is on" in a browser.
 */

const MICROSOFT_ENABLED = import.meta.env.VITE_ENABLE_MICROSOFT_OAUTH === "true";

type Provider = OAuthProvider;

// Microsoft needs offline_access to issue a refresh token; without it the
// session cannot be renewed and the user is signed out when the access token
// expires.
const AZURE_SCOPES = "openid profile email offline_access";

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
  const native = isNativeApp();
  const offer = oauthOffer();

  const start = async (provider: Provider) => {
    setPending(provider);
    // The provider round-trip leaves the page, so the choice has to be stored
    // before we go: the session is written on the way back.
    setRememberMe(remember);
    onBeforeRedirect?.(provider);
    try {
      if (native) {
        // The app never navigates its own webview to the provider. It opens
        // the system browser and the session comes back through a deep link
        // (lib/native/auth/deepLinks.ts), which also decides where to land.
        // If the person closes the browser without finishing, stop spinning.
        await startNativeOAuth(provider, {
          scopes: provider === "azure" ? AZURE_SCOPES : undefined,
          onDismissed: () => setPending(null),
        });
        return;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${authLinkOrigin()}${redirectPath}`,
          ...(provider === "azure" ? { scopes: AZURE_SCOPES } : {}),
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
  // Same geometry, Apple's colours: its guidelines allow the button in black
  // or white only, with the mark in the opposite colour.
  const appleButton =
    "w-full min-h-11 flex items-center justify-center gap-3 px-4 py-3 border border-black rounded-xl bg-black text-sm font-medium text-white hover:bg-rd-ink-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500 focus-visible:ring-offset-2";

  // Nothing to offer (the app, with provider sign-in switched off). Callers
  // that draw a divider around this component ask oauthOffer() themselves.
  if (!offer.thirdParty && !offer.apple) return null;

  return (
    <div className="space-y-3">
      {/* First, as Apple's guidelines ask where it is offered alongside other
          providers. Only ever rendered in the app, and only with its flag. */}
      {offer.apple && (
        <button
          type="button"
          onClick={() => start("apple")}
          disabled={pending !== null}
          className={appleButton}
        >
          {pending === "apple" ? <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin" /> : <AppleIcon />}
          <span>{t("nativeAuth.login.apple", "Continue with Apple")}</span>
        </button>
      )}

      {offer.thirdParty && (
      <button type="button" onClick={() => start("google")} disabled={pending !== null} className={base}>
        {pending === "google" ? <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        <span>{t("auth.oauth.google", "Continue with Google")}</span>
      </button>
      )}

      {offer.thirdParty && MICROSOFT_ENABLED && (
        <button type="button" onClick={() => start("azure")} disabled={pending !== null} className={base}>
          {pending === "azure" ? <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin" /> : <MicrosoftIcon />}
          <span>{t("auth.oauth.microsoft", "Continue with Microsoft")}</span>
        </button>
      )}
    </div>
  );
}

export default OAuthButtons;
