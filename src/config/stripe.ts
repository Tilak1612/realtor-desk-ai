// Stripe price/product IDs, sourced from environment rather than hardcoded.
//
// Test-mode and live-mode IDs differ, so hardcoding them means a code deploy to
// switch modes. Reading them from env makes test↔live a config change.
//
// Frontend vars must be VITE_-prefixed to reach the bundle. Price and product
// IDs are not secrets — they're visible in any checkout request — so shipping
// them in the client bundle is fine.
//
// Deliberately NO fallback to a hardcoded default: a missing var yields an
// empty string, which fails loudly at checkout. Defaulting to the test IDs
// would let a misconfigured production silently take $0 "payments".
//
// Keep in sync with the STRIPE_PRICE_* secrets on the create-checkout function,
// which validates against the same set.

const env = (key: string): string => (import.meta.env[key] as string | undefined) ?? "";

export const STRIPE_PRICES = {
  solo: {
    monthly: env("VITE_STRIPE_PRICE_SOLO_MONTHLY"),
    yearly: env("VITE_STRIPE_PRICE_SOLO_YEARLY"),
  },
  team: {
    monthly: env("VITE_STRIPE_PRICE_TEAM_MONTHLY"),
    yearly: env("VITE_STRIPE_PRICE_TEAM_YEARLY"),
  },
} as const;

export const STRIPE_PRODUCTS = {
  solo: env("VITE_STRIPE_PRODUCT_SOLO"),
  team: env("VITE_STRIPE_PRODUCT_TEAM"),
} as const;

/** True when every price ID needed for checkout is configured. */
export const isStripeConfigured = (): boolean =>
  Object.values(STRIPE_PRICES).every((p) => !!p.monthly && !!p.yearly);

if (import.meta.env.DEV && !isStripeConfigured()) {
  // Dev-only nudge; production surfaces the problem at checkout instead of
  // logging price configuration to visitors' consoles.
  console.warn(
    "[stripe] Missing VITE_STRIPE_PRICE_* env vars — checkout will fail. See .env.example.",
  );
}
