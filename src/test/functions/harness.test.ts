// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fakeSupabase, HOUR, isoAgo } from "./support/harness";

// Helper coverage for the in-memory database the handler tests run against.
// It checks the model's own semantics; it does not show that PostgREST
// behaves the same (not tested).

const db = () =>
  fakeSupabase({
    tables: {
      email_events: [
        { id: "old", user_id: "u1", event_type: "trial_ending", sent_at: isoAgo(25 * HOUR), metadata: { source_event_id: "evt_1" } },
        { id: "new", user_id: "u1", event_type: "trial_ending", sent_at: isoAgo(1 * HOUR), metadata: {} },
        { id: "other", user_id: "u2", event_type: "trial_ending", sent_at: isoAgo(1 * HOUR), metadata: null },
      ],
      profiles: [{ id: "p1", email: "dup@example.com" }, { id: "p2", email: "dup@example.com" }, { id: "p3", email: "one@example.com" }],
    },
  });

describe("fake database", () => {
  it("applies gte on timestamps, so a 24 h window really excludes older rows", async () => {
    const { client } = db();
    const { data } = await client.from("email_events").select("id").eq("user_id", "u1").gte("sent_at", isoAgo(24 * HOUR));
    expect((data as { id: string }[]).map((r) => r.id)).toEqual(["new"]);
  });

  it("matches a ->> JSON path as text, and a missing key never matches", async () => {
    const { client } = db();
    const hit = await client.from("email_events").select("id").eq("metadata->>source_event_id", "evt_1");
    const miss = await client.from("email_events").select("id").eq("metadata->>source_event_id", "evt_2");
    expect((hit.data as unknown[]).length).toBe(1);
    expect(miss.data).toEqual([]);
  });

  it("models single() and maybeSingle() cardinality like PostgREST", async () => {
    const { client } = db();
    expect((await client.from("profiles").select("id").eq("email", "none@example.com").single()).error?.code).toBe("PGRST116");
    expect((await client.from("profiles").select("id").eq("email", "dup@example.com").single()).error?.code).toBe("PGRST116");
    expect((await client.from("profiles").select("id").eq("email", "none@example.com").maybeSingle())).toMatchObject({ data: null, error: null });
    expect((await client.from("profiles").select("id").eq("email", "dup@example.com").maybeSingle()).error?.code).toBe("PGRST116");
    expect((await client.from("profiles").select("id").eq("email", "one@example.com").maybeSingle()).data).toMatchObject({ id: "p3" });
  });

  it("counts with head:true before limit", async () => {
    const { client } = db();
    const res = await client.from("email_events").select("id", { count: "exact", head: true }).eq("event_type", "trial_ending").limit(1);
    expect(res).toMatchObject({ data: null, count: 3 });
  });

  it("refuses a predicate it does not model instead of ignoring it", () => {
    const fake = db();
    expect(() => (fake.client.from("profiles").select("id") as unknown as { ilike: (c: string, v: string) => unknown }).ilike("email", "%dup%")).toThrow(/unsupported predicate ilike/);
    expect(fake.unsupported).toEqual(["profiles.ilike"]);
  });

  it("updates only matching rows and returns them when asked", async () => {
    const fake = db();
    const res = await fake.client.from("email_events").update({ user_id: "u9" }).eq("id", "new").eq("user_id", "u1").select("id");
    expect(res.data).toEqual([expect.objectContaining({ id: "new" })]);
    expect(fake.tables.email_events.filter((r) => r.user_id === "u9")).toHaveLength(1);
  });
});
