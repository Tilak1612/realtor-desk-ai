// @vitest-environment node
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDenoEnv, fakeSupabase, importEdgeFunction, invokeError, req, type Call, type FakeDb, type Row } from "./support/harness";

// The real stripe-webhook-email handler, offline. Stripe is a stub: signature
// verification returns the event under test (the real constructEventAsync is
// NOT exercised), and subscriptions/customers are answered from memory. The
// database is the in-memory model; send-lifecycle-email is a recorded invoke.

const h = vi.hoisted(() => ({
  handler: null as null | ((r: Request) => Promise<Response>),
  db: null as unknown as FakeDb,
  event: null as unknown,
  current: null as unknown,
  subscriptionError: null as Error | null,
  customerError: null as Error | null,
  retrieved: [] as string[],
}));
vi.mock("https://deno.land/std@0.190.0/http/server.ts", () => ({ serve: (fn: (r: Request) => Promise<Response>) => { h.handler = fn; } }));
vi.mock("https://esm.sh/@supabase/supabase-js@2", () => ({ createClient: () => h.db.client }));
vi.mock("https://esm.sh/stripe@14.21.0?target=deno", () => {
  class Stripe {
    static createSubtleCryptoProvider() { return {}; }
    webhooks = { constructEventAsync: async () => { if (!h.event) throw new Error("bad signature"); return h.event; } };
    subscriptions = {
      retrieve: async (id: string) => { h.retrieved.push(id); if (h.subscriptionError) throw h.subscriptionError; return h.current; },
    };
    customers = { retrieve: async () => { if (h.customerError) throw h.customerError; return { id: "cus_1", email: "ann.agent@example.com" }; } };
  }
  return { default: Stripe };
});

fakeDenoEnv({
  STRIPE_SECRET_KEY: "sk_synthetic",
  STRIPE_WEBHOOK_SECRET: "wh_synthetic",
  SUPABASE_URL: "https://synthetic.invalid",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-synthetic",
});

const PROFILE = { id: "11111111-1111-1111-1111-111111111111", full_name: "Ann Agent", email: "ann.agent@example.com" };
let profileFails = false;
const setup = (profiles: Row[] = [PROFILE]) => {
  h.db = fakeSupabase({
    tables: { profiles },
    fail: (c: Call) => (c.table === "profiles" && profileFails ? { message: "connection reset", code: "08006" } : undefined),
  });
};

const sub = (over: Record<string, unknown> = {}) => ({
  id: "sub_1", customer: "cus_1", status: "trialing", cancel_at_period_end: false, cancel_at: null,
  trial_end: 1_793_800_000, items: { data: [{ price: { unit_amount: 4900, currency: "cad" } }] }, ...over,
});
const trialEvent = (snapshot: Record<string, unknown> = {}) => ({
  id: "evt_trial_1", type: "customer.subscription.trial_will_end", data: { object: sub(snapshot) },
});
const invoiceEvent = (type = "invoice.payment_failed") => ({
  id: "evt_inv_1", type, data: { object: { id: "in_1", customer_email: PROFILE.email, amount_paid: 0, currency: "cad" } },
});
const signed = (e: unknown) => { h.event = e; return req({}, { "stripe-signature": "t=1,v1=synthetic" }); };

beforeAll(async () => {
  setup();
  await importEdgeFunction("stripe-webhook-email");
});
beforeEach(() => {
  profileFails = false;
  setup();
  h.current = sub();
  h.subscriptionError = null;
  h.customerError = null;
  h.retrieved = [];
});
afterEach(() => expect(h.db.unsupported).toEqual([]));
const run = async (r: Request) => (await h.handler!(r)).status;

describe("trial_will_end decides on the subscription as it is now", () => {
  it("sends trial_ending for a subscription still trialing, passing the Stripe event id", async () => {
    expect(await run(signed(trialEvent()))).toBe(200);
    expect(h.retrieved).toEqual(["sub_1"]);
    expect(h.db.invokes).toHaveLength(1);
    expect(h.db.invokes[0]).toMatchObject({ name: "send-lifecycle-email", body: { eventType: "trial_ending", userId: PROFILE.id, sourceEventId: "evt_trial_1" } });
  });

  it.each([
    ["set to cancel at period end since the event", { cancel_at_period_end: true }],
    ["given a cancellation date since the event", { cancel_at: 1_793_900_000 }],
    ["cancelled since the event", { status: "canceled" }],
    ["active since the event (trial ended early)", { status: "active" }],
  ])("a stale trialing snapshot sends nothing when the subscription is now %s", async (_what, now) => {
    h.current = sub(now);
    expect(await run(signed(trialEvent()))).toBe(200);
    expect(h.db.invokes).toEqual([]);
  });

  it("a snapshot that said cancelling, for a subscription since resumed, still sends (current state wins)", async () => {
    expect(await run(signed(trialEvent({ cancel_at_period_end: true })))).toBe(200);
    expect(h.db.invokes).toHaveLength(1);
  });

  it("an unreadable current subscription sends nothing and asks Stripe to retry (500)", async () => {
    h.subscriptionError = new Error("stripe unavailable");
    expect(await run(signed(trialEvent()))).toBe(500);
    expect(h.db.invokes).toEqual([]);
  });

  it("an unreadable customer sends nothing and asks Stripe to retry (500)", async () => {
    h.customerError = new Error("stripe unavailable");
    expect(await run(signed(trialEvent()))).toBe(500);
    expect(h.db.invokes).toEqual([]);
  });
});

