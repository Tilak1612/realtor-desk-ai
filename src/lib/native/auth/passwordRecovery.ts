/**
 * "Forgot password" requested from inside the iOS / Android app.
 *
 * The app cannot simply call supabase.auth.resetPasswordForEmail() on the main
 * client, even with the redirect pointed at the website. That client runs the
 * PKCE flow: it generates a code verifier, keeps it in ITS OWN storage, and
 * the emailed link only works where that verifier is. Requested from the app,
 * the verifier is in the phone's keystore; the link opens the website in
 * Safari or Chrome, which has never seen it, so the website cannot turn the
 * link into a session and "Set new password" fails with "Auth session
 * missing". (supabase-js only treats ?code= as a callback at all when a
 * verifier is present in storage: GoTrueClient._isPKCECallback.)
 *
 * So the app asks for the recovery email WITHOUT a code challenge. The link
 * then carries its own one-time credentials in the URL fragment and works in
 * whatever browser the person opens their mail in, on this phone or another
 * device. ResetPassword.tsx reads that fragment (see lib/auth/recoveryLink.ts).
 *
 * This is a second, throwaway client used for that single request. It holds no
 * session, persists nothing and refreshes nothing; the app's real session
 * stays on the main client and in the keystore.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { authLinkOrigin } from "@/lib/native/platform";

let recoveryClient: SupabaseClient | null = null;

async function client(): Promise<SupabaseClient> {
  if (!recoveryClient) {
    const { createClient } = await import("@supabase/supabase-js");
    recoveryClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          flowType: "implicit",
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          // Its own key, so it can never read or disturb the real session.
          storageKey: "rd-native-recovery",
        },
      },
    );
  }
  return recoveryClient;
}

/** Sends the reset email; the link in it opens the public website. */
export async function requestPasswordResetFromApp(email: string): Promise<{ error: Error | null }> {
  const supabase = await client();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: authLinkOrigin() + "/reset-password",
  });
  return { error: error ?? null };
}
