// Client-side billing facts for pre-checkout disclosure.
//
// AUTHORITY. The trial term is owned by the server: create-checkout sets
// subscription_data.trial_period_days on the Stripe Checkout Session, and that
// session parameter overrides any price-level configuration. TRIAL_PERIOD_DAYS
// here MIRRORS that value so the signup page can disclose it before checkout
// exists. billing.contract.test.ts reads the edge function source and fails if
// the two ever drift, so this cannot silently go stale.
//
// Price IDs are never hardcoded — they come from VITE_STRIPE_PRICE_* via
// src/config/stripe.ts. Amounts below are the published CAD list prices shown
// on /pricing and charged by the live catalogue; they are display-only and are
// never sent to Stripe.
//
// WHAT SIGNUP MAY HONESTLY CLAIM. Signup does not collect a card and does not
// start a trial: it creates an account. The card is collected on the next step
// through Stripe-hosted checkout, and the 14 days begin at that moment. So the
// disclosure must not state "your trial started today" or name a plan the user
// has not chosen. It states the plans available, that nothing is charged at
// signup, and — clearly conditional — what the first charge date would be if
// the trial were started today.

/** Mirrors TRIAL_PERIOD_DAYS in supabase/functions/create-checkout/index.ts. */
export const TRIAL_PERIOD_DAYS = 14;

export const BILLING_CURRENCY = "CAD";

export interface PlanSummary {
  key: "solo" | "team";
  /** i18n key for the plan name; falls back to the English default. */
  nameKey: string;
  nameDefault: string;
  monthlyCad: number;
}

/** Published CAD list prices. Kept in step with /pricing and the live catalogue. */
export const PLAN_SUMMARIES: PlanSummary[] = [
  { key: "solo", nameKey: "rd.plans.solo", nameDefault: "Solo", monthlyCad: 149 },
  { key: "team", nameKey: "rd.plans.team", nameDefault: "Team", monthlyCad: 299 },
];

/** Lowest published monthly price — what "from $X" on signup refers to. */
export const LOWEST_MONTHLY_CAD = Math.min(...PLAN_SUMMARIES.map((p) => p.monthlyCad));

/**
 * The date a trial started right now would first be charged.
 *
 * Computed in the visitor's own timezone (Date arithmetic is local by
 * definition here) and labelled conditionally by the caller — the trial has
 * not started at signup, so this is "if you start today", never "your trial
 * ends on".
 */
export function projectedFirstChargeDate(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + TRIAL_PERIOD_DAYS);
  return d;
}

/** Locale-correct long date. fr-CA renders "28 août 2026". */
export function formatBillingDate(date: Date, language: string | undefined): string {
  const locale = (language || "en").toLowerCase().startsWith("fr") ? "fr-CA" : "en-CA";
  return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

/** Locale-correct CAD amount. fr-CA renders "149 $". */
export function formatCad(amount: number, language: string | undefined): string {
  const locale = (language || "en").toLowerCase().startsWith("fr") ? "fr-CA" : "en-CA";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}
