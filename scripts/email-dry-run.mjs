#!/usr/bin/env node
// Offline preview of RealtorDesk email: renders a lifecycle template with
// synthetic data and shows exactly what the outbound guard would hand to
// Resend for a given environment. It NEVER sends: there is no network code
// in this script, and it reads no .env file or secret.
//
//   node scripts/email-dry-run.mjs --table
//   node scripts/email-dry-run.mjs --event trial_ending
//   node scripts/email-dry-run.mjs --event payment_failed --env preview --to someone@example.com
//   node scripts/email-dry-run.mjs --event winback --env production --html
//
// --env is the EMAIL_ENVIRONMENT value to simulate (default: unset). It is
// taken only from the flag, never from this machine's environment.

import { guardOutbound, resolveEmailEnvironment, TEST_INBOX } from "../supabase/functions/_shared/outbound-email.ts";
import { getTemplate, LIFECYCLE_EVENTS } from "../supabase/functions/send-lifecycle-email/templates.ts";

/**
 * Every RealtorDesk email path as the source on this branch wires it. These are
 * observations of code, not of production: they say nothing about which
 * emails were actually sent, to whom, or whether a schedule is configured.
 * "state" is per environment: outside production every send is a test copy to
 * the test inbox, recorded under a test: key, and never advances real state.
 */
export const LIFECYCLE_TABLE = [
  // [email, trigger, template, eligibility, dedup, suppression, retry, state]
  ["welcome", "none found: no caller of send-welcome-email in src/, api/, scripts, migrations or config", "send-welcome-email (inline)", "signed-in user, for themselves only (JWT userId must match)", "once per user (email_events welcome)", "checked", "none", "MISSING trigger (template wired, no caller)"],
  ["onboarding_step1", "none found: nothing emits it", "templates.ts", "service-role caller; known profile", "24h per user", "checked", "none", "MISSING trigger (template only)"],
  ["trial_ending", "Stripe customer.subscription.trial_will_end", "templates.ts", "current Stripe subscription trialing, no cancellation scheduled; exactly one profile for the customer email. Unreadable subscription/customer/profile -> nothing sent, webhook 500; no profile or several -> nothing sent, webhook 200", "Stripe event id (any age) + 24h per user; check-then-send", "checked", "Stripe redelivers on webhook 5xx", "WIRED"],
  ["payment_success", "Stripe invoice.payment_succeeded", "templates.ts", "exactly one profile for the invoice email; lookup error -> nothing sent, webhook 500; none or several -> nothing sent, webhook 200", "Stripe event id + 24h; check-then-send", "checked", "Stripe redelivers on webhook 5xx", "WIRED"],
  ["payment_failed", "Stripe invoice.payment_failed", "templates.ts", "exactly one profile for the invoice email; lookup error -> nothing sent, webhook 500; none or several -> nothing sent, webhook 200", "Stripe event id + 24h; check-then-send", "checked", "Stripe redelivers on webhook 5xx", "WIRED"],
  ["winback", "none found: nothing emits it", "templates.ts", "implied consent", "24h per user", "checked", "none", "MISSING trigger (template only)"],
  ["checkout welcome / trial nudge / cancellation", "Stripe checkout.session.completed, subscription.updated, subscription.deleted", "none: these event types are not accepted by send-lifecycle-email (400 in source)", "-", "-", "-", "400 is permanent: webhook answers 200", "MISMATCH in source; change pending in PR #283 (unmerged), HELD here"],
  ["lifecycle_day3_activation", "lifecycle-cron (CRON_SECRET; schedule not in repo)", "lifecycle-cron (inline)", "trial profile, day 3-4, no contact yet, not is_demo", "once per user (email_events)", "checked", "next cron run", "WIRED (schedule unverified)"],
  ["lifecycle_day7_report", "lifecycle-cron", "lifecycle-cron (inline, built from the user's contact/deal/AI-chat counts)", "trial profile, day 7-8, not is_demo", "once per user", "checked", "next cron run", "WIRED (schedule unverified)"],
  ["lifecycle_day12_trial_ending", "lifecycle-cron", "lifecycle-cron (inline)", "trial profile, 2 days left, not is_demo", "once per user", "checked", "next cron run", "WIRED (schedule unverified); overlaps Stripe trial_ending"],
  ["lifecycle_day14_trial_expired", "lifecycle-cron", "lifecycle-cron (inline)", "trial profile, 0 days left, not is_demo", "once per user", "checked", "next cron run", "WIRED (schedule unverified)"],
  ["automation email", "email-automation (signed-in agent)", "email-automation (inline) + contact unsubscribe link", "agent's own contact", "none (email_log is a write-only record, not read anywhere)", "checked", "none", "WIRED; outside production: no email_log row, nothing scheduled"],
  ["automation sequence email", "run-automation execute_step (signed-in agent)", "step config + contact unsubscribe link", "agent's own contact; enrollment bound to the agent and contact, active, and the requested step equal to its current_step (else 409, nothing sent or written)", "none (progression is conditional on status + current_step; two concurrent requests can both send)", "checked", "failed step does not advance", "WIRED in source, no in-repo caller found; enrollment columns differ from baseline schema"],
  ["re-auth needed", "sync-health-check -> send-reauth-email", "send-reauth-email (inline)", "transactional", "none", "checked", "none", "WIRED"],
  ["unsubscribe link", "/unsubscribe page -> request-unsubscribe-link", "inline", "anyone (the opt-out path)", "5 min per address (email_events)", "not checked (it is the opt-out path)", "none", "WIRED"],
  ["lead magnet delivery", "/lead-magnet page -> send-lead-magnet-email", "inline (links to /unsubscribe)", "requester", "24h per address (lead_magnet_requests)", "checked (fails closed)", "none", "WIRED"],
];

