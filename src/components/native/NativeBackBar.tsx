import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { NATIVE_HOME } from "@/lib/native/routes";

// The header the native app shows on the two legal pages in place of the
// marketing header.
//
// /privacy-policy and /terms-of-service stay reachable in the app so the legal
// text can be read there, but they are website pages: their header links to
// pricing and sign-up, which the app must not show, and without any header
// there is no way off the page on iOS, which has no back button. So in the app
// the Navbar shim renders this instead: one control, back.
//
// Fixed rather than sticky: html and body both set overflow-x, which makes
// body the sticky container and it never scrolls. The legal pages already
// leave 8rem of top padding for the fixed marketing header this replaces.

export function NativeBackBar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goBack = () => {
    // React Router keeps its position in history.state.idx; 0 means this page
    // is the first entry (opened directly), so there is nothing to go back to.
    const idx = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof idx === "number" && idx > 0) navigate(-1);
    else navigate(NATIVE_HOME, { replace: true });
  };

  return (
    <div
      className="fixed inset-x-0 z-40 border-b border-rd-line bg-white px-2"
      style={{ top: "var(--rd-safe-top, 0px)" }}
    >
      <button
        type="button"
        onClick={goBack}
        className="inline-flex min-h-[44px] items-center gap-1.5 px-2 text-sm font-semibold text-rd-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nativeShell.back", "Back")}
      </button>
    </div>
  );
}

export default NativeBackBar;
