import { Capacitor } from "@capacitor/core";

// The one switch for native-only behaviour.
//
// Realtor Desk ships as a website and, from the same bundle, as an iOS and an
// Android app (Capacitor). Nothing about the website may change because the app
// exists, so every native difference in the codebase sits behind isNativeApp().
// On the web this is always false and the branch is dead code.
//
// Why the app differs at all:
//   - it is a sign-in companion to a subscription bought on the website, so it
//     shows no purchase, price or link to checkout (App Store guideline
//     3.1.3(f), Google Play payments policy);
//   - its origin is capacitor://localhost or https://localhost, which is not an
//     address an email link or an OAuth provider can return to;
//   - it must not show screens that are still "coming soon" on the web.

/** True inside the iOS or Android app, false in any browser. */
export const isNativeApp = (): boolean => Capacitor.isNativePlatform();

/** "ios", "android" or "web". */
export const nativePlatform = (): "ios" | "android" | "web" => {
  const p = Capacitor.getPlatform();
  return p === "ios" || p === "android" ? p : "web";
};

/**
 * The public website, used where the app has to hand someone a real URL: the
 * link inside a password-reset or confirmation email, and the Terms and Privacy
 * pages. window.location.origin is correct on the web and useless in the app.
 */
export const PUBLIC_WEB_ORIGIN = "https://www.realtordesk.ai";

/** Origin to build auth email links from: the page's own on the web, the public site in the app. */
export const authLinkOrigin = (): string =>
  isNativeApp() ? PUBLIC_WEB_ORIGIN : window.location.origin;

/** Custom URL scheme registered by both native projects, for returning from the system browser. */
export const NATIVE_URL_SCHEME = "com.brainfyai.realtordesk";