const SAMPLE_DATA = {
  name: "Ann",
  firstName: "Ann",
  days_remaining: 3,
  trial_end_date: "November 7, 2026",
  amount: "$49.00 CAD",
  invoice_id: "in_synthetic_dry_run",
};

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}
const flag = (name) => process.argv.includes(`--${name}`);

function printTable() {
  const head = ["email", "trigger", "template", "eligibility", "dedup", "suppression", "retry", "state"];
  console.log(`| ${head.join(" | ")} |`);
  console.log(`|${head.map(() => "---").join("|")}|`);
  for (const row of LIFECYCLE_TABLE) console.log(`| ${row.join(" | ")} |`);
}

function main() {
  if (flag("send")) {
    console.error("email-dry-run never sends. Nothing was sent.");
    process.exit(2);
  }
  if (flag("table")) return printTable();

  const event = arg("event");
  if (!event || !LIFECYCLE_EVENTS.includes(event)) {
    console.error(`--event must be one of: ${LIFECYCLE_EVENTS.join(", ")} (or use --table)`);
    process.exit(1);
  }
  const to = arg("to") ?? "tilak1111+realtordesk-dryrun@gmail.com";
  const environment = resolveEmailEnvironment(arg("env"));
  const footer = '<p>[CASL footer and signed unsubscribe link, built at send time: /unsubscribe?token=dry-run]</p>';
  const template = getTemplate(event, SAMPLE_DATA, footer);
  const { payload, rerouted } = guardOutbound(
    { from: "RealtorDesk AI <support@realtordesk.ai>", to: [to], subject: template.subject, html: template.html },
    environment,
  );

  console.log("DRY RUN: nothing is sent.");
  console.log(`environment: ${environment}${environment === "production" ? "" : `  (rerouted to ${TEST_INBOX})`}`);
  console.log(`would send to: ${JSON.stringify(payload.to)}   cc/bcc: none`);
  console.log(`subject: ${payload.subject}`);
  console.log(`rerouted: ${rerouted}`);
  console.log(`html: ${payload.html.length} chars${flag("html") ? "\n\n" + payload.html : "  (add --html to print it)"}`);
}

main();
