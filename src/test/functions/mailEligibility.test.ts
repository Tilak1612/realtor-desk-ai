import { describe, expect, it } from "vitest";
import { isExcludedFromScheduledMail, trialEndingApplies } from "../../../supabase/functions/_shared/mail-eligibility.ts";
import { getTemplate, LIFECYCLE_EVENTS } from "../../../supabase/functions/send-lifecycle-email/templates.ts";

describe("scheduled mail skips demo workspaces", () => {
  it("excludes only an explicit is_demo flag", () => {
    expect(isExcludedFromScheduledMail({ is_demo: true })).toBe(true);
    expect(isExcludedFromScheduledMail({ is_demo: false })).toBe(false);
    expect(isExcludedFromScheduledMail({ is_demo: null })).toBe(false);
    expect(isExcludedFromScheduledMail({})).toBe(false);
  });

  it("infers nothing from a demo-looking name or address", () => {
    const lookalike = { is_demo: false, email: "demo@realtordesk.ai", full_name: "Demo Account" };
    expect(isExcludedFromScheduledMail(lookalike)).toBe(false);
  });
});

describe("trial_ending is sent only while it is true", () => {
  it("applies to a trial with no cancellation scheduled", () => {
    expect(trialEndingApplies({ status: "trialing", cancel_at_period_end: false, cancel_at: null })).toBe(true);
  });

  it.each([
    ["set to cancel at the end of the trial", { status: "trialing", cancel_at_period_end: true, cancel_at: null }],
    ["with a cancellation date", { status: "trialing", cancel_at_period_end: false, cancel_at: 1_793_600_000 }],
    ["already cancelled", { status: "canceled", cancel_at_period_end: false, cancel_at: null }],
    ["no longer trialing (active)", { status: "active", cancel_at_period_end: false, cancel_at: null }],
    ["past due", { status: "past_due", cancel_at_period_end: false, cancel_at: null }],
    ["missing status", { cancel_at_period_end: false }],
  ])("does not apply to a subscription %s", (_what, sub) => {
    expect(trialEndingApplies(sub)).toBe(false);
  });

  it("because its template promises an automatic charge", () => {
    const t = getTemplate("trial_ending", { days_remaining: 3, amount: "$49.00 CAD" }, "");
    expect(t?.subject).toMatch(/card will be charged/);
    expect(t?.html).toMatch(/will be charged \$49\.00 CAD automatically/);
  });
});

describe("lifecycle templates", () => {
  it.each(LIFECYCLE_EVENTS)("%s renders with the CASL footer and no undefined values", (event) => {
    const t = getTemplate(event, { name: "Ann", days_remaining: 3, amount: "$49.00 CAD", trial_end_date: "November 7, 2026" }, "<p>FOOTER</p>");
    expect(t).not.toBeNull();
    expect(t!.subject.length).toBeGreaterThan(0);
    expect(t!.html).toContain("<p>FOOTER</p>");
    expect(t!.html).not.toMatch(/\bundefined\b/);
  });

  it("has no template for an unknown event", () => {
    expect(getTemplate("realtordesk_subscription_cancelled", {}, "")).toBeNull();
  });
});
