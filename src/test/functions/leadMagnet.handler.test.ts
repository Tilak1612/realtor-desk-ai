// @vitest-environment node
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDenoEnv, fakeSupabase, HOUR, importEdgeFunction, isoAgo, recordingFetch, req, type Call, type FakeDb, type Row } from "./support/harness";
import { TEST_INBOX } from "../../../supabase/functions/_shared/outbound-email.ts";

// The real send-lead-magnet-email handler, offline.

const h = vi.hoisted(() => ({
  handler: null as null | ((r: Request) => Promise<Response>),
  db: null as unknown as FakeDb,
}));
vi.mock("https://deno.land/std@0.190.0/http/server.ts", () => ({ serve: (fn: (r: Request) => Promise<Response>) => { h.handler = fn; } }));
vi.mock("https://esm.sh/@supabase/supabase-js@2", () => ({ createClient: () => h.db.client }));

const env = fakeDenoEnv({
  SUPABASE_URL: "https://synthetic.invalid",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-synthetic",
  RESEND_API_KEY: "re_synthetic",
});

let suppressionLookupFails: boolean;
const setup = (suppressions: Row[] = [], requests: Row[] = []) => {
  h.db = fakeSupabase({
    tables: { email_suppressions: suppressions, lead_magnet_requests: requests },
    defaults: { lead_magnet_requests: () => ({ created_at: new Date().toISOString() }) },
    fail: (c: Call) => (c.table === "email_suppressions" && suppressionLookupFails ? { message: "db down" } : undefined),
  });
};

beforeAll(async () => {
  setup();
  await importEdgeFunction("send-lead-magnet-email");
});
let resend: ReturnType<typeof recordingFetch>;
beforeEach(() => {
  suppressionLookupFails = false;
  env.EMAIL_ENVIRONMENT = "production";
  setup();
  resend = recordingFetch();
});
afterEach(() => expect(h.db.unsupported).toEqual([]));
const ask = async (email: string) => {
  const res = await h.handler!(req({ firstName: "Sam", email }));
  return { status: res.status, json: await res.json() };
};
const rateLimitWrites = () => h.db.writes().filter((w) => w.table === "lead_magnet_requests");

describe("send-lead-magnet-email", () => {
  it("delivers to a requester who is not suppressed, and records the request for the rate limit", async () => {
    expect(await ask("sam.visitor@example.com")).toMatchObject({ status: 200, json: { success: true } });
    expect(resend.sent[0].payload.to).toEqual(["sam.visitor@example.com"]);
    expect(rateLimitWrites()).toHaveLength(1);
  });

  it("sends nothing to a suppressed address, with the same answer as a send", async () => {
    setup([{ email: "sam.visitor@example.com", source: "unsubscribe_link" }]);
    expect(await ask("Sam.Visitor@Example.com")).toMatchObject({ status: 200, json: { success: true } });
    expect(resend.fn).not.toHaveBeenCalled();
    expect(rateLimitWrites()).toEqual([]);
  });

  it("fails closed: a failed suppression lookup sends nothing", async () => {
    suppressionLookupFails = true;
    await ask("sam.visitor@example.com");
    expect(resend.fn).not.toHaveBeenCalled();
  });

  it("a test copy goes to the test inbox and does not use up the real person's rate limit", async () => {
    env.EMAIL_ENVIRONMENT = "preview";
    await ask("sam.visitor@example.com");
    expect(resend.sent[0].payload.to).toEqual([TEST_INBOX]);
    expect(rateLimitWrites()).toEqual([]);
  });

  it("a provider failure is reported as a failure", async () => {
    resend.failWith(500);
    expect((await ask("sam.visitor@example.com")).status).toBe(500);
    expect(rateLimitWrites()).toEqual([]);
  });
});

describe("send-lead-magnet-email: the 24 h rate limit", () => {
  it.each([
    ["23 h ago", 23 * HOUR, false],
    ["25 h ago", 25 * HOUR, true],
  ])("an earlier request %s: sent again = %s", async (_what, ago, sent) => {
    setup([], [{ email: "sam.visitor@example.com", created_at: isoAgo(ago as number) }]);
    await ask("sam.visitor@example.com");
    expect(resend.sent).toHaveLength(sent ? 1 : 0);
    const window = h.db.reads("lead_magnet_requests")[0];
    expect(window).toMatchObject({ count: "exact", head: true });
    expect(window.filters.map(([k, c]) => `${k}:${c}`)).toEqual(["eq:email", "gte:created_at"]);
  });

  it("another address's request does not limit this one", async () => {
    setup([], [{ email: "someone.else@example.com", created_at: isoAgo(HOUR) }]);
    await ask("sam.visitor@example.com");
    expect(resend.sent).toHaveLength(1);
  });
});
