import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Thin "you're offline" strip for the two product shells, rendered only in the
// native app (the shells guard it with isNativeApp()).
//
// A phone loses its connection in ways a desk does not: an elevator, a
// basement showing, a parkade. The app's own files are on the device, so
// navigation keeps working, and without this the only sign that anything is
// wrong is a list that silently fails to refresh. Nothing is cached for
// offline use; the strip says so plainly instead of implying the data is live.
//
// navigator.onLine plus the online/offline events is the whole mechanism: no
// network plugin, no polling. On Android the webview only reports changes when
// the app holds ACCESS_NETWORK_STATE; without it navigator.onLine stays true
// and this simply never shows.

export function OfflineBanner() {
  const { t } = useTranslation();
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="flex-shrink-0 bg-rd-ink-900 px-4 py-1.5 text-center text-xs font-medium text-white"
    >
      {t("nativeShell.offline.banner", "You’re offline. Showing what was already loaded.")}
    </div>
  );
}

export default OfflineBanner;
