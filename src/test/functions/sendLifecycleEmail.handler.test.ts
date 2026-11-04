// @vitest-environment node
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDenoEnv, fakeSupabase, HOUR, importEdgeFunction, recordingFetch, req, type Call, type FakeDb, type Row } from "./support/harness";
import { TEST_INBOX } from "../../../supabase/functions/_shared/outbound-email.ts";

// The real send-lifecycle-email handler, offline: URL imports are stubbed, the
// database is the in-memory model in support/harness.ts (filters applied, not
// ignored), and Resend is a recording fetch.

const h = vi.hoisted(() => ({
  handler: null as null | ((r: Request) => Promise<Response>),
  db: null as unknown as FakeDb,
}));
vi.mock("https://deno.land/std@0.190.0/http/server.ts", () => ({ serve: (fn: (r: Request) => Promise<Response>) => { h.handler = fn; } }));
vi.mock("https://esm.sh/@supabase/supabase-js@2", () => ({ createClient: () => h.db.client }));

const SERVICE_KEY = "service-role-synthetic";
const env = fakeDenoEnv({
  SUPABASE_URL: "https://synthetic.invalid",
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
  RESEND_API_KEY: "re_synthetic",
  UNSUBSCRIBE_TOKEN_SECRET: "unsubscribe-secret-synthetic",
});

const NOW = new Date("2026-11-05T12:00:00.000Z");
const USER = { id: "11111111-1111-1111-1111-111111111111", full_name: "Ann Agent" };
const at = (msAgo: number) => new Date(NOW.getTime() - msAgo).toISOString();
let fail: Partial<Record<"dedup" | "replay" | "profile" | "record", boolean>>;

const setup = (emailEvents: Row[] = [], suppressions: Row[] = []) => {
  h.db = fakeSupabase({
    tables: { profiles: [USER], email_events: emailEvents, email_suppressions: suppressions },
    defaults: { email_events: () => ({ sent_at: new Date().toISOString(), metadata: {} }) },
    fail: (c: Call) => {
      const replay = c.filters.some(([, col]) => col === "metadata->>source_event_id");
      if (c.table === "profiles" && fail.profile) return { message: "db down" };
      if (c.table === "email_events" && c.op === "select" && ((replay && fail.replay) || (!replay && fail.dedup))) return { message: "db down" };
      if (c.table === "email_events" && c.op === "insert" && fail.record) return { message: "insert failed" };
      return undefined;
    },
  });
};

const body = (over: Record<string, unknown> = {}) => ({
  eventType: "trial_ending",
  userId: USER.id,
  recipientEmail: "ann.agent@example.com",
  data: { days_remaining: 3, amount: "$49.00 CAD" },
  sourceEventId: "evt_synthetic_1",
  ...over,
});
const asService = { authorization: `Bearer ${SERVICE_KEY}` };

beforeAll(async () => {
  setup();
  await importEdgeFunction("send-lifecycle-email");
});

let resend: ReturnType<typeof recordingFetch>;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  fail = {};
  env.EMAIL_ENVIRONMENT = "production";
  setup();
  resend = recordingFetch();
});
afterEach(() => {
  expect(h.db.unsupported).toEqual([]);
  vi.useRealTimers();
});

const call = async (r: Request) => {
  const res = await h.handler!(r);
  return { status: res.status, json: await res.json() };
};
const events = () => h.db.tables.email_events;

