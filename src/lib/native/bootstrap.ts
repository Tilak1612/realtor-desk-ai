import { SystemBars, SystemBarsStyle } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { Keyboard } from "@capacitor/keyboard";
import { SplashScreen } from "@capacitor/splash-screen";
import { registerNativeStrings } from "@/i18n/native";
import { isNativeApp, nativePlatform } from "./platform";
import { NATIVE_HOME, normalizePath } from "./routes";

// One-time setup of the native shell. Called from src/main.tsx before the
// first render; on the web it returns on its first line and does nothing.
//
// What lives here: system bars, the keyboard, the splash screen, the Android
// back button, and the <html> classes the app's CSS keys off.
//
// What deliberately does NOT live here: deep links. The `appUrlOpen` listener
// that brings a sign-in back from the system browser belongs to the auth code
// (it has to exchange the code for a session), and two listeners racing for
// the same URL is how a callback gets handled twice. Nothing auth-related is
// imported or exported by this module.
//
// The plugins are imported statically on purpose. Each is a few hundred bytes
// of JS proxy, and the splash screen in particular must not depend on a second
// chunk arriving: if that chunk were the thing that failed, the splash would
// be the thing left on screen.

/**
 * How long the splash may stay up if the app never tells us it rendered.
 * Long enough for a cold start on a slow phone, short enough that a bundle
 * that failed to boot shows its error screen instead of a logo forever.
 */
const SPLASH_TIMEOUT_MS = 6000;

let bootstrapped = false;
let splashHidden = false;
let splashTimer: number | undefined;

/**
 * Take the launch splash down. The app calls this once the router has
 * committed its first screen; bootstrapNative() also arms a timer that calls
 * it regardless. Idempotent, and a no-op on the web.
 */
export function hideSplash(): void {
  if (!isNativeApp() || splashHidden) return;
  splashHidden = true;
  if (splashTimer !== undefined) window.clearTimeout(splashTimer);
  SplashScreen.hide({ fadeOutDuration: 200 }).catch(() => {
    // Nothing to recover: if the plugin is missing there is no splash either.
  });
}

// ── Keyboard ────────────────────────────────────────────────────────────────

const EDITABLE = "input, textarea, select, [contenteditable=''], [contenteditable='true']";

// Both platforms shrink the webview when the keyboard opens (iOS through
// Keyboard.resize = 'native' in capacitor.config.ts, Android through the core
// SystemBars plugin, which pads the window by the keyboard's height). The
// shells are sized in dynamic viewport units, so their scrolling region
// shrinks with it. What neither platform guarantees is that the field you
// tapped is still inside that smaller region when it sits in a nested
// overflow container, which is every form in the /app shell. So once the
// keyboard is up, bring the focused field back if it ended up outside.
function revealFocusedField(): void {
  const el = document.activeElement;
  if (!(el instanceof HTMLElement) || !el.matches(EDITABLE)) return;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const rect = el.getBoundingClientRect();
  // Already comfortably visible: leave the page where the user put it.
  if (rect.top >= 0 && rect.bottom <= viewportHeight - 16) return;
  el.scrollIntoView({ block: "center" });
}

function setUpKeyboard(platform: "ios" | "android"): void {
  if (platform === "ios") {
    // The accessory bar is the strip above the iOS keyboard with the Done
    // button. The Keyboard plugin HIDES it by default, and Capacitor's docs
    // suggest that for short forms. This app is not short forms: the Inbox
    // composer, lead notes and the AI assistant are textareas, where Return
    // inserts a new line, so Done is the only way to put the keyboard away
    // without sending. Keep it. (iPhone only; the call rejects on iPad, where
    // the keyboard has its own dismiss key.)
    Keyboard.setAccessoryBarVisible({ isVisible: true }).catch(() => {});
  }
  Keyboard.addListener("keyboardDidShow", revealFocusedField).catch(() => {});
}

// ── Android back button ─────────────────────────────────────────────────────

