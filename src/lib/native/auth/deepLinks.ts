/**
 * Links that open the iOS / Android app from outside it.
 *
 * Two kinds arrive through Capacitor's single `appUrlOpen` event:
 *
 *   1. com.brainfyai.realtordesk://auth/callback?code=...
 *      The return leg of a provider sign-in. Google refuses to run inside an
 *      embedded webview, so the app opens the provider in the system browser
 *      (see oauth.ts) and the provider hands control back with this URL. The
 *      app's own address never carries auth parameters, which is why
 *      detectSessionInUrl is off in native and the code is exchanged here.
 *
 *   2. https://www.realtordesk.ai/<path>
 *      Universal Links (iOS) / App Links (Android), once the owner has set
 *      them up. Only a short allow-list of paths is routed into the app.
 *
 * WHAT THIS MUST NOT BECOME. Any app on the phone, and any web page, can ask
 * the OS to open a custom-scheme URL. So the URL is untrusted input:
 *   - it is parsed by a pure function with an allow-list, and everything not
 *     named there is ignored rather than "handled sensibly";
 *   - the custom scheme accepts exactly one path. It is never a general way to
 *     navigate the app;
 *   - a forged ?code= cannot sign anyone in: the PKCE exchange needs the
 *     verifier that this app stored in the keystore when it started the flow.
 *
 * COLD START. Both native plugins retain appUrlOpen until a listener consumes
 * it, so a link that launches the app is delivered as soon as the listener
 * below is registered; no separate getLaunchUrl() pass is needed.
 */

import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import type { NavigateFunction } from "react-router-dom";
import { isNativeApp, NATIVE_URL_SCHEME } from "@/lib/native/platform";
import { isAllowedInNative, NATIVE_HOME } from "@/lib/native/routes";

export type AuthDeepLinkAction =
  /** A provider sign-in came back with an authorisation code to exchange. */
  | { kind: "oauth-callback"; code: string }
  /** A provider sign-in came back refused, cancelled or malformed. */
  | { kind: "oauth-error"; error: string; description: string }
  /** A website link the app is allowed to show: go to this in-app location. */
  | { kind: "route"; to: string }
  /** Anything else. Deliberately the default. */
  | { kind: "ignore" };

const IGNORE: AuthDeepLinkAction = { kind: "ignore" };

/** Hosts whose https links may be routed into the app. */
const WEB_HOSTS: readonly string[] = ["www.realtordesk.ai", "realtordesk.ai"];

/** The only path the custom scheme answers to. */
const OAUTH_CALLBACK_PATH = "/auth/callback";

// Supabase authorisation codes are UUIDs. The pattern is looser than that so a
// format change does not silently break sign-in, and tight enough that nothing
// resembling markup or a URL gets through.
const CODE_PATTERN = /^[A-Za-z0-9._~-]{8,512}$/;

// Encoded slashes, backslashes and dots are how a path pretends to be inside
// /app while a decoder further down the line sees something else.
const SUSPICIOUS_PATH = /\\|\/\/|%2f|%5c|%2e/i;

const MAX_URL_LENGTH = 4096;
const MAX_ERROR_TEXT = 200;

