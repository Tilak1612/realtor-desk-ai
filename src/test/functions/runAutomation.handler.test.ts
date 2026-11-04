// @vitest-environment node
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDenoEnv, fakeSupabase, importEdgeFunction, recordingFetch, req, type Call, type FakeDb, type Row } from "./support/harness";
import { TEST_INBOX } from "../../../supabase/functions/_shared/outbound-email.ts";

// The real run-automation handler, offline. Two workspaces share the in-memory
// database: the caller (u1) and another (u2) whose enrollment must stay
// untouched however its id is presented. Enrollment rows use the columns the
// baseline schema documents (user_id, contact_id, status, current_step); this
// function's automation_id link is not in that schema and is not modelled.

const h = vi.hoisted(() => ({
  handler: null as null | ((r: Request) => Promise<Response>),
  db: null as unknown as FakeDb,
}));
vi.mock("https://deno.land/std@0.190.0/http/server.ts", () => ({ serve: (fn: (r: Request) => Promise<Response>) => { h.handler = fn; } }));
vi.mock("https://esm.sh/@supabase/supabase-js@2", () => ({ createClient: () => h.db.client }));

const env = fakeDenoEnv({
  SUPABASE_URL: "https://synthetic.invalid",
  SUPABASE_ANON_KEY: "anon-synthetic",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-synthetic",
  RESEND_API_KEY: "re_synthetic",
  UNSUBSCRIBE_TOKEN_SECRET: "unsubscribe-secret-synthetic",
});

const enrollment = (over: Row = {}): Row => ({ id: "enr-own", user_id: "u1", contact_id: "c1", status: "active", current_step: 0, ...over });
const emailStep = (order: number, body = "Checking in."): Row => ({ id: `step-${order}`, automation_id: "auto-1", step_order: order, action_type: "send_email", action_config: { subject: "Hi {{first_name}}", body } });
let failEnrollmentLookup = false;

const setup = (opts: { enrollments?: Row[]; steps?: Row[] } = {}) => {
  h.db = fakeSupabase({
    tables: {
      email_automations: [{ id: "auto-1", user_id: "u1" }],
      contacts: [
        { id: "c1", user_id: "u1", first_name: "Bea", last_name: "Lee", email: "bea.contact@example.com", tags: [] },
        { id: "c9", user_id: "u2", first_name: "Other", last_name: "Tenant", email: "other.contact@example.org", tags: [] },
      ],
      automation_steps: opts.steps ?? [emailStep(0), emailStep(1)],
      automation_enrollments: opts.enrollments ?? [enrollment(), { id: "enr-victim", user_id: "u2", contact_id: "c9", status: "active", current_step: 0 }],
      email_suppressions: [],
    },
    fail: (c: Call) => (c.table === "automation_enrollments" && c.op === "select" && failEnrollmentLookup ? { message: "db down" } : undefined),
  });
  h.db.setUser({ id: "u1", email: "agent.one@example.com" });
};

const step = (over: Record<string, unknown> = {}) =>
  req({ automationId: "auto-1", contactId: "c1", action: "execute_step", enrollmentId: "enr-own", stepIndex: 0, ...over }, { authorization: "Bearer user-jwt-synthetic" });

beforeAll(async () => {
  setup();
  await importEdgeFunction("run-automation");
});
let resend: ReturnType<typeof recordingFetch>;
beforeEach(() => {
  failEnrollmentLookup = false;
  env.EMAIL_ENVIRONMENT = "production";
  setup();
  resend = recordingFetch();
});
afterEach(() => expect(h.db.unsupported).toEqual([]));

const run = async (r: Request) => { const res = await h.handler!(r); return { status: res.status, json: await res.json() }; };
const enrollmentWrites = () => h.db.writes().filter((w) => w.table === "automation_enrollments");
const own = () => h.db.tables.automation_enrollments.find((e) => e.id === "enr-own")!;

describe("run-automation execute_step binds the enrollment to the caller", () => {
  it.each([
    ["a forged enrollment id", { enrollmentId: "enr-does-not-exist" }],
    ["another workspace's enrollment id", { enrollmentId: "enr-victim" }],
    ["another workspace's enrollment id, past the last step", { enrollmentId: "enr-victim", stepIndex: 99 }],
  ])("%s: 404, no write of any kind, no email", async (_what, over) => {
    const res = await run(step(over));
    expect(res.status).toBe(404);
    expect(h.db.writes()).toEqual([]);
    expect(resend.fn).not.toHaveBeenCalled();
  });

  it("a failed enrollment lookup: 500, no write, no email", async () => {
    failEnrollmentLookup = true;
    expect((await run(step())).status).toBe(500);
    expect(h.db.writes()).toEqual([]);
    expect(resend.fn).not.toHaveBeenCalled();
  });
});

