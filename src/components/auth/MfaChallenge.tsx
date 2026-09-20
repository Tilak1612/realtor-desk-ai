import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * The second factor, asked for at sign-in.
 *
 * WHY THIS EXISTS. Settings could already enrol a TOTP factor, but nothing
 * ever asked for a code. Supabase issues an AAL1 session from a password or an
 * OAuth redirect and only raises it to AAL2 once a factor is verified -- and
 * no code path checked. So a user who had carefully set up an authenticator
 * was still fully signed in by password alone: the factor protected nothing,
 * while the Settings page told them their account was protected.
 *
 * Rendered by ProtectedRoute whenever the session's next assurance level is
 * aal2 and the current one is not, which covers password sign-in, an OAuth
 * return, and a restored session on a new tab alike. Putting the gate there
 * rather than in the login form means there is no route that skips it.
 */
export function MfaChallenge({ onVerified }: { onVerified: () => void }) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6) {
      setError(t("auth.mfa.sixDigits", "Enter the 6-digit code from your authenticator app."));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;
      const factor = factors?.totp?.find((f) => f.status === "verified") ?? factors?.totp?.[0];
      if (!factor) throw new Error(t("auth.mfa.noFactor", "No authenticator is set up on this account."));

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: factor.id,
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factor.id,
        challengeId: challenge.id,
        code: digits,
      });
      if (verifyError) throw verifyError;

      onVerified();
    } catch (err) {
      // Never echo the provider's wording: it distinguishes "invalid code"
      // from "expired challenge", which tells an attacker which half worked.
      setError(t("auth.mfa.invalidCode", "That code was not accepted. Try the current one from your app."));
      setCode("");
      inputRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.assign("/login");
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="flex items-start gap-2.5 text-sm text-rd-ink-700 bg-rd-navy-50 border border-rd-line rounded-lg p-3">
        <ShieldCheck aria-hidden="true" className="w-4 h-4 text-rd-navy-700 flex-shrink-0 mt-0.5" />
        <span>
          {t(
            "auth.mfa.prompt",
            "Two-step verification is on for this account. Enter the current code from your authenticator app."
          )}
        </span>
      </div>

      <div className="space-y-2">
        <label htmlFor="mfa-code" className="text-sm font-medium text-rd-ink-800 block">
          {t("auth.mfa.codeLabel", "6-digit code")}
        </label>
        <input
          ref={inputRef}
          id="mfa-code"
          name="one-time-code"
          // inputMode + autocomplete let iOS and Android offer the code from
          // the keyboard, and password managers fill it directly.
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "mfa-error" : undefined}
          className="w-full px-4 py-3 border border-rd-line rounded-xl bg-white text-rd-ink-900 text-center text-lg tracking-[0.4em] font-semibold focus:ring-2 focus:ring-rd-navy-500 focus:border-transparent"
        />
        {error && (
          // role=alert so it is announced the moment it appears.
          <p id="mfa-error" role="alert" className="text-sm text-rd-danger">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full min-h-11 bg-rd-navy-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-rd-navy-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>{busy ? t("app.common.loading", "Loading…") : t("auth.mfa.verify", "Verify and continue")}</span>
        {busy && <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />}
      </button>

      <button
        type="button"
        onClick={signOut}
        className="w-full min-h-11 text-sm text-rd-ink-600 hover:text-rd-navy-800 underline underline-offset-2"
      >
        {t("auth.mfa.useAnotherAccount", "Sign out and use another account")}
      </button>
    </form>
  );
}

export default MfaChallenge;
