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
import { isNativeApp } from "@/lib/native/platform";
import { clearNativeAuthSession } from "@/lib/native/auth/secureSessionStorage";
import { hardNavigate } from "@/lib/native/auth/hardNavigate";

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
  if (isNativeApp()) {
    // In the app, signing out must leave nothing in the keystore whether or
    // not the phone has signal. supabase-js does not guarantee that: when the
    // revoke request fails for any reason other than 401/403/404 it returns
    // the error and leaves the stored session in place, so someone who tapped
    // "Sign out" in a parking garage would still be signed in on the next
    // launch. So: ask the server to revoke (best effort), then remove the
    // entry ourselves regardless of the answer.
    //
    // The result is reported as success because on this device it is one: the
    // refresh token existed only in the keystore entry that is now gone, and
    // callers treat an error as "still signed in" (Settings stays on the page).
    let revoked = false;
    try {
      const { error } = await supabase.auth.signOut();
      revoked = !error;
    } catch {
      /* offline or the request threw: the local removal below still runs */
    }
    await clearNativeAuthSession();
    if (!revoked) {
      // The library never got as far as announcing SIGNED_OUT, so everything
      // that listens for it still believes someone is signed in: the
      // subscription state, cached queries, any mounted guard. On a phone the
      // next person to sign in may be a different agent, and they must not
      // inherit any of that. Start again from the sign-in screen with nothing
      // in memory. The marker is cleared too, because no SIGNED_OUT will
      // arrive to consume it and it would swallow the next genuine
      // "your session expired" message.
      try {
        sessionStorage.removeItem(INTENTIONAL);
      } catch {
        /* ignore */
      }
      hardNavigate("/login");
    }
    return { error: null };
  }
  // Default scope is global, which revokes the refresh token everywhere
  // rather than only in this browser. That is the behaviour we want.
  const { error } = await supabase.auth.signOut();
  return { error: error ?? null };
}

/**
 * Where a person lands after signing out. The website sends some sign-outs to
 * its home page; the app has no home page to show (the marketing site is not
 * part of it), so there it is always the sign-in screen.
 */
export function signedOutLanding(webPath: string = "/login"): string {
  return isNativeApp() ? "/login" : webPath;
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
