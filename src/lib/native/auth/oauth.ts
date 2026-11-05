/**
 * Provider sign-in ("Continue with Google") inside the iOS / Android app.
 *
 * OFF BY DEFAULT, and the reasons are policy, not engineering:
 *
 *   - Google blocks its sign-in page inside embedded webviews
 *     ("disallowed_useragent"). It has to run in the system browser and come
 *     back through a deep link, which needs the app's URL scheme on the
 *     Supabase redirect allow-list. Until the owner adds that entry the round
 *     trip ends on an error page.
 *   - Apple requires an app that offers a third-party login on iOS to also
 *     offer an equivalent privacy-preserving one (App Store guideline 4.8),
 *     which in practice means Sign in with Apple. It is not configured on this
 *     project.
 *
 * So the app signs in with email and password (plus the existing TOTP
 * challenge), and the buttons are not rendered. The complete flow is written
 * and tested here so that turning it on is a build flag and two pieces of
 * console setup, not new code:
 *
 *   VITE_NATIVE_OAUTH=true          offer providers in the app (Android)
 *   VITE_NATIVE_APPLE_SIGNIN=true   also required before anything shows on iOS,
 *                                   and adds the "Continue with Apple" button
 */

import { Browser } from "@capacitor/browser";
import { isNativeApp, nativePlatform, NATIVE_URL_SCHEME } from "@/lib/native/platform";

export type OAuthProvider = "google" | "azure" | "apple";

/** Where the provider sends the person back to. Handled in deepLinks.ts. */
export const NATIVE_OAUTH_REDIRECT = NATIVE_URL_SCHEME + "://auth/callback";

export interface OAuthOffer {
  /** Google (and Microsoft, where its own flag is on) may be shown. */
  thirdParty: boolean;
  /** "Continue with Apple" may be shown. Never on the web: not configured there. */
  apple: boolean;
}

/**
 * Which provider buttons may be rendered. Pure, so the matrix is testable:
 *
 *   web                         third-party yes, Apple no   (unchanged)
 *   app, flag off               nothing
 *   Android, flag on            third-party yes, Apple only with the Apple flag
 *   iOS, flag on, no Apple flag nothing                     (guideline 4.8)
 *   iOS, both flags on          both
 */
export function resolveOAuthOffer(input: {
  native: boolean;
  platform: "ios" | "android" | "web";
  nativeOAuth: boolean;
  appleSignIn: boolean;
}): OAuthOffer {
  if (!input.native) return { thirdParty: true, apple: false };
  if (!input.nativeOAuth) return { thirdParty: false, apple: false };
  if (input.platform === "ios" && !input.appleSignIn) return { thirdParty: false, apple: false };
  return { thirdParty: true, apple: input.appleSignIn };
}

export function oauthOffer(): OAuthOffer {
  return resolveOAuthOffer({
    native: isNativeApp(),
    platform: nativePlatform(),
    nativeOAuth: import.meta.env.VITE_NATIVE_OAUTH === "true",
    appleSignIn: import.meta.env.VITE_NATIVE_APPLE_SIGNIN === "true",
  });
}

/**
 * Open the provider in the system browser (Safari View Controller / Chrome
 * Custom Tab). Resolves once the browser is showing; the session itself
 * arrives later, through the deep link.
 *
 * `onDismissed` fires when the browser goes away, which includes the person
 * closing it without finishing. The button uses it to stop showing a spinner.
 */
export async function startNativeOAuth(
  provider: OAuthProvider,
  options: { scopes?: string; onDismissed?: () => void } = {},
): Promise<void> {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: NATIVE_OAUTH_REDIRECT,
      // Without this supabase-js assigns window.location itself, which would
      // load the provider inside the app's webview: the exact thing Google
      // refuses. We only want the URL.
      skipBrowserRedirect: true,
      ...(options.scopes ? { scopes: options.scopes } : {}),
    },
  });
  if (error) throw error;
  if (!data?.url) throw new Error("The provider did not return a sign-in address.");

  if (options.onDismissed) {
    const onDismissed = options.onDismissed;
    const handle = await Browser.addListener("browserFinished", () => {
      void handle.remove();
      onDismissed();
    });
  }

  await Browser.open({ url: data.url });
}
