// @vitest-environment node
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDenoEnv, fakeSupabase, importEdgeFunction, recordingFetch, req, type FakeDb } from "./support/harness";
import { TEST_INBOX } from "../../../supabase/functions/_shared/outbound-email.ts";

// The real email-automation handler, offline.

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

const CONTACT_ID = "22222222-2222-4222-8222-222222222222";
const CONTACTS = [{ id: CONTACT_ID, user_id: "u1", first_name: "Bea", email: "bea.contact@example.com", tags: [] }];
const setup = () => {
  h.db = fakeSupabase({ tables: { contacts: CONTACTS, email_suppressions: [], email_log: [], scheduled_emails: [] } });
};

beforeAll(async () => {
  setup();
  await importEdgeFunction("email-automation");
});
let resend: ReturnType<typeof recordingFetch>;
beforeEach(() => {
  env.EMAIL_ENVIRONMENT = "production";
  setup();
  h.db.setUser({ id: "u1" });
  resend = recordingFetch();
});
afterEach(() => expect(h.db.unsupported).toEqual([]));
const send = async (body: Record<string, unknown>) => {
  const res = await h.handler!(req({ contactId: CONTACT_ID, type: "follow_up", ...body }, { authorization: "Bearer user-jwt-synthetic" }));
  return { status: res.status, json: await res.json() };
};
const tableWrites = (t: string) => h.db.writes().filter((w) => w.table === t);

describe("email-automation", () => {
  it("production: sends with the contact's signed unsubscribe link and logs the send", async () => {
    expect(await send({})).toMatchObject({ status: 200, json: { success: true, action: "sent" } });
    expect(resend.sent[0].payload.to).toEqual(["bea.contact@example.com"]);
    expect(String(resend.sent[0].payload.html)).toMatch(/\/unsubscribe\?token=[\w.-]+".*Unsubscribe from these emails/s);
    expect(tableWrites("email_log")[0]?.payload).toMatchObject({ status: "sent" });
  });

  it("outside production: test inbox only, no email_log row for the real contact", async () => {
    env.EMAIL_ENVIRONMENT = "preview";
    expect(await send({})).toMatchObject({ json: { success: true, action: "test_rerouted" } });
    expect(resend.sent[0].payload.to).toEqual([TEST_INBOX]);
    expect(tableWrites("email_log")).toEqual([]);
  });

  it("outside production: nothing is scheduled (a scheduled_emails row would look real)", async () => {
    env.EMAIL_ENVIRONMENT = "staging";
    expect(await send({ delay: 3 })).toMatchObject({ json: { scheduled: false } });
    expect(tableWrites("scheduled_emails")).toEqual([]);
  });

  it("production scheduling is unchanged", async () => {
    expect(await send({ delay: 3 })).toMatchObject({ json: { success: true, delay: 3 } });
    expect(tableWrites("scheduled_emails")).toHaveLength(1);
  });

  it("without the unsubscribe signing secret nothing is sent", async () => {
    env.UNSUBSCRIBE_TOKEN_SECRET = undefined;
    expect((await send({})).status).toBe(500);
    expect(resend.fn).not.toHaveBeenCalled();
    env.UNSUBSCRIBE_TOKEN_SECRET = "unsubscribe-secret-synthetic";
  });
});

describe("email-automation contact ownership", () => {
  it("another user's contact is not found: no email, no write", async () => {
    h.db.setUser({ id: "u2" });
    expect((await send({})).status).toBe(404);
    expect(resend.fn).not.toHaveBeenCalled();
    expect(h.db.writes()).toEqual([]);
    expect(h.db.reads("contacts")[0].filters).toEqual([["eq", "id", CONTACT_ID], ["eq", "user_id", "u2"]]);
  });
});
