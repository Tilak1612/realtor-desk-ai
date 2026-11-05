import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RDMark } from "@/components/rd/Logo";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { signOutIntentionally } from "@/lib/auth/signOut";
import "@/i18n/nativeAuth";

// What the iOS / Android app shows to a signed-in account that has no active
// subscription. On the website this account is sent to /billing to choose a
// plan. The app cannot do that, or anything that resembles it.
//
// WHAT MAY NEVER BE ADDED HERE. The app is a companion to a subscription
// bought on the website (App Store guideline 3.1.3(f), Google Play payments
// policy). So this screen carries no price, no plan name, no "subscribe" or
// "upgrade", no link that leaves the app, and no sentence telling the person
// where to go to pay. It states a fact about the account and offers the three
// things that are still theirs to do:
//
//   Check again       the subscription may have started a minute ago
//   Account settings  export or delete their data (their right whatever the
//                     billing state, so Settings sits outside this gate)
//   Sign out          they may simply be in the wrong account, which is why
//                     the address they signed in with is shown
//
// Rendered by RequireBilling only when isNativeApp() is true.
export default function NoAccessScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refreshSubscription, loading } = useSubscription();
  const [email, setEmail] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Lazy, like every other use of the client outside a data hook: it throws
    // on construction wherever the env is absent, which is every unit test.
    void import("@/integrations/supabase/client")
      .then(({ supabase }) => supabase.auth.getSession())
      .then(({ data }) => {
        if (!cancelled) setEmail(data.session?.user?.email ?? "");
      })
      .catch(() => {
        /* the line is simply left out */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOutIntentionally();
    navigate("/login", { replace: true });
  };

  const buttonBase =
    "w-full min-h-11 inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <main className="min-h-screen flex items-center justify-center bg-rd-paper px-6 py-10">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-5">
          <RDMark size={48} tone="navy" />
        </div>
        <h1 className="text-[22px] leading-tight font-bold text-rd-navy-900 tracking-tight">
          {t("nativeAuth.noAccess.title", "No active subscription on this account")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-rd-ink-700">
          {t(
            "nativeAuth.noAccess.body",
            "This account does not have an active Realtor Desk subscription, so the app cannot open your workspace.",
          )}
        </p>
        {email && (
          <p className="mt-2 text-sm text-rd-ink-600 break-words">
            {t("nativeAuth.noAccess.signedInAs", "Signed in as {{email}}", { email })}
          </p>
        )}

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={() => void refreshSubscription()}
            disabled={loading || signingOut}
            className={`${buttonBase} bg-rd-navy-800 text-white hover:bg-rd-navy-700`}
          >
            {loading
              ? t("nativeAuth.noAccess.checking", "Checking…")
              : t("nativeAuth.noAccess.checkAgain", "Check again")}
          </button>
          <p className="text-xs text-rd-ink-600">
            {t("nativeAuth.noAccess.recheckHint", "If that has just changed, check again.")}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-rd-line space-y-3">
          <p className="text-xs leading-relaxed text-rd-ink-600">
            {t(
              "nativeAuth.noAccess.dataNote",
              "Your data is still yours. You can export or delete it from your account settings.",
            )}
          </p>
          <Link
            to="/app/settings"
            className={`${buttonBase} border border-rd-line bg-white text-rd-ink-800 hover:bg-rd-ink-50`}
          >
            {t("nativeAuth.noAccess.settings", "Account settings")}
          </Link>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className={`${buttonBase} text-rd-navy-700 underline underline-offset-2 hover:text-rd-navy-800`}
          >
            {t("nativeAuth.noAccess.signOut", "Sign out")}
          </button>
        </div>
      </div>
    </main>
  );
}
