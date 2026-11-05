/**
 * Reading a password-recovery link that carries its credentials in the URL
 * fragment:
 *
 *   /reset-password#access_token=...&refresh_token=...&type=recovery
 *
 * Supabase issues this shape when the reset was requested without a PKCE code
 * challenge. Two things do that today: the iOS / Android app (it has to, see
 * native/auth/passwordRecovery.ts) and the support tool that generates a
 * recovery link by hand (scripts/recovery-link.sh).
 *
 * The website's Supabase client is configured for PKCE and refuses this shape
 * during start-up ("Not a valid PKCE flow url"), so the reset page has to pick
 * the tokens up itself. This parser is the whole of that decision, kept pure
 * so it can be tested without a browser.
 *
 * Only `type=recovery` is accepted. A fragment with tokens of any other type
 * (a sign-in, an invite) is not something the reset page should turn into a
 * session, and an error fragment has no tokens at all.
 */

export interface RecoveryTokens {
  accessToken: string;
  refreshToken: string;
}

// A JWT is three base64url segments; a Supabase refresh token is a short
// opaque string. Loose enough for both, strict enough to reject markup.
const TOKEN_PATTERN = /^[A-Za-z0-9._~-]{6,4096}$/;

export function parseRecoveryFragment(hash: string | null | undefined): RecoveryTokens | null {
  if (typeof hash !== "string" || hash.length < 2) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  if (params.get("type") !== "recovery") return null;
  const accessToken = params.get("access_token") ?? "";
  const refreshToken = params.get("refresh_token") ?? "";
  if (!TOKEN_PATTERN.test(accessToken) || !TOKEN_PATTERN.test(refreshToken)) return null;
  return { accessToken, refreshToken };
}