describe("send-lifecycle-email: who may call it", () => {
  it.each([
    ["no Authorization header", {}],
    ["the public anon key", { authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.anon-synthetic" }],
    ["a signed-in user's token", { authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.user-synthetic" }],
    ["an anon apikey header", { apikey: "anon-synthetic" }],
    ["a near-miss of the service key", { authorization: `Bearer ${SERVICE_KEY}x` }],
  ])("refuses %s: 401, no database read, no email", async (_what, headers) => {
    const res = await call(req(body(), headers));
    expect(res.status).toBe(401);
    expect(h.db.calls).toEqual([]);
    expect(resend.fn).not.toHaveBeenCalled();
  });

  it("refuses an arbitrary target account even from the service caller: unknown userId gets 404 and no email", async () => {
    const res = await call(req(body({ userId: "99999999-9999-9999-9999-999999999999" }), asService));
    expect(res.status).toBe(404);
    expect(resend.fn).not.toHaveBeenCalled();
    expect(h.db.writes()).toEqual([]);
  });

  it("accepts the service-role key in the apikey header too", async () => {
    expect((await call(req(body(), { apikey: SERVICE_KEY }))).status).toBe(200);
  });
});

describe("send-lifecycle-email: the 24 h dedup window", () => {
  it("queries exactly user, delivery key and sent_at >= now - 24 h", async () => {
    await call(req(body(), asService));
    const dedup = h.db.reads("email_events").find((c) => c.filters.some(([k]) => k === "gte"));
    expect(dedup?.filters).toEqual([
      ["eq", "user_id", USER.id],
      ["eq", "event_type", "trial_ending"],
      ["gte", "sent_at", at(24 * HOUR)],
    ]);
  });

  it.each([
    ["1 minute inside the window", 24 * HOUR - 60_000, true],
    ["exactly at the boundary (gte is inclusive)", 24 * HOUR, true],
    ["1 minute outside the window", 24 * HOUR + 60_000, false],
    ["a week ago", 7 * 24 * HOUR, false],
  ])("an earlier send %s: deduplicated = %s", async (_what, ago, deduped) => {
    setup([{ id: "e0", user_id: USER.id, event_type: "trial_ending", sent_at: at(ago as number), metadata: {} }]);
    const res = await call(req(body({ sourceEventId: "evt_new" }), asService));
    expect(res.status).toBe(200);
    expect(resend.sent).toHaveLength(deduped ? 0 : 1);
  });

  it("another user's or another event's recent send does not deduplicate", async () => {
    setup([
      { id: "e1", user_id: "someone-else", event_type: "trial_ending", sent_at: at(HOUR), metadata: {} },
      { id: "e2", user_id: USER.id, event_type: "payment_success", sent_at: at(HOUR), metadata: {} },
    ]);
    await call(req(body(), asService));
    expect(resend.sent).toHaveLength(1);
  });

  it("a replayed Stripe event is skipped whatever its age, beyond the 24 h window", async () => {
    setup([{ id: "e3", user_id: USER.id, event_type: "trial_ending", sent_at: at(10 * 24 * HOUR), metadata: { source_event_id: "evt_synthetic_1" } }]);
    const res = await call(req(body(), asService));
    expect(res.json).toMatchObject({ duplicate: true });
    expect(resend.fn).not.toHaveBeenCalled();
  });
});

describe("send-lifecycle-email: production delivery", () => {
  it("sends to the real recipient and records the event under its real key with the Stripe event id", async () => {
    const res = await call(req(body(), asService));
    expect(res).toMatchObject({ status: 200, json: { success: true, rerouted: false, recorded: true } });
    expect(resend.sent).toHaveLength(1);
    expect(resend.sent[0].payload.to).toEqual(["ann.agent@example.com"]);
    expect(events()).toHaveLength(1);
    expect(events()[0]).toMatchObject({ event_type: "trial_ending", sent_at: NOW.toISOString(), metadata: { source_event_id: "evt_synthetic_1", rerouted: false } });
  });

  it("a redelivered Stripe event (same source event id) sends nothing more", async () => {
    await call(req(body(), asService));
    const again = await call(req(body(), asService));
    expect(again.json).toMatchObject({ duplicate: true });
    expect(resend.sent).toHaveLength(1);
  });

  it("a provider failure is a 500 and records nothing, so the caller can retry", async () => {
    resend.failWith(503);
    const res = await call(req(body(), asService));
    expect(res.status).toBe(500);
    expect(events()).toEqual([]);
  });

  it.each(["dedup", "replay", "profile"] as const)("a failed %s lookup sends nothing and answers 500", async (which) => {
    fail[which] = true;
    const res = await call(req(body(), asService));
    expect(res.status).toBe(500);
    expect(resend.fn).not.toHaveBeenCalled();
  });

  it("a sent email whose record could not be written answers 200 with recorded:false (a retry would send it twice)", async () => {
    fail.record = true;
    const res = await call(req(body(), asService));
    expect(res).toMatchObject({ status: 200, json: { success: true, recorded: false } });
    expect(resend.sent).toHaveLength(1);
  });

  it("a suppressed recipient gets nothing", async () => {
    setup([], [{ email: "ann.agent@example.com", source: "unsubscribe_link" }]);
    const res = await call(req(body(), asService));
    expect(res.json).toMatchObject({ suppressed: true });
    expect(resend.fn).not.toHaveBeenCalled();
  });
});

describe("send-lifecycle-email: test copies never touch production state", () => {
  it.each(["preview", "staging", "development", "test", undefined])("EMAIL_ENVIRONMENT=%s: test inbox only, recorded under a test key", async (e) => {
    env.EMAIL_ENVIRONMENT = e;
    const res = await call(req(body(), asService));
    const label = e ?? "unknown";
    expect(res.json).toMatchObject({ success: true, rerouted: true });
    expect(resend.sent[0].payload.to).toEqual([TEST_INBOX]);
    expect(events().map((r) => r.event_type)).toEqual([`test:${label}:trial_ending`]);
  });

  it("a real production send inside the window does not stop a test copy, and the test copy leaves it alone", async () => {
    setup([{ id: "p0", user_id: USER.id, event_type: "trial_ending", sent_at: at(HOUR), metadata: { source_event_id: "evt_synthetic_1" } }]);
    env.EMAIL_ENVIRONMENT = "preview";
    await call(req(body(), asService));
    expect(resend.sent).toHaveLength(1);
    expect(events().filter((r) => r.event_type === "trial_ending")).toHaveLength(1);
  });

  it("a test copy (shared database, or production with EMAIL_ENVIRONMENT unset) does not consume the real user's email", async () => {
    env.EMAIL_ENVIRONMENT = undefined; // misconfigured production
    await call(req(body(), asService));
    env.EMAIL_ENVIRONMENT = "production"; // fixed
    const real = await call(req(body(), asService));
    expect(real.json).toMatchObject({ rerouted: false });
    expect(resend.sent.map((s) => s.payload.to)).toEqual([[TEST_INBOX], ["ann.agent@example.com"]]);
  });

  it("repeated test sends are deduplicated among themselves within 24 h, and not after", async () => {
    env.EMAIL_ENVIRONMENT = "preview";
    await call(req(body(), asService));
    const second = await call(req(body({ sourceEventId: "evt_synthetic_2" }), asService));
    expect(second.json.message).toMatch(/already sent recently/);
    vi.setSystemTime(new Date(NOW.getTime() + 24 * HOUR + 60_000));
    await call(req(body({ sourceEventId: "evt_synthetic_3" }), asService));
    expect(resend.sent).toHaveLength(2);
  });

  it("a failed test send records nothing", async () => {
    env.EMAIL_ENVIRONMENT = "preview";
    resend.failWith(500);
    expect((await call(req(body(), asService))).status).toBe(500);
    expect(events()).toEqual([]);
  });
});
