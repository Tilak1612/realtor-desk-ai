import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Source inventory of every edge function that sends email. Reads files only;
 * runs no function and calls nothing. It fails when a send path bypasses the
 * outbound guard, when a commercial path drops its suppression check, or when
 * a new event type is emitted that send-lifecycle-email does not accept.
 */

const FN = join(process.cwd(), "supabase", "functions");
const functions = readdirSync(FN).filter((d) => d !== "_shared" && existsSync(join(FN, d, "index.ts")));
const src = (fn: string) => readFileSync(join(FN, fn, "index.ts"), "utf8");
const senders = functions.filter((fn) => /RESEND_API_KEY/.test(src(fn)));

describe("email send paths", () => {
  it("are the eight known senders", () => {
    expect(senders.sort()).toEqual([
      "email-automation",
      "lifecycle-cron",
      "request-unsubscribe-link",
      "run-automation",
      "send-lead-magnet-email",
      "send-lifecycle-email",
      "send-reauth-email",
      "send-welcome-email",
    ]);
  });

  it.each(senders)("%s sends only through the outbound guard", (fn) => {
    const s = src(fn);
    expect(s).toMatch(/from "\.\.\/_shared\/outbound-email\.ts"/);
    expect(s).toMatch(/\bsendEmail\(/);
    expect(s).not.toMatch(/api\.resend\.com/);
    expect(s).not.toMatch(/new Resend\(|resend\.emails\.|resend\.batch/);
  });

  it.each(senders)("%s treats only status \"sent\" as sent", (fn) => {
    expect(src(fn)).toMatch(/\.status !== "sent"/);
  });

  // The opt-out mail itself is the one path that does not consult the
  // suppression list: it is how a person gets on it.
  const SUPPRESSION_EXEMPT = ["request-unsubscribe-link"];
  it.each(senders.filter((s) => !SUPPRESSION_EXEMPT.includes(s)))("%s checks the suppression list before sending", (fn) => {
    const s = src(fn);
    expect(s).toMatch(/isEmailSuppressed\(/);
    expect(s.indexOf("isEmailSuppressed(")).toBeLessThan(s.indexOf("sendEmail("));
  });

  it.each(senders.filter((s) => /email_events/.test(src(s))))(
    "%s records and deduplicates email_events under the delivery-mode key",
    (fn) => {
      const s = src(fn);
      expect(s).toMatch(/deliveryEventKey\(/);
      expect(s).not.toMatch(/event_type: "(welcome|unsubscribe_link_request)"/);
      expect(s).not.toMatch(/\.eq\("event_type", (eventType|"welcome"|"unsubscribe_link_request")\)/);
    },
  );

  it("send-lifecycle-email refuses any caller but the service role before touching the database", () => {
    const s = src("send-lifecycle-email");
    expect(s.indexOf("isServiceRoleCaller(req.headers")).toBeGreaterThan(-1);
    expect(s.indexOf("isServiceRoleCaller(req.headers")).toBeLessThan(s.indexOf("createClient(supabaseUrl"));
  });

  it("run-automation verifies the enrollment's owner, contact and state before any write", () => {
    const s = src("run-automation");
    const step = s.slice(s.indexOf('action === "execute_step"'));
    const lookup = step.indexOf('.from("automation_enrollments")\n        .select("id, status, current_step")');
    expect(lookup).toBeGreaterThan(-1);
    expect(lookup).toBeLessThan(step.indexOf(".update("));
    // One lookup and one conditional progression helper; every progression
    // write goes through the helper (no other enrollment update remains).
    expect(step.match(/\.eq\("id", enrollmentId\)\s*\.eq\("user_id", user\.id\)\s*\.eq\("contact_id", contactId\)/g)?.length).toBe(2);
    expect(step).toMatch(/\.eq\("contact_id", contactId\)\s*\.eq\("status", "active"\)\s*\.eq\("current_step", stepIndex\)/);
    expect(step.match(/\.from\("automation_enrollments"\)/g)?.length).toBe(2);
  });

  it("run-automation fails the step when the send fails", () => {
    expect(src("run-automation")).toMatch(/if \(emailResult\.status !== "sent"\) \{\s*throw new Error/);
  });

  it("lifecycle-cron skips demo workspaces before any send", () => {
    const s = src("lifecycle-cron");
    expect(s).toMatch(/is_demo"\)/);
    expect(s.indexOf("isExcludedFromScheduledMail(user)")).toBeLessThan(s.indexOf("sendEmail("));
  });

  it("stripe-webhook-email checks the trial is still live before trial_ending", () => {
    const s = src("stripe-webhook-email");
    const branch = s.slice(s.indexOf('event.type === "customer.subscription.trial_will_end"'));
    expect(branch.indexOf("trialEndingApplies(subscription)")).toBeGreaterThan(-1);
    expect(branch.indexOf("trialEndingApplies(subscription)")).toBeLessThan(branch.indexOf('eventType: "trial_ending"'));
  });
});

describe("stripe-webhook-email event types", () => {
  // Emitted on main but not accepted by send-lifecycle-email, so each call
  // gets a 400 and no email is sent. The change for these is pending in
  // PR #283 (unmerged) and is held here; listed so a new mismatch still fails.
  const HELD_MISMATCHES = ["realtordesk_onboarding_trialnudge", "realtordesk_onboarding_welcome", "realtordesk_subscription_cancelled"];

  it("emits nothing send-lifecycle-email rejects, apart from the held three", async () => {
    const { LIFECYCLE_EVENTS } = await import("../../../supabase/functions/send-lifecycle-email/templates.ts");
    const emitted = [...src("stripe-webhook-email").matchAll(/eventType: "([a-z_]+)"/g)].map((m) => m[1]);
    const rejected = [...new Set(emitted.filter((e) => !(LIFECYCLE_EVENTS as readonly string[]).includes(e)))].sort();
    expect(rejected).toEqual(HELD_MISMATCHES);
  });
});
