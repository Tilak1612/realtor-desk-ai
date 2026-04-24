// rd_ref cookie read/write. Client-side only — the cookie is NOT
// HttpOnly so client JS reads it to forward the affiliate slug into
// Stripe Checkout session metadata. See lib/affiliate/constants.ts
// for the rationale.
//
// Why last-click attribution: the cookie overwrites on every click.
// If Alice refers a visitor via rd_ref=alice, then Bob re-refers via
// rd_ref=bob, Bob gets the commission if the visitor converts. This
// matches industry norm for SaaS affiliate programs and is what the
// README describes.

import { ATTRIBUTION_COOKIE } from "./constants";

/** Read the current referral slug, or null if no cookie is set. */
export function readReferralCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${ATTRIBUTION_COOKIE.name}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Write the referral cookie. Called on landing when `?ref=<slug>` is
 * present in the URL. TTL resets on every write (last-click attribution).
 *
 * Slug is URL-encoded. Empty/whitespace slugs are rejected — prevents
 * an attacker with XSS from nuking the attribution by writing "".
 */
export function writeReferralCookie(slug: string): void {
  if (typeof document === "undefined") return;
  const trimmed = slug.trim();
  if (!trimmed) return;

  const expires = new Date();
  expires.setDate(expires.getDate() + ATTRIBUTION_COOKIE.ttlDays);

  const parts = [
    `${ATTRIBUTION_COOKIE.name}=${encodeURIComponent(trimmed)}`,
    `expires=${expires.toUTCString()}`,
    "path=/",
    `SameSite=${ATTRIBUTION_COOKIE.sameSite}`,
  ];

  // Only mark Secure on https; dev on http would otherwise silently
  // drop the cookie and attribution would never activate locally.
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

/**
 * Clear the referral cookie. Used on successful conversion (once the
 * Stripe Checkout session is created, attribution is locked into the
 * session metadata and the cookie is no longer needed).
 */
export function clearReferralCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ATTRIBUTION_COOKIE.name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

/**
 * Extract `?ref=<slug>` from a URL (or window.location) and return
 * the slug if present. Use case: the landing-page effect that writes
 * the cookie.
 */
export function getReferralParamFromUrl(
  urlOrSearch: string | URLSearchParams = typeof window !== "undefined"
    ? window.location.search
    : "",
): string | null {
  const params =
    urlOrSearch instanceof URLSearchParams
      ? urlOrSearch
      : new URLSearchParams(urlOrSearch);
  const slug = params.get("ref");
  return slug && slug.trim() ? slug.trim() : null;
}
