/**
 * Where the Supabase session is kept, decided by "Remember me".
 *
 * supabase-js takes ONE storage object when the client is constructed, long
 * before anyone ticks a checkbox, so the choice cannot be passed per sign-in.
 * This adapter is that single object and reads the preference at call time.
 *
 *   remembered (default) -> localStorage, survives closing the browser
 *   not remembered       -> sessionStorage, dies with the tab
 *
 * Absence of a preference means "remembered", so every session that exists
 * today keeps working exactly as it did.
 *
 * Reads check both stores: when the preference changes, the session written
 * under the old one must still be found and moved rather than silently
 * signing the person out.
 */

const PREF_KEY = "rd.auth.persist";
type Pref = "local" | "session";

function pref(): Pref {
  try {
    return localStorage.getItem(PREF_KEY) === "session" ? "session" : "local";
  } catch {
    // Safari in Lockdown Mode, or storage blocked entirely.
    return "local";
  }
}

/** Call BEFORE signing in, so the token lands in the right place first time. */
export function setRememberMe(remember: boolean): void {
  try {
    localStorage.setItem(PREF_KEY, remember ? "local" : "session");
  } catch {
    /* storage unavailable: fall back to the default, which is to remember */
  }
}

export function isRemembered(): boolean {
  return pref() === "local";
}

function stores(): { primary: Storage; other: Storage } | null {
  try {
    return pref() === "session"
      ? { primary: window.sessionStorage, other: window.localStorage }
      : { primary: window.localStorage, other: window.sessionStorage };
  } catch {
    return null;
  }
}

export const authStorage = {
  getItem(key: string): string | null {
    const s = stores();
    if (!s) return null;
    // Primary first, then the other store -- a session written before the
    // preference changed is still valid and gets picked up here.
    return s.primary.getItem(key) ?? s.other.getItem(key);
  },
  setItem(key: string, value: string): void {
    const s = stores();
    if (!s) return;
    s.primary.setItem(key, value);
    // Never leave a copy behind in the store we are not using: that is how a
    // "don't remember me" session survives a browser restart.
    s.other.removeItem(key);
  },
  removeItem(key: string): void {
    const s = stores();
    if (!s) return;
    s.primary.removeItem(key);
    s.other.removeItem(key);
  },
};
