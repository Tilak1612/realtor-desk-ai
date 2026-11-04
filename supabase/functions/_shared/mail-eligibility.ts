// Who a scheduled or Stripe-driven email may go to. No imports, so vitest can
// load it (src/test/functions/) as well as Deno.

/**
 * Scheduled mail (lifecycle-cron) skips demo workspaces. Only the explicit
 * profiles.is_demo flag counts: nothing is inferred from names or domains.
 * Transactional mail the person asked for (password, unsubscribe link,
 * re-auth) is not filtered here.
 */
export function isExcludedFromScheduledMail(profile: { is_demo?: boolean | null }): boolean {
  return profile.is_demo === true;
}

/** The subscription fields Stripe sends with customer.subscription.trial_will_end. */
export interface TrialSubscription {
  status?: string | null;
  cancel_at_period_end?: boolean | null;
  cancel_at?: number | null;
}

/**
 * The trial_ending email tells the customer their card "will be charged ...
 * automatically when the trial ends". That is only true for a subscription
 * still in its trial with no cancellation scheduled; for one already
 * cancelled, or set to cancel at the end of the trial, the email would be
 * false and is not sent.
 */
export function trialEndingApplies(sub: TrialSubscription): boolean {
  return sub.status === "trialing" && sub.cancel_at_period_end !== true && sub.cancel_at == null;
}
