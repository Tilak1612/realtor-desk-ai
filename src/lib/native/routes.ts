// Which routes exist inside the iOS / Android app.
//
// The app is a sign-in companion to a subscription bought on the website, so
// the bundle contains every route the website has (one codebase, one route
// table) but the app may only ever show the product. This module is the single
// list of what "the product" means. It is pure (no Capacitor, no React) so the
// route guard, the navigation and the unit test all read the same answer.
//
// Two different questions are answered here, and they are not the same list:
//
//   isAllowedInNative(path)  "may the app render this path at all?"  An
//                            allow-list: anything not named is unreachable, so
//                            a marketing page added to App.tsx next year is
//                            blocked without anyone remembering this file.
//
//   isHiddenInNative(path)   "should a nav link to this path be dropped?"  A
//                            short deny-list of in-product destinations the
//                            app must not link to: the screens that are still
//                            "coming soon" on the web, and everything that
//                            sells (App Store guideline 3.1.3(f), Google Play
//                            payments policy).

/** Where the app starts and where every blocked path is sent. */
export const NATIVE_HOME = "/app";

// Exact path, or the path followed by "/...". "/app" therefore covers
// "/app/leads/123" but not "/apple" or "/application".
const ALLOWED_PREFIXES: readonly string[] = [
  "/app",
  "/contacts",
  "/call-workflow",
];

// These match exactly. /settings is the legacy alias that redirects into
// /app/settings; /contacts and /deals redirect into /app too. They are listed
// so the redirect in App.tsx keeps its precise target instead of being
// flattened to NATIVE_HOME.
const ALLOWED_EXACT: readonly string[] = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
  "/tasks",
  "/properties",
  "/ai-assistant",
  "/deals",
  "/settings",
  // Legal text has to be readable in-app: the sign-in screen links to both and
  // the store listings require a reachable privacy policy.
  "/privacy-policy",
  "/terms-of-service",
];

// Unfinished legacy screens (Calendar says "coming soon", Campaigns toasts
// "coming soon", Market shows sample data, the Integration Hub opens OAuth
// popups that post back to the website's origin) and the three commercial
// routes. None of these are in the allow-list above either; this list exists
// so navigation can filter its links rather than render one that bounces.
const HIDDEN_IN_NATIVE: readonly string[] = [
  "/calendar",
  "/campaigns",
  "/market",
  "/dashboard/integrations",
  "/billing",
  "/pricing",
  "/signup",
];

// Legacy aliases that App.tsx redirects into the /app shell. They are not
// product paths in their own right, but the legacy chrome (Tasks, Properties)
// still links to them, so they keep their real destination rather than all
// landing on the dashboard.
//
// /billing is the important one. RequireBilling sends an unpaid account to
// /billing?required=1. If the app answered that with NATIVE_HOME the two
// redirects would chase each other forever (/app -> /billing -> /app ...).
// Settings is deliberately outside RequireBilling, so it is the one place an
// unpaid account can always land, see its account and sign out.
const NATIVE_REDIRECTS: Readonly<Record<string, string>> = {
  "/billing": "/app/settings",
  "/profile": "/app/settings",
  "/reports": "/app/reports",
  "/automations": "/app/automation",
};

/**
 * Reduce anything link-shaped to a comparable pathname: drops the query string
 * and hash ("/billing?required=1" -> "/billing"), trailing slashes and case.
 * Anything that is not an absolute in-app path comes back as "" and so matches
 * nothing.
 */
export function normalizePath(path: string): string {
  if (typeof path !== "string") return "";
  const cut = path.search(/[?#]/);
  let p = (cut === -1 ? path : path.slice(0, cut)).trim().toLowerCase();
  if (!p.startsWith("/") || p.startsWith("//")) return "";
  // Collapse "//" so "/app//leads" cannot dodge a prefix check.
  p = p.replace(/\/{2,}/g, "/");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

const matchesPrefix = (path: string, prefix: string): boolean =>
  path === prefix || path.startsWith(prefix + "/");

/** True when the native app may render this path. Always consult via the guard, never on the web. */
export function isAllowedInNative(path: string): boolean {
  const p = normalizePath(path);
  if (!p) return false;
  if (ALLOWED_EXACT.includes(p)) return true;
  return ALLOWED_PREFIXES.some((prefix) => matchesPrefix(p, prefix));
}

/**
 * True for destinations the app must not link to: the unfinished legacy
 * screens and /billing, /pricing, /signup. Navigation filters its items with
 * this (only when isNativeApp() is true; on the web every link stays).
 */
export function isHiddenInNative(path: string): boolean {
  const p = normalizePath(path);
  if (!p) return false;
  return HIDDEN_IN_NATIVE.some((hidden) => matchesPrefix(p, hidden));
}

/** Where the app sends a path it will not render. */
export function nativeRedirectFor(path: string): string {
  const p = normalizePath(path);
  return NATIVE_REDIRECTS[p] ?? NATIVE_HOME;
}
