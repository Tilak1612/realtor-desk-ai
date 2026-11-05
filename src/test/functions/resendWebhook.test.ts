import { describe, expect, it } from "vitest";
import {
  emailOf,
  handleResendEvent,
  suppressionFor,
  type EventRow,
  type ResendEvent,
  type SuppressionSource,
  type WebhookStore,
} from "../../../supabase/functions/resend-webhook/handle.ts";

function memoryStore(fail: { log?: boolean; suppress?: boolean } = {}) {
  const events = new Map<string, EventRow>();
  const suppressions = new Map<string, SuppressionSource | string>();
  const store: WebhookStore = {
    async logEvent(row) {
      if (fail.log) return { error: new Error("down") };
      if (!events.has(row.svix_id)) events.set(row.svix_id, row);
      return { error: null };
    },
    async suppress(email, source) {
      if (fail.suppress) return { error: new Error("down") };
      if (!suppressions.has(email)) suppressions.set(email, source);
      return { error: null };
    },
  };
  return { store, events, suppressions };
}

const bounce = (type?: string): ResendEvent => ({
  type: "email.bounced",
  created_at: "2026-10-28T12:00:00.000Z",
  data: {
    email_id: "em_1",
    from: "RealtorDesk AI <support@realtordesk.ai>",
    to: ["Agent@Example.com"],
    subject: "Welcome",
    bounce: type ? { type, subType: "General" } : undefined,
  },
});

describe("resend-webhook event handling", () => {
  it("parses display-name addresses and lowercases them", () => {
    expect(emailOf("RealtorDesk AI <Support@RealtorDesk.ai>")).toBe("support@realtordesk.ai");
    expect(emailOf(" agent@example.com ")).toBe("agent@example.com");
  });

  it("ignores mail sent from another product's domain", async () => {
    const { store, events } = memoryStore();
    const evt = { ...bounce("Permanent"), data: { ...bounce("Permanent").data, from: "hi@petvitale.com" } };
    expect(await handleResendEvent(evt, "msg_1", store)).toEqual({ status: 200, body: { ignored: "other_domain" } });
    expect(events.size).toBe(0);
  });

  it("does not trust a look-alike domain", async () => {
    const { store } = memoryStore();
    const evt = { ...bounce("Permanent"), data: { ...bounce("Permanent").data, from: "x@evilrealtordesk.ai" } };
    expect((await handleResendEvent(evt, "msg_1", store)).body).toEqual({ ignored: "other_domain" });
  });

  it("logs a permanent bounce and suppresses the recipient", async () => {
    const { store, events, suppressions } = memoryStore();
    const res = await handleResendEvent(bounce("Permanent"), "msg_1", store);
    expect(res).toEqual({ status: 200, body: { ok: true, suppressed: 1 } });
    expect(events.get("msg_1")).toMatchObject({
      event_type: "email.bounced",
      recipient: "agent@example.com",
      from_address: "support@realtordesk.ai",
      bounce_type: "Permanent",
    });
    expect(suppressions.get("agent@example.com")).toBe("resend_hard_bounce");
  });

  it("logs a transient bounce without suppressing", async () => {
    const { store, events, suppressions } = memoryStore();
    expect((await handleResendEvent(bounce("Transient"), "msg_1", store)).body).toEqual({ ok: true, suppressed: 0 });
    expect(events.size).toBe(1);
    expect(suppressions.size).toBe(0);
  });

  it("maps each event type to the right suppression", () => {
    expect(suppressionFor({ type: "email.complained" })).toBe("resend_complaint");
    expect(suppressionFor({ type: "email.suppressed" })).toBe("resend_suppressed");
    expect(suppressionFor(bounce())).toBe("resend_hard_bounce");
    expect(suppressionFor({ type: "email.delivery_delayed" })).toBeNull();
    expect(suppressionFor({ type: "email.failed" })).toBeNull();
  });

  it("keeps an existing unsubscribe instead of overwriting its source", async () => {
    const { store, suppressions } = memoryStore();
    suppressions.set("agent@example.com", "unsubscribe_link");
    await handleResendEvent(bounce("Permanent"), "msg_1", store);
    expect(suppressions.get("agent@example.com")).toBe("unsubscribe_link");
  });

  it("is idempotent when Resend retries the same delivery", async () => {
    const { store, events } = memoryStore();
    await handleResendEvent(bounce("Permanent"), "msg_1", store);
    await handleResendEvent(bounce("Permanent"), "msg_1", store);
    expect(events.size).toBe(1);
  });

  it("returns 500 so Resend retries when the database write fails", async () => {
    expect((await handleResendEvent(bounce("Permanent"), "m", memoryStore({ log: true }).store)).status).toBe(500);
    expect((await handleResendEvent(bounce("Permanent"), "m", memoryStore({ suppress: true }).store)).status).toBe(500);
  });
});
