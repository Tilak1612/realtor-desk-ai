/**
 * Telling "you signed out" apart from "your session expired".
 *
 * Both end as the same SIGNED_OUT event, so the app could not explain itself:
 * a session that expired mid-task dropped the person on /login with no
 * message, looking like the app had simply forgotten them. Deliberate
 * sign-outs set this flag first; anything else that clears the session is an
 * expiry, and the login page says so.
 *
 * sessionStorage, not localStorage: the flag must not outlive the tab and
 * greet someone with a stale "your session expired" days later.
 */
const INTENTIONAL = "rd.auth.signed-out";
const EXPIRED = "rd.auth.expired";

/** Use everywhere a person chooses to sign out. */
export async function signOutIntentionally(): Promise<{ error: Error | null }> {
  try {
    sessionStorage.setItem(INTENTIONAL, "1");
  } catch {
    /* storage blocked: worst case the person sees an extra explanation */
  }
  // Imported lazily ON PURPOSE. Several callers (TopNav among them) avoid a
  // static import of the client so that merely rendering them does not
  // construct it -- it throws "supabaseUrl is required" wherever the env is
  // absent, which is every component test in CI. A static import here would
  // have reintroduced that through the back door, and did: three layout suites
  // went red the moment this helper was wired in.
  const { supabase } = await import("@/integrations/supabase/client");
  // Default scope is global, which revokes the refresh token everywhere
  // rather than only in this browser. That is the behaviour we want.
  const { error } = await supabase.auth.signOut();
  return { error: error ?? null };
}

/** Called when the session disappears without anyone asking. */
export function noteSessionEnded(): void {
  try {
    if (sessionStorage.getItem(INTENTIONAL)) {
      sessionStorage.removeItem(INTENTIONAL);
      return;
    }
    sessionStorage.setItem(EXPIRED, "1");
  } catch {
    /* ignore */
  }
}

/** Reads and clears the flag, so the message is shown exactly once. */
export function consumeSessionExpired(): boolean {
  try {
    if (sessionStorage.getItem(EXPIRED)) {
      sessionStorage.removeItem(EXPIRED);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
