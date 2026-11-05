import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { setupGlobalErrorHandling } from "./lib/errorMonitoring";
import { bootstrapNative, hideSplash } from "./lib/native/bootstrap";
import { isNativeApp, nativePlatform } from "./lib/native/platform";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.2,
  enabled: import.meta.env.PROD && Boolean(import.meta.env.VITE_SENTRY_DSN),
});

// The iOS and Android apps report to the same Sentry project as the website,
// so mark their events: a crash in the webview of one platform is a different
// bug from the same stack in desktop Chrome. The tag is `app_platform` rather
// than `platform` because Sentry already has an event field of that name
// (always "javascript" here) and searching on it would hit that instead.
// Nothing is tagged on the web, and consent handling is unchanged everywhere.
if (isNativeApp()) {
  Sentry.setTag("app_platform", nativePlatform());
}

// Initialize global error monitoring
setupGlobalErrorHandling();

// Native shell (status bar, keyboard, splash, Android back button, the
// html.native class the CSS keys off). Before render so the first paint
// already has its safe-area padding. Returns immediately on the web.
bootstrapNative();

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <HelmetProvider>
        <App />
        {/* Vercel Speed Insights is web analytics for the website: it loads a
            script from Vercel and reports page timings. The iOS / Android app
            does no analytics (and is not served by Vercel), so it is not
            mounted there. */}
        {!isNativeApp() && <SpeedInsights />}
      </HelmetProvider>
    );
  } catch (error) {
    console.error("Failed to render app:", error);
    // The static message below is useless behind a launch splash.
    hideSplash();
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #FAFAF7; color: #111418; font-family: system-ui, sans-serif; padding: 2rem; text-align: center;">
        <div>
          <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Unable to load application</h1>
          <p style="color: #6B7280; margin-bottom: 1.5rem;">Please try refreshing the page or clearing your browser cache.</p>
          <button onclick="window.location.reload()" style="background: #0B2540; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 9999px; cursor: pointer; font-weight: 500;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
} else {
  console.error("Root element not found");
}
