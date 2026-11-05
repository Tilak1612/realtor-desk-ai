/**
 * Keeps the session honest across backgrounding, inside the iOS / Android app.
 *
 * supabase-js refreshes the access token on a timer. In a browser it pauses
 * that timer itself when the tab is hidden. Supabase's guidance for anything
 * that is not a browser tab is to drive it from the platform's own foreground
 * signal instead: startAutoRefresh() when the app becomes active,
 * stopAutoRefresh() when it leaves. (Calling either one removes the library's
 * own visibilitychange handler, so from then on this module is in charge.)
 *
 * Why it matters here: a phone app is left in the background for hours. The
 * access token lasts one hour. Without this, a person reopening the app sees
 * the signed-in screens they left, and every request behind them fails until
 * the next timer tick notices. On resume we therefore also ask for the session
 * once, immediately: getSession() refreshes an expired token on the spot, and
 * if the refresh token has been revoked it clears the session and emits
 * SIGNED_OUT, which ProtectedRoute turns into /login with the "your session
 * expired" message.
 *
 * The Supabase client is imported lazily for the same reason signOut.ts does
 * it: constructing it throws wherever the env is absent, which is every
 * component test.
 */

import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/native/platform";

let registered = false;

async function onStateChange(isActive: boolean): Promise<void> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    if (isActive) {
      await supabase.auth.startAutoRefresh();
      await supabase.auth.getSession();
    } else {
      await supabase.auth.stopAutoRefresh();
    }
  } catch (err) {
    // Never let a lifecycle callback throw into the native bridge. Worst case
    // the next API call discovers the expired session instead.
    console.warn("[auth] lifecycle handler failed:", err instanceof Error ? err.name : "unknown");
  }
}

/**
 * Register once, at startup. Does nothing in a browser. Safe to call twice.
 * Returns a function that removes the listener (used by tests and hot reload).
 */
export function registerAuthLifecycle(): () => void {
  if (!isNativeApp() || registered) return () => {};
  registered = true;

  const handle = App.addListener("appStateChange", ({ isActive }) => {
    void onStateChange(isActive);
  });

  return () => {
    registered = false;
    void handle.then((h) => h.remove()).catch(() => {});
  };
}
