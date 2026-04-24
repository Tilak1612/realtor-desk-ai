// Single source of truth for affiliate program v1 knobs.
//
// Any change here ripples across: webhook handler (rate resolution +
// clawback window), SQL function fn_current_commission_rate_bps (must
// match the COMMISSION_RATES_BPS values below), migration
// 20260423000000_affiliate_program.sql (tier enum values must match
// AffiliateTier).
//
// Keep in lockstep with fn_recompute_affiliate_tier() + fn_current_commission_rate_bps()
// in supabase/migrations/20260423000000_affiliate_program.sql.

export type AffiliateTier = "starter" | "growth" | "elite" | "ambassador";
export type AffiliateTrack = "standard" | "ambassador";

/**
 * Rolling 90-day active-referral thresholds for tier promotion.
 * An affiliate at 10 active refs is `starter`, 11 is `growth`, 26 is `elite`.
 * Ambassador track is locked to tier=ambassador regardless of count.
 */
export const TIER_THRESHOLDS = {
  growth: 11,
  elite: 26,
} as const;

/**
 * Commission rates in basis points (1 bps = 0.01%).
 * 25% starter / 30% growth / 40% elite / 20% ambassador.
 * Mirrors fn_current_commission_rate_bps() in the SQL migration.
 */
export const COMMISSION_RATES_BPS: Record<AffiliateTier, number> = {
  starter: 2500,
  growth: 3000,
  elite: 4000,
  ambassador: 2000,
} as const;

/**
 * Clawback window — 60 days from invoice.paid. After this elapses,
 * a pending commission auto-promotes to approved (and thereafter to
 * paid when a payout is cut). A refund after the 60-day mark triggers
 * a NEGATIVE commission row instead of flipping status.
 */
export const CLAWBACK_WINDOW_DAYS = 60;

/**
 * Last-click attribution window. The rd_ref cookie lives 90 days.
 * New clicks overwrite (last-click attribution, not first-click).
 */
export const ATTRIBUTION_WINDOW_DAYS = 90;

export const ATTRIBUTION_COOKIE = {
  name: "rd_ref",
  ttlDays: ATTRIBUTION_WINDOW_DAYS,
  sameSite: "Lax" as const,
  /**
   * NOT HttpOnly — client JS reads the cookie to pass the slug into
   * Stripe Checkout session metadata. Accepted trade-off documented
   * in README; mitigating factor is the slug is public (appears in
   * every affiliate URL), so reading it gains an attacker nothing
   * they couldn't get from the URL.
   */
  httpOnly: false,
} as const;

/**
 * Minimum payout threshold — accumulated net commission must clear
 * this before an affiliate is included in a monthly payout batch.
 * Amount in CAD cents. $50 CAD default.
 */
export const MIN_PAYOUT_CAD_CENTS = 5000;

/**
 * Minimum IP-salt length enforced by hashIpAddress(). Rotating the
 * salt is safe (breaks click dedup; doesn't leak prior hashes).
 */
export const MIN_IP_SALT_LENGTH = 16;

/**
 * Default slug length for generated referral codes. 8 characters over
 * the 31-char unambiguous alphabet = ~40 bits of entropy, well above
 * collision-probable range for a reasonable affiliate count.
 */
export const DEFAULT_SLUG_LENGTH = 8;