describe("run-automation execute_step only runs the enrollment's current step while it is active", () => {
  it.each([
    ["completed", { status: "completed" }],
    ["cancelled", { status: "cancelled" }],
  ])("a %s enrollment: 409, no email, no write", async (_what, over) => {
    setup({ enrollments: [enrollment(over)] });
    const res = await run(step());
    expect(res.status).toBe(409);
    expect(resend.fn).not.toHaveBeenCalled();
    expect(h.db.writes()).toEqual([]);
  });

  it.each([
    ["a step already done (stale request)", { current_step: 1 }, 0],
    ["a step ahead of the enrollment", { current_step: 0 }, 1],
    ["a non-integer step", { current_step: 0 }, "0"],
    ["a negative step", { current_step: 0 }, -1],
  ])("%s: 409, no email, no write", async (_what, over, stepIndex) => {
    setup({ enrollments: [enrollment(over)] });
    const res = await run(step({ stepIndex }));
    expect(res.status).toBe(409);
    expect(resend.fn).not.toHaveBeenCalled();
    expect(h.db.writes()).toEqual([]);
  });

  it("the enrollment lookup filters on id, user, contact and reads status and current_step", async () => {
    await run(step());
    const lookup = h.db.reads("automation_enrollments")[0];
    expect(lookup.filters).toEqual([["eq", "id", "enr-own"], ["eq", "user_id", "u1"], ["eq", "contact_id", "c1"]]);
    expect(lookup.terminal).toBe("maybeSingle");
  });

  it("the current step of an active enrollment: email sent, then advanced only from that step and status", async () => {
    const res = await run(step());
    expect(res.json).toMatchObject({ success: true, status: "success" });
    expect(resend.sent[0].payload.to).toEqual(["bea.contact@example.com"]);
    const [advance] = enrollmentWrites();
    expect(advance).toMatchObject({ op: "update", payload: { current_step: 1 } });
    expect(advance.filters).toEqual([
      ["eq", "id", "enr-own"], ["eq", "user_id", "u1"], ["eq", "contact_id", "c1"],
      ["eq", "status", "active"], ["eq", "current_step", 0],
    ]);
    expect(own()).toMatchObject({ current_step: 1, status: "active" });
  });

  it("then the next step runs, and the same step again is refused", async () => {
    await run(step());
    expect((await run(step({ stepIndex: 1 }))).json).toMatchObject({ status: "success" });
    expect((await run(step({ stepIndex: 1 }))).status).toBe(409);
    expect(resend.sent).toHaveLength(2);
    expect(own().current_step).toBe(2);
  });

  it("past the last step: completed once, only from the current step", async () => {
    setup({ enrollments: [enrollment({ current_step: 2 })] });
    expect((await run(step({ stepIndex: 2 }))).json).toMatchObject({ message: "Automation completed" });
    expect(own()).toMatchObject({ status: "completed" });
    expect((await run(step({ stepIndex: 2 }))).status).toBe(409);
    expect(resend.fn).not.toHaveBeenCalled();
  });

  it("two concurrent requests for one step advance it once; both may still send (not exactly-once)", async () => {
    const [a, b] = await Promise.all([run(step()), run(step())]);
    expect(own().current_step).toBe(1);
    const advanced = [a.json.advanced, b.json.advanced].filter(Boolean);
    expect(advanced).toHaveLength(1);
    // The send happens before the conditional advance, so both requests can
    // reach the provider. This test records the race; it does not hide it.
    expect(resend.sent.length).toBeGreaterThanOrEqual(1);
    expect(resend.sent.length).toBeLessThanOrEqual(2);
  });

  it("a provider failure fails the step and does not advance", async () => {
    resend.failWith(500);
    const res = await run(step());
    expect(res.json).toMatchObject({ success: false, status: "failed" });
    expect(enrollmentWrites()).toEqual([]);
    expect(own().current_step).toBe(0);
  });

  it("the email carries the contact's own signed unsubscribe link", async () => {
    await run(step());
    expect(String(resend.sent[0].payload.html)).toMatch(/https:\/\/www\.realtordesk\.ai\/unsubscribe\?token=[\w.-]+/);
    expect(String(resend.sent[0].payload.html)).toContain("Unsubscribe from these emails");
  });
});

describe("run-automation test copies do not move real enrollments", () => {
  it.each(["preview", undefined])("EMAIL_ENVIRONMENT=%s: test inbox only, logged test_rerouted, enrollment not advanced", async (e) => {
    env.EMAIL_ENVIRONMENT = e;
    const res = await run(step());
    expect(res.json).toMatchObject({ status: "test_rerouted", success: false });
    expect(resend.sent[0].payload.to).toEqual([TEST_INBOX]);
    expect(String(resend.sent[0].payload.html)).not.toMatch(/token=(?!redacted)/);
    expect(enrollmentWrites()).toEqual([]);
    expect(h.db.writes().find((w) => w.table === "automation_logs")?.payload).toMatchObject({ status: "test_rerouted" });
  });

  it("repeated test runs never advance the enrollment", async () => {
    env.EMAIL_ENVIRONMENT = "staging";
    await run(step());
    await run(step());
    expect(resend.sent).toHaveLength(2);
    expect(enrollmentWrites()).toEqual([]);
  });

  it("what reaches the provider has no actionable link or recipient, however the agent's step text encodes them", async () => {
    env.EMAIL_ENVIRONMENT = "preview";
    const TOKEN = "eyJzeW50aGV0aWMiOnRydWV9.c2ln";
    const nasty = [
      `<a href="https://www.realtordesk.ai/unsubscribe?a=1&#38token=${TOKEN}">a</a>`,
      `<a href="https://www.realtordesk.ai/x?&#116oken=${TOKEN}">b</a>`,
      `<a href="https://www.realtordesk.ai/unsub&#10;scribe?id=${TOKEN}">c</a>`,
      `<a href="https://www.realtordesk.ai/x?to\tken=${TOKEN}">d</a>`,
      `<a href="mailto:bea.cont&#10;act@example.com">e</a>`,
      `reach bea&#46contact&#64example.com or bea.contact&#X40;example.com`,
      `bad &#99999999999; and &#x110000; and &#xD800; refs`,
    ].join(" ");
    setup({ steps: [emailStep(0, nasty)] });
    const res = await run(step());
    expect(res.json).toMatchObject({ status: "test_rerouted" });
    const html = String(resend.sent[0].payload.html);
    expect(html).not.toContain(TOKEN);
    expect(html).not.toMatch(/bea[\s\S]{0,12}cont[\s\S]{0,12}act/i);
    expect(html).toContain("bad &#99999999999; and &#x110000; and &#xD800; refs");
  });
});