// Anything modal that Escape closes: Radix dialogs, alert dialogs, sheets,
// popovers, dropdown menus and selects, plus both navigation drawers (they are
// role="dialog" below lg and carry `inert` while closed).
const OPEN_OVERLAY = [
  '[role="dialog"]:not([inert]):not([data-state="closed"])',
  '[role="alertdialog"]:not([data-state="closed"])',
  '[role="menu"][data-state="open"]',
  '[role="listbox"][data-state="open"]',
].join(", ");

const hasOpenOverlay = (): boolean => document.querySelector(OPEN_OVERLAY) !== null;

// Screens where "back" has nowhere sensible to go. History usually does hold
// an older entry here (the sign-in screen after signing out, the dashboard
// after signing in), and going to it just bounces through a route guard and
// lands on the same screen again.
const BACK_EXITS_FROM: readonly string[] = [NATIVE_HOME, "/login"];

async function onBackButton(canGoBack: boolean): Promise<void> {
  // 1. Something is open on top of the page: back closes that, as it does in
  //    every Android app. Escape is the one dismissal every overlay in this
  //    codebase already implements, so synthesise it rather than teach each
  //    component about a back button.
  if (hasOpenOverlay()) {
    const target = document.activeElement instanceof HTMLElement ? document.activeElement : document.body;
    target.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true, cancelable: true }),
    );
    // Give React a moment to commit the close. If the overlay is still there
    // it refuses Escape on purpose (a required-action modal); fall through so
    // back still does something instead of the button going dead.
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    if (!hasOpenOverlay()) return;
  }

  // 2. Go back one screen, 3. or leave the app. minimizeApp, not exitApp: the
  //    session and the screen are kept for when the user returns.
  const path = normalizePath(window.location.pathname);
  if (canGoBack && !BACK_EXITS_FROM.includes(path)) {
    window.history.back();
    return;
  }
  CapApp.minimizeApp().catch(() => {});
}

// ── Entry point ─────────────────────────────────────────────────────────────

/** Set up the native shell. Safe to call on the web (no-op) and more than once. */
export function bootstrapNative(): void {
  if (!isNativeApp() || bootstrapped) return;
  bootstrapped = true;

  const platform = nativePlatform();
  if (platform === "web") return;

  // Hooks for src/index.css. Set synchronously, before React renders, so the
  // first paint already has its safe-area padding and there is no jump.
  document.documentElement.classList.add("native", `native-${platform}`);

  // Armed first: whatever else in here fails, the splash still comes down.
  splashTimer = window.setTimeout(hideSplash, SPLASH_TIMEOUT_MS);

  registerNativeStrings();

  // The app is light-only (nothing ever sets the `dark` class), so the status
  // bar wants dark icons whatever the phone's appearance setting is.
  // SystemBarsStyle.Light means "light background, dark content".
  //
  // This goes through Capacitor 8's core SystemBars rather than
  // @capacitor/status-bar: it is the same call on iOS, and on Android it also
  // styles the navigation bar at the bottom, which sits on the same light
  // background. There is no "don't draw under the status bar" switch to flip
  // any more. Android 15 made edge-to-edge the default, Android 16 removed the
  // opt-out, and Capacitor 8 removed `adjustMarginsForEdgeToEdge` with it
  // (StatusBar.setOverlaysWebView and setBackgroundColor are no-ops there). So
  // the app draws edge to edge on both platforms and the insets are handled
  // once, in CSS: see the "Native app shell" block in src/index.css.
  SystemBars.setStyle({ style: SystemBarsStyle.Light }).catch(() => {});

  setUpKeyboard(platform);

  if (platform === "android") {
    // Registering this listener turns off Capacitor's default back handling,
    // so everything back should do is in onBackButton above.
    CapApp.addListener("backButton", ({ canGoBack }) => {
      void onBackButton(canGoBack);
    }).catch(() => {});
  }
}
