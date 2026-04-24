// Security primitives for the affiliate program:
//   - hashIpAddress     (PIPEDA/GDPR — raw IPs never stored)
//   - generateAffiliateSlug (public ?ref=<slug> token)
//   - slugifyDisplayName    (first-attempt slug from signup display name)
//
// All three run in any environment that exposes Web Crypto (browser,
// Deno edge functions, modern Node ≥19). No native-module dependencies.

import { DEFAULT_SLUG_LENGTH, MIN_IP_SALT_LENGTH } from "./constants";

/**
 * SHA-256 of `<ip>:<salt>`. Stored on affiliate_clicks.ip_hash.
 *
 * Salt rotates safely — rotating breaks click dedup (the same visitor
 * counts again on the next click) but cannot leak prior hashes. The
 * salt comes from AFFILIATE_IP_SALT env var; validate length here so
 * a misconfigured deployment fails loudly at the first click instead
 * of silently publishing low-entropy hashes.
 */
export async function hashIpAddress(ip: string, salt: string): Promise<string> {
  if (!salt || salt.length < MIN_IP_SALT_LENGTH) {
    throw new Error(
      `hashIpAddress: salt must be ≥${MIN_IP_SALT_LENGTH} chars (got ${salt?.length ?? 0})`,
    );
  }
  const data = new TextEncoder().encode(`${ip}:${salt}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Unambiguous alphabet: no `l` vs `1`, no `0` vs `O`, no `i`.
 * Makes verbal communication ("my referral is r-d-k-7...") reliable.
 */
const SLUG_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/**
 * Cryptographically-random, URL-safe affiliate slug. 8 chars over the
 * 31-char alphabet ≈ 40 bits of entropy — collision probability on
 * 10,000 affiliates is ~1 in 2 million, well below the threshold
 * where we'd need to handle retries at signup.
 */
export function generateAffiliateSlug(length: number = DEFAULT_SLUG_LENGTH): string {
  if (length <= 0) throw new Error("generateAffiliateSlug: length must be positive");
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = "";
  for (let i = 0; i < length; i++) {
    out += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
  }
  return out;
}

/**
 * Derive a DB-safe slug from a display name. First-attempt slug at
 * signup; the signup flow catches the unique-constraint violation and
 * falls back to generateAffiliateSlug() on collision.
 *
 * - Lowercases
 * - Strips combining diacritics (so "Jérémie" → "jeremie")
 * - Collapses non-alphanumeric runs to single hyphens
 * - Trims leading/trailing hyphens
 * - Caps at 32 chars (matches DB column expectation, leaves headroom)
 */
export function slugifyDisplayName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // combining diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}