describe.each([
  ["trial_will_end", () => trialEvent()],
  ["invoice.payment_failed", () => invoiceEvent()],
  ["invoice.payment_succeeded", () => invoiceEvent("invoice.payment_succeeded")],
])("%s: the profile lookup", (_name, event) => {
  it("a database error is unknown state: no callee attempt, 500 so Stripe retries", async () => {
    profileFails = true;
    expect(await run(signed(event()))).toBe(500);
    expect(h.db.invokes).toEqual([]);
  });

  it.each([
    ["no id", { full_name: "Ann Agent", email: PROFILE.email }],
    ["a non-string id", { id: 42, full_name: "Ann Agent", email: PROFILE.email }],
    ["an empty id", { id: "", full_name: "Ann Agent", email: PROFILE.email }],
  ])("a malformed row (%s) is unknown state: no callee attempt, 500", async (_what, row) => {
    setup([row]);
    expect(await run(signed(event()))).toBe(500);
    expect(h.db.invokes).toEqual([]);
  });

  it("several profiles with that email is an ambiguous mapping: no callee attempt, 200 (retrying cannot resolve it)", async () => {
    setup([PROFILE, { ...PROFILE, id: "22222222-2222-2222-2222-222222222222" }]);
    expect(await run(signed(event()))).toBe(200);
    expect(h.db.invokes).toEqual([]);
  });

  it("a verified absent user: no callee attempt, 200 (no endless retries)", async () => {
    setup([]);
    expect(await run(signed(event()))).toBe(200);
    expect(h.db.invokes).toEqual([]);
  });

  it("a valid row: the callee is invoked with that user and the Stripe event id", async () => {
    expect(await run(signed(event()))).toBe(200);
    expect(h.db.invokes).toHaveLength(1);
    expect(h.db.invokes[0].body).toMatchObject({ userId: PROFILE.id, sourceEventId: (event() as { id: string }).id });
  });

  it("a callee failure after a valid lookup is a 500", async () => {
    h.db.setInvokeResult({ data: null, error: invokeError(503) });
    expect(await run(signed(event()))).toBe(500);
  });

  it("redelivery after a transient lookup failure invokes the callee once, with the same event id", async () => {
    profileFails = true;
    expect(await run(signed(event()))).toBe(500);
    profileFails = false;
    expect(await run(signed(event()))).toBe(200);
    expect(h.db.invokes).toHaveLength(1);
    expect((h.db.invokes[0].body as { sourceEventId: string }).sourceEventId).toBe((event() as { id: string }).id);
  });
});

describe("the webhook's answer reflects what happened to the email", () => {
  it.each([
    [500, 500], [503, 500], [401, 500], [429, 500],
    [400, 200], [404, 200], [422, 200],
  ])("send-lifecycle-email %i -> webhook %i", async (calleeStatus, webhookStatus) => {
    h.db.setInvokeResult({ data: null, error: invokeError(calleeStatus) });
    expect(await run(signed(trialEvent()))).toBe(webhookStatus);
  });

  it("a network-level invoke failure asks Stripe to retry", async () => {
    h.db.setInvokeResult({ data: null, error: new Error("fetch failed") });
    expect(await run(signed(trialEvent()))).toBe(500);
  });

  it("each redelivery of one event carries the same event id (send-lifecycle-email skips the repeat)", async () => {
    await run(signed(trialEvent()));
    await run(signed(trialEvent()));
    expect(h.db.invokes.map((i) => (i.body as { sourceEventId: string }).sourceEventId)).toEqual(["evt_trial_1", "evt_trial_1"]);
  });

  it("a bad signature is refused before anything else", async () => {
    h.event = null;
    expect(await run(req({}, { "stripe-signature": "t=1,v1=forged" }))).toBe(400);
    expect(h.retrieved).toEqual([]);
    expect(h.db.invokes).toEqual([]);
  });
});