// Query string and fragment, merged. Supabase reports a failed round-trip in
// either, depending on the flow, and sometimes in both.
function collectParams(url: URL): URLSearchParams {
  const merged = new URLSearchParams(url.search);
  const fragment = new URLSearchParams(url.hash.replace(/^#/, ""));
  fragment.forEach((value, key) => {
    if (!merged.has(key)) merged.set(key, value);
  });
  return merged;
}

function parseCustomScheme(rawUrl: string): AuthDeepLinkAction {
  // Re-based onto https before parsing. Engines disagree about custom schemes
  // (older Chromium webviews put the whole "//auth/callback" in the pathname
  // and leave the host empty), and an allow-list must not depend on which
  // webview version the phone happens to have.
  const rest = rawUrl.slice(NATIVE_URL_SCHEME.length + "://".length);
  let url: URL;
  try {
    url = new URL("https://app.invalid/" + rest.replace(/^\/+/, ""));
  } catch {
    return IGNORE;
  }
  if (url.hostname !== "app.invalid") return IGNORE;
  if (url.pathname.replace(/\/+$/, "") !== OAUTH_CALLBACK_PATH) return IGNORE;

  const params = collectParams(url);
  const error = params.get("error") ?? params.get("error_code") ?? "";
  const description = params.get("error_description") ?? "";
  if (error || description) {
    return {
      kind: "oauth-error",
      error: error.slice(0, MAX_ERROR_TEXT),
      description: description.slice(0, MAX_ERROR_TEXT),
    };
  }

  const code = params.get("code") ?? "";
  if (!CODE_PATTERN.test(code)) {
    // Came back to the callback with nothing usable. Say so on the login
    // screen rather than leaving the person looking at a spinner.
    return { kind: "oauth-error", error: "missing_code", description: "" };
  }
  return { kind: "oauth-callback", code };
}

function parseWebLink(rawUrl: string): AuthDeepLinkAction {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return IGNORE;
  }
  if (url.protocol !== "https:") return IGNORE;
  if (!WEB_HOSTS.includes(url.hostname.toLowerCase())) return IGNORE;
  // https://www.realtordesk.ai@evil.example/ parses with evil.example as the
  // host and is already rejected above; credentials and ports are refused as
  // well so no variant of that trick is worth trying.
  if (url.username || url.password || url.port) return IGNORE;

  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (SUSPICIOUS_PATH.test(url.pathname)) return IGNORE;

  // The emailed link lands here carrying its one-time credentials (a ?code= or
  // a #access_token fragment). The reset screen consumes them, so both the
  // query and the fragment are passed through untouched.
  if (path === "/reset-password") {
    return { kind: "route", to: path + url.search + url.hash };
  }
  if (path === "/verify-email") {
    return { kind: "route", to: path };
  }
  // The product itself. Checked against the app's own route allow-list too, so
  // this file cannot drift into admitting a path the route guard would refuse.
  if ((path === NATIVE_HOME || path.startsWith(NATIVE_HOME + "/")) && isAllowedInNative(path)) {
    return { kind: "route", to: path + url.search };
  }
  return IGNORE;
}

/**
 * Decide what an incoming URL means. Pure: no Capacitor, no network, no
 * navigation, so the allow-list can be tested exhaustively.
 */
export function parseAuthDeepLink(rawUrl: unknown): AuthDeepLinkAction {
  if (typeof rawUrl !== "string") return IGNORE;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.length > MAX_URL_LENGTH) return IGNORE;

  if (trimmed.toLowerCase().startsWith(NATIVE_URL_SCHEME + "://")) {
    return parseCustomScheme(trimmed);
  }
  if (/^https:\/\//i.test(trimmed)) {
    return parseWebLink(trimmed);
  }
  return IGNORE;
}

/**
 * Where a failed provider round-trip is reported. Login.tsx already reads
 * ?error= and ?error_description= (that is how the web reports the same
 * failure), classifies cancelled versus failed, shows one message and strips
 * the parameters. Sending the app there means one implementation of that
 * wording, not two.
 */
export function loginErrorPath(error: string, description: string): string {
  const params = new URLSearchParams();
  params.set("error", error || "oauth_failed");
  if (description) params.set("error_description", description);
  return "/login?" + params.toString();
}

/* ── the listener ──────────────────────────────────────────────────────── */

// useNavigate() hands back a new function whenever the location changes, so
// the caller will "register" many times. There is still exactly one native
// listener; later calls only replace the navigate it uses.
let currentNavigate: NavigateFunction | null = null;
let listening = false;

// A single-use code delivered twice (the OS can replay an open event) would
// fail the second exchange and bounce a person who has just signed in back to
// the login screen with an error.
const handledCodes = new Set<string>();

async function closeBrowser(): Promise<void> {
  try {
    await Browser.close();
  } catch {
    /* nothing was open, or the platform has nothing to close */
  }
}

export async function handleAuthDeepLink(rawUrl: unknown): Promise<AuthDeepLinkAction> {
  const action = parseAuthDeepLink(rawUrl);
  const navigate = currentNavigate;
  if (action.kind === "ignore" || !navigate) return action;

  if (action.kind === "route") {
    navigate(action.to);
    return action;
  }

  // Both remaining kinds end a provider round-trip: put the browser tab away
  // first, so whatever the app shows next is not hidden underneath it.
  await closeBrowser();

  if (action.kind === "oauth-error") {
    navigate(loginErrorPath(action.error, action.description), { replace: true });
    return action;
  }

  if (handledCodes.has(action.code)) return action;
  handledCodes.add(action.code);

  try {
    // Lazy for the same reason as signOut.ts: constructing the client throws
    // wherever the env is absent, which is every component test.
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.auth.exchangeCodeForSession(action.code);
    if (error) throw error;
    navigate(NATIVE_HOME, { replace: true });
  } catch {
    // The reason is not shown (it distinguishes "expired" from "wrong
    // verifier", which is nobody's business but ours); the login screen says
    // sign-in could not be completed and offers the form again.
    navigate(loginErrorPath("exchange_failed", ""), { replace: true });
  }
  return action;
}

/**
 * Start listening for links that open the app. Call from inside the router,
 * with useNavigate()'s function; calling again just updates that function.
 * Does nothing in a browser.
 */
export function registerAuthDeepLinks(navigate: NavigateFunction): void {
  if (!isNativeApp()) return;
  currentNavigate = navigate;
  if (listening) return;
  listening = true;
  void App.addListener("appUrlOpen", ({ url }) => {
    void handleAuthDeepLink(url);
  }).catch(() => {
    // Registration failed (plugin missing from the native build). Allow a
    // later call to try again instead of silently never listening.
    listening = false;
  });
}

/** Test seam. */
export function __resetAuthDeepLinksForTests(): void {
  currentNavigate = null;
  listening = false;
  handledCodes.clear();
}
