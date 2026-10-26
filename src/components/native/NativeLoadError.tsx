import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { hideSplash } from "@/lib/native/bootstrap";
import { NATIVE_HOME, normalizePath } from "@/lib/native/routes";

// What the native app shows when a screen cannot be rendered at all: a chunk
// that failed to load (lazyWithRetry has already tried one reload by the time
// the error reaches a boundary) or a render crash.
//
// App.tsx passes this to the top-level ErrorBoundary as its fallback, in the
// app only. The web keeps the boundary's own screen, whose copy ("refresh the
// page", "go to home") is about a browser tab and whose Home button leads to
// the marketing site.
//
// It is rendered OUTSIDE the router and every provider, so it uses nothing but
// i18n (a global instance) and window.location.

export function NativeLoadError() {
  const { t } = useTranslation();
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    // If the crash happened before the router's first commit, the splash is
    // still up and would otherwise cover this screen until its timeout.
    hideSplash();
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  // React.lazy caches a rejected import for the life of the document, so
  // "try again" has to be a reload; resetting the boundary would re-throw the
  // same error. The files are on the device, so the reload itself cannot fail.
  const retry = () => window.location.reload();
  // The way out when it is this particular screen that keeps failing.
  const goHome = () => window.location.assign(NATIVE_HOME);
  const onHome = normalizePath(window.location.pathname) === NATIVE_HOME;

  return (
    <div
      role="alert"
      className="rd-reset min-h-screen bg-rd-paper text-rd-ink-900 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold mb-2">
          {online
            ? t("nativeShell.loadError.title", "This screen didn’t load")
            : t("nativeShell.loadError.offlineTitle", "You’re offline")}
        </h1>
        <p className="text-sm text-rd-ink-600 mb-6">
          {online
            ? t(
                "nativeShell.loadError.body",
                "Something went wrong while loading. Try again, and if it keeps happening, close the app and reopen it.",
              )
            : t(
                "nativeShell.loadError.offlineBody",
                "Realtor Desk needs a connection to load this screen. Check your Wi-Fi or mobile data, then try again.",
              )}
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={retry}
            className="min-h-[44px] rounded-full bg-rd-navy-800 px-6 py-3 text-sm font-semibold text-white"
          >
            {t("nativeShell.loadError.retry", "Try again")}
          </button>
          {!onHome && (
            <button
              type="button"
              onClick={goHome}
              className="min-h-[44px] rounded-full border border-rd-line bg-white px-6 py-3 text-sm font-semibold text-rd-ink-900"
            >
              {t("nativeShell.loadError.home", "Go to dashboard")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NativeLoadError;
