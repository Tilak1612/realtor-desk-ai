// @vitest-environment node
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDenoEnv, fakeSupabase, recordingFetch, req, importEdgeFunction, type FakeDb, type Row } from "./support/harness";
import { TEST_INBOX } from "../../../supabase/functions/_shared/outbound-email.ts";

// The real lifecycle-cron handler, offline: one trial user on day 3 with no
// contacts yet (the activation email), against an in-memory email_events.

const h = vi.hoisted(() => ({
  handler: null as null | ((r: Request) => Promise<Response>),
  db: null as unknown as FakeDb,
}));
vi.mock("https://deno.land/std@0.190.0/http/server.ts", () => ({ serve: (fn: (r: Request) => Promise<Response>) => { h.handler = fn; } }));
vi.mock("https://esm.sh/@supabase/supabase-js@2.57.2", () => ({ createClient: () => h.db.client }));
vi.mock("https://esm.sh/@supabase/supabase-js@2", () => ({ createClient: () => h.db.client }));

const env = fakeDenoEnv({
  CRON_SECRET: "cron-secret-synthetic",
  SUPABASE_URL: "https://synthetic.invalid",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-synthetic",
  RESEND_API_KEY: "re_synthetic",
  UNSUBSCRIBE_TOKEN_SECRET: "unsubscribe-secret-synthetic",
});

const dayThree = new Date(Date.now() - 3.5 * 86_400_000).toISOString();
const trialUser = (over: Record<string, unknown> = {}) => ({
  id: "u1", email: "trial.agent@example.com", full_name: "Tia Agent", created_at: dayThree,
  trial_ends_at: new Date(Date.now() + 10 * 86_400_000).toISOString(), onboarding_completed: true,
  first_contact_added_at: null, preferred_language: "en", is_demo: false, subscription_status: "trial", ...over,
});
const setup = (users: Row[] = [trialUser()], emailEvents: Row[] = []) => {
  h.db = fakeSupabase({
    tables: { profiles: users, email_events: emailEvents, email_suppressions: [] },
    defaults: { email_events: () => ({ sent_at: new Date().toISOString(), metadata: {} }) },
  });
};
const emailEvents = () => h.db.tables.email_events;

beforeAll(async () => {
  setup();
  await importEdgeFunction("lifecycle-cron");
});
let resend: ReturnType<typeof recordingFetch>;
beforeEach(() => {
  env.EMAIL_ENVIRONMENT = "production";
  setup();
  resend = recordingFetch();
});
afterEach(() => expect(h.db.unsupported).toEqual([]));
const tick = async () => (await h.handler!(req({}, { authorization: "Bearer cron-secret-synthetic" }))).json();

describe("lifecycle-cron progression is per environment", () => {
  it("production: sends the day-3 email and consumes the step", async () => {
    expect(await tick()).toMatchObject({ sent: 1 });
    expect(resend.sent[0].payload.to).toEqual(["trial.agent@example.com"]);
    expect(emailEvents().map((e) => e.event_type)).toEqual(["lifecycle_day3_activation"]);
    expect(await tick()).toMatchObject({ sent: 0, skipped: 1 }); // once only
    const dedup = h.db.reads("email_events")[0];
    expect(dedup.filters).toEqual([["eq", "user_id", "u1"], ["eq", "event_type", "lifecycle_day3_activation"]]);
  });

  it("a test run (preview, shared database) sends a test copy and leaves the real step unconsumed", async () => {
    env.EMAIL_ENVIRONMENT = "preview";
    await tick();
    expect(resend.sent[0].payload.to).toEqual([TEST_INBOX]);
    expect(emailEvents().map((e) => e.event_type)).toEqual(["test:preview:lifecycle_day3_activation"]);

    env.EMAIL_ENVIRONMENT = "production";
    expect(await tick()).toMatchObject({ sent: 1 });
    expect(resend.sent[1].payload.to).toEqual(["trial.agent@example.com"]);
  });

  it("a real step already sent in production does not block a test copy", async () => {
    setup([trialUser()], [{ user_id: "u1", event_type: "lifecycle_day3_activation", sent_at: new Date().toISOString() }]);
    env.EMAIL_ENVIRONMENT = "staging";
    expect(await tick()).toMatchObject({ sent: 1 });
    expect(resend.sent[0].payload.to).toEqual([TEST_INBOX]);
  });

  it("repeated test runs send one test copy", async () => {
    env.EMAIL_ENVIRONMENT = "preview";
    await tick();
    await tick();
    expect(resend.sent).toHaveLength(1);
  });

  it("a failed send consumes nothing", async () => {
    resend.failWith(500);
    expect(await tick()).toMatchObject({ sent: 0, errors: 1 });
    expect(emailEvents()).toEqual([]);
  });

  it("a demo workspace gets nothing", async () => {
    setup([trialUser({ is_demo: true })]);
    expect(await tick()).toMatchObject({ sent: 0, skipped: 1 });
    expect(resend.fn).not.toHaveBeenCalled();
  });
});

describe("lifecycle-cron selection", () => {
  it("only trial profiles are selected (the query's own filter, applied)", async () => {
    setup([trialUser({ subscription_status: "active" })]);
    expect(await tick()).toMatchObject({ sent: 0 });
    expect(h.db.reads("profiles")[0].filters).toEqual([["eq", "subscription_status", "trial"]]);
  });
});
