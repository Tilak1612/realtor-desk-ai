import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { LEGAL_ROUTES } from "@/config/legal";

// "By continuing, you agree to our Terms of Service and Privacy Policy."
//
// This is sign-in-wrap, and it is only defensible when the notice is
// CONSPICUOUS and IMMEDIATELY ADJACENT to the action it binds — courts have
// repeatedly refused to enforce terms buried in a footer or rendered in low
// contrast. So: placed directly under the submit button, at the same reading
// size as the rest of the form, with links that are underlined and colour-
// distinct. Links are rd-navy-700 on white, which measures well past AA.
//
// Signup additionally records WHAT was agreed and WHEN — see
// buildConsentRecord() — because an inline notice with no acceptance trail is
// the weakest possible position if a term is ever disputed.
//
// SCOPE. This covers terms and privacy acceptance only. It is NOT a lawful
// basis for commercial email: CASL requires express, opt-in consent for
// marketing, which stays a separate unchecked checkbox on signup. Folding
// marketing into "by continuing" would be a compliance regression.
//
// Uses <Trans> so translators can move the link positions inside the sentence
// — French word order puts them elsewhere, and string concatenation would
// force an unnatural sentence.

const linkClass =
  "text-rd-navy-700 underline underline-offset-2 hover:text-rd-navy-800 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-500";

export function ContinueConsentNotice({ className = "" }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <p className={`text-center text-xs leading-relaxed text-rd-ink-600 ${className}`}>
      <Trans
        i18nKey="auth.consentNotice"
        t={t}
        defaults="By continuing, you agree to our <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>."
        components={{
          terms: (
            <Link
              to={LEGAL_ROUTES.terms}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            />
          ),
          privacy: (
            <Link
              to={LEGAL_ROUTES.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            />
          ),
        }}
      />
    </p>
  );
}

export default ContinueConsentNotice;
