import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/rd/layout/AppShell";

// In-app 404. A signed-in user who hits a missing /app/* route used to fall
// through to the public catch-all, which renders the marketing 404 complete
// with a "Sign in / Start free trial" header — indistinguishable from being
// logged out. Keeping them inside the shell makes it read as a bad link,
// which is what it is.
export default function AppNotFound() {
  const { t } = useTranslation();

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-sm font-medium tracking-wide text-rd-ink-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-rd-ink-900">
          {t("rd.app.notFound.title", "We couldn't find that page")}
        </h1>
        <p className="mt-3 max-w-md text-sm text-rd-ink-600">
          {t(
            "rd.app.notFound.body",
            "The link may be out of date. Your account and data are unaffected.",
          )}
        </p>
        <Link
          to="/app"
          className="mt-8 inline-flex items-center rounded-md bg-rd-ink-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {t("rd.app.notFound.cta", "Back to dashboard")}
        </Link>
      </div>
    </AppShell>
  );
}
