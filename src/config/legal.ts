// Legal document versions and the acceptance record they anchor.
//
// WHY FIXED DATES. Both /terms-of-service and /privacy-policy rendered
// `Last updated: {new Date().toLocaleDateString()}` — so they claimed to have
// been revised today, every day. Two problems: a legal document that always
// looks freshly amended tells a user nothing, and the Privacy Policy promises
// "we notify you ... by updating the 'Last updated' date", which is impossible
// to honour when that date moves on its own. These are the real last-revision
// dates, taken from the git history of each page.
//
// WHY A VERSION AT ALL. Signup now uses an inline "By continuing, you agree
// to..." notice rather than a tick box. That pattern is only defensible if you
// can show WHAT the user agreed to and WHEN, so signUp records the accepted
// version and a timestamp in user metadata. Bump the date here whenever the
// corresponding page's terms actually change.

export const TERMS_VERSION = "2026-04-22";
export const PRIVACY_VERSION = "2026-04-24";

export const LEGAL_ROUTES = {
  terms: "/terms-of-service",
  privacy: "/privacy-policy",
} as const;

/** Acceptance record attached to auth.users.user_metadata at signup. */
export function buildConsentRecord(marketingOptIn: boolean) {
  return {
    terms_version: TERMS_VERSION,
    privacy_version: PRIVACY_VERSION,
    terms_accepted_at: new Date().toISOString(),
    // CASL: express consent for commercial electronic messages. Recorded
    // separately and only ever true when the user ticked the box themselves.
    marketing_consent: marketingOptIn,
    marketing_consent_at: marketingOptIn ? new Date().toISOString() : null,
  };
}

/** Locale-aware display date for the legal pages. */
export function formatLegalDate(iso: string, language: string | undefined): string {
  const locale = (language || "en").toLowerCase().startsWith("fr") ? "fr-CA" : "en-CA";
  // Parse as a plain calendar date; no timezone shifting on a revision date.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
