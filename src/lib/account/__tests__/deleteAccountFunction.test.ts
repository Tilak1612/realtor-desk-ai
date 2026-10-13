import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  deleteAccount,
  EXPLICIT_CONTACT_TABLES,
  EXPLICIT_USER_TABLES,
  RETAINED_TABLES,
  USER_STORAGE_BUCKETS,
  type DeletionPorts,
} from "../../../../supabase/functions/delete-account/deletion";

/**
 * The delete-account edge function, minus Deno.
 *
 * index.ts cannot run here (URL imports, Deno.env), but everything that decides
 * WHAT happens and IN WHAT ORDER is in deletion.ts, which has no imports and is
 * exercised below against fakes. The failure this suite exists to prevent is
 * the expensive one: an account deleted while its subscription keeps billing.
 */

const ROOT = join(__dirname, "..", "..", "..", "..");
const USER = { id: "11111111-2222-4333-8444-555555555555", email: "agent@example.com" };

interface World {
  demo: boolean | Error;
  customers: Record<string, { id: string; status: string }[]> | Error;
  cancelFails: boolean;
  /** bucket -> full object paths */
  storage: Record<string, string[]>;
  removeFails: boolean;
  contactIds: string[];
  deleteFailsOn: string | null;
  authDeleteFails: boolean;
  calls: string[];
  logs: unknown[][];
}

const world = (over: Partial<World> = {}): World => ({
  demo: false,
  customers: {},
  cancelFails: false,
  storage: {},
  removeFails: false,
  contactIds: [],
  deleteFailsOn: null,
  authDeleteFails: false,
  calls: [],
  logs: [],
  ...over,
});

/** A fake that behaves like the Storage API: one folder level per call, paged. */
function ports(w: World): DeletionPorts {
  return {
    log: (...args) => {
      w.logs.push(args);
    },
    async isDemoAccount() {
      w.calls.push("isDemoAccount");
      if (w.demo instanceof Error) throw w.demo;
      return w.demo;
    },
    async listStripeCustomerIds(email) {
      w.calls.push("listStripeCustomerIds:" + email);
      if (w.customers instanceof Error) throw w.customers;
      return Object.keys(w.customers);
    },
    async listSubscriptions(customerId) {
      w.calls.push("listSubscriptions:" + customerId);
      return (w.customers as Record<string, { id: string; status: string }[]>)[customerId];
    },
    async cancelSubscription(id) {
      w.calls.push("cancelSubscription:" + id);
      if (w.cancelFails) throw new Error("card network unavailable");
      for (const subs of Object.values(w.customers as Record<string, { id: string; status: string }[]>)) {
        for (const s of subs) if (s.id === id) s.status = "canceled";
      }
    },
    async listStorage(bucket, prefix, offset, limit) {
      w.calls.push("listStorage:" + bucket + ":" + prefix);
      const children = new Map<string, boolean>();
      for (const path of w.storage[bucket] ?? []) {
        if (!path.startsWith(prefix + "/")) continue;
        const rest = path.slice(prefix.length + 1).split("/");
        children.set(rest[0], rest.length > 1);
      }
      return [...children.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(offset, offset + limit)
        .map(([name, isFolder]) => ({ name, isFolder }));
    },
    async removeStorage(bucket, paths) {
      w.calls.push("removeStorage:" + bucket + ":" + paths.length);
      if (w.removeFails) throw new Error("storage unavailable");
      w.storage[bucket] = (w.storage[bucket] ?? []).filter((p) => !paths.includes(p));
    },
    async listContactIds(_userId, offset, limit) {
      return w.contactIds.slice(offset, offset + limit);
    },
    async deleteWhere(table, column, values) {
      w.calls.push("deleteWhere:" + table + ":" + column + ":" + values.length);
      if (w.deleteFailsOn === table) throw new Error("permission denied for table " + table);
    },
    async deleteAuthUser(userId) {
      w.calls.push("deleteAuthUser:" + userId);
      if (w.authDeleteFails) throw new Error("auth unavailable");
    },
  };
}

const firstIndex = (w: World, prefix: string) => w.calls.findIndex((c) => c.startsWith(prefix));

describe("delete-account: sequencing", () => {
  it("deletes an account with no Stripe customer, in the documented order", async () => {
    const w = world();
    const out = await deleteAccount(USER, ports(w));

    expect(out.status).toBe(200);
    expect(out.body).toMatchObject({ success: true, deleted: true, subscriptions_cancelled: 0 });
    expect(out.body.completed_steps).toEqual([
      "demo_check",
      "cancel_subscriptions",
      "delete_storage",
      "delete_rows",
      "delete_auth_user",
    ]);
    expect(w.calls.at(-1)).toBe("deleteAuthUser:" + USER.id);
  });

  it("cancels every live subscription on every customer before deleting anything", async () => {
    const w = world({
      customers: {
        cus_a: [
          { id: "sub_trial", status: "trialing" },
          { id: "sub_old", status: "canceled" },
        ],
        cus_b: [
          { id: "sub_due", status: "past_due" },
          { id: "sub_dead", status: "incomplete_expired" },
          { id: "sub_paused", status: "paused" },
        ],
      },
      storage: { avatars: [USER.id + "/1.png"] },
    });
    const out = await deleteAccount(USER, ports(w));

    expect(out.body.success).toBe(true);
    expect(out.body.subscriptions_cancelled).toBe(3);
    const cancelled = w.calls.filter((c) => c.startsWith("cancelSubscription:"));
    expect(cancelled).toEqual([
      "cancelSubscription:sub_trial",
      "cancelSubscription:sub_due",
      "cancelSubscription:sub_paused",
    ]);
    // Billing stops before the first destructive call of any kind.
    const lastCancel = w.calls.lastIndexOf("cancelSubscription:sub_paused");
    expect(firstIndex(w, "removeStorage")).toBeGreaterThan(lastCancel);
    expect(firstIndex(w, "deleteWhere")).toBeGreaterThan(lastCancel);
    expect(firstIndex(w, "deleteAuthUser")).toBeGreaterThan(lastCancel);
  });

  it("stops and deletes NOTHING when Stripe will not cancel", async () => {
    const w = world({
      customers: { cus_a: [{ id: "sub_live", status: "active" }] },
      cancelFails: true,
      storage: { avatars: [USER.id + "/1.png"] },
    });
    const out = await deleteAccount(USER, ports(w));

    expect(out.status).toBe(502);
    expect(out.body).toMatchObject({
      success: false,
      deleted: false,
      code: "stripe_cancel_failed",
      failed_step: "cancel_subscriptions",
      completed_steps: ["demo_check"],
    });
    expect(w.calls.some((c) => /^(removeStorage|deleteWhere|deleteAuthUser)/.test(c))).toBe(false);
    expect(w.storage.avatars).toHaveLength(1);
  });

  it("stops when Stripe cannot even be asked (missing key, outage)", async () => {
    const w = world({ customers: new Error("STRIPE_SECRET_KEY is not set") });
    const out = await deleteAccount(USER, ports(w));

    expect(out.body.code).toBe("stripe_cancel_failed");
    expect(w.calls.some((c) => c.startsWith("deleteAuthUser"))).toBe(false);
  });

  it("refuses the demo account before touching billing or data", async () => {
    const w = world({ demo: true, customers: { cus_a: [{ id: "sub_live", status: "active" }] } });
    const out = await deleteAccount(USER, ports(w));

    expect(out.status).toBe(403);
    expect(out.body).toMatchObject({ success: false, code: "demo_account", completed_steps: [] });
    expect(w.calls).toEqual(["isDemoAccount"]);
  });

  it("does not treat an unreadable profile as 'not a demo account'", async () => {
    const w = world({ demo: new Error("connection reset") });
    const out = await deleteAccount(USER, ports(w));

    expect(out.status).toBe(500);
    expect(out.body.code).toBe("profile_check_failed");
    expect(w.calls).toEqual(["isDemoAccount"]);
  });

  it("refuses a user id that is not a uuid, so a prefix can never be the whole bucket", async () => {
    for (const id of ["", "/", "%", "11111111-2222-4333-8444-555555555555/.."]) {
      const w = world();
      const out = await deleteAccount({ id, email: null }, ports(w));
      expect(out.body.code).toBe("invalid_user");
      expect(w.calls).toEqual([]);
    }
  });

  it("skips Stripe for an account with no email", async () => {
    const w = world();
    const out = await deleteAccount({ id: USER.id, email: null }, ports(w));
    expect(out.body.success).toBe(true);
    expect(w.calls.some((c) => c.startsWith("listStripeCustomerIds"))).toBe(false);
  });
});

describe("delete-account: storage", () => {
  it("removes every object under the user's folder in both buckets, and only those", async () => {
    const other = "99999999-2222-4333-8444-555555555555";
    const w = world({
      storage: {
        avatars: [USER.id + "/1.png", USER.id + "/2.png", other + "/1.png"],
        "contact-documents": [
          USER.id + "/contact-a/100.pdf",
          USER.id + "/contact-a/101.pdf",
          USER.id + "/contact-b/200.pdf",
          other + "/contact-z/900.pdf",
        ],
      },
    });
    const out = await deleteAccount(USER, ports(w));

    expect(out.body.storage_objects_removed).toBe(5);
    expect(w.storage.avatars).toEqual([other + "/1.png"]);
    expect(w.storage["contact-documents"]).toEqual([other + "/contact-z/900.pdf"]);
    expect([...USER_STORAGE_BUCKETS]).toEqual(["avatars", "contact-documents"]);
  });

  it("pages through a folder holding more files than one listing returns", async () => {
    const files = Array.from({ length: 250 }, (_, i) => USER.id + "/c/" + String(i).padStart(4, "0") + ".pdf");
    const w = world({ storage: { "contact-documents": files } });
    const out = await deleteAccount(USER, ports(w));

    expect(out.body.storage_objects_removed).toBe(250);
    expect(w.storage["contact-documents"]).toEqual([]);
  });

  it("reports a storage failure, keeps the account, and says billing already stopped", async () => {
    const w = world({
      customers: { cus_a: [{ id: "sub_live", status: "active" }] },
      storage: { avatars: [USER.id + "/1.png"] },
      removeFails: true,
    });
    const out = await deleteAccount(USER, ports(w));

    expect(out.status).toBe(500);
    expect(out.body).toMatchObject({
      success: false,
      deleted: false,
      code: "storage_delete_failed",
      failed_step: "delete_storage",
      completed_steps: ["demo_check", "cancel_subscriptions"],
      subscriptions_cancelled: 1,
    });
    expect(w.calls.some((c) => c.startsWith("deleteAuthUser"))).toBe(false);
  });
});

describe("delete-account: rows", () => {
  it("deletes the uncascaded tables explicitly, contact-keyed ones in batches", async () => {
    const w = world({ contactIds: Array.from({ length: 250 }, (_, i) => "contact-" + i) });
    await deleteAccount(USER, ports(w));

    for (const table of EXPLICIT_USER_TABLES) {
      expect(w.calls).toContain("deleteWhere:" + table + ":user_id:1");
    }
    for (const table of EXPLICIT_CONTACT_TABLES) {
      const batches = w.calls.filter((c) => c.startsWith("deleteWhere:" + table + ":contact_id:"));
      expect(batches.map((c) => Number(c.split(":").pop()))).toEqual([100, 100, 50]);
    }
  });

  it("never deletes from a retained table", async () => {
    const w = world({ contactIds: ["contact-1"] });
    await deleteAccount(USER, ports(w));
    for (const table of RETAINED_TABLES) {
      expect(w.calls.some((c) => c.startsWith("deleteWhere:" + table + ":"))).toBe(false);
    }
  });

  it("reports which steps finished when a row delete fails, and leaves the auth user", async () => {
    const w = world({ deleteFailsOn: "property_listings" });
    const out = await deleteAccount(USER, ports(w));

    expect(out.body).toMatchObject({
      success: false,
      deleted: false,
      code: "row_delete_failed",
      failed_step: "delete_rows",
      completed_steps: ["demo_check", "cancel_subscriptions", "delete_storage"],
    });
    expect(w.calls.some((c) => c.startsWith("deleteAuthUser"))).toBe(false);
  });

  it("reports an auth-user failure as not deleted", async () => {
    const w = world({ authDeleteFails: true });
    const out = await deleteAccount(USER, ports(w));

    expect(out.status).toBe(500);
    expect(out.body).toMatchObject({ success: false, deleted: false, code: "auth_delete_failed" });
    expect(out.body.completed_steps).toEqual(["demo_check", "cancel_subscriptions", "delete_storage", "delete_rows"]);
  });
});

describe("delete-account: retries and logging", () => {
  it("finishes on a second call after a failed first one, without cancelling twice", async () => {
    const w = world({
      customers: { cus_a: [{ id: "sub_live", status: "active" }] },
      storage: { avatars: [USER.id + "/1.png"] },
      authDeleteFails: true,
    });
    const first = await deleteAccount(USER, ports(w));
    expect(first.body.success).toBe(false);
    expect(first.body.subscriptions_cancelled).toBe(1);

    w.authDeleteFails = false;
    w.calls = [];
    const second = await deleteAccount(USER, ports(w));

    expect(second.body).toMatchObject({ success: true, deleted: true, subscriptions_cancelled: 0 });
    expect(second.body.storage_objects_removed).toBe(0);
    expect(w.calls.some((c) => c.startsWith("cancelSubscription"))).toBe(false);
  });

  it("logs the user id and never the email address", async () => {
    const w = world({
      customers: { cus_a: [{ id: "sub_live", status: "active" }] },
      cancelFails: true,
    });
    await deleteAccount(USER, ports(w));
    const w2 = world();
    await deleteAccount(USER, ports(w2));

    const logged = JSON.stringify([...w.logs, ...w2.logs]);
    expect(logged).toContain(USER.id);
    expect(logged).not.toContain(USER.email);
    expect(logged).not.toContain("@");
  });
});

/**
 * The function's table lists are only correct for the schema they were written
 * against. This reads the schema baseline and fails when a table appears that
 * holds a user's rows and is reached by neither a cascade nor an explicit
 * delete, which is how "deleted" quietly stops being true.
 */
describe("delete-account: every user-owned table is accounted for", () => {
  const sql = readFileSync(
    join(ROOT, "supabase/migrations/00000000000000_baseline_production_schema.sql"),
    "utf8",
  );

  const tables = new Map<string, string>();
  for (const m of sql.matchAll(/CREATE TABLE IF NOT EXISTS public\.(\w+) \(([\s\S]*?)\n\);/g)) {
    tables.set(m[1], m[2]);
  }

  /** table -> column -> { ref, onDelete } */
  const fks = new Map<string, Map<string, { ref: string; onDelete: string }>>();
  for (const m of sql.matchAll(
    /ALTER TABLE public\.(\w+) ADD CONSTRAINT \w+ FOREIGN KEY \((\w+)\) REFERENCES ([\w.]+)\(\w+\) ON DELETE (CASCADE|SET NULL|NO ACTION|RESTRICT)/g,
  )) {
    if (!fks.has(m[1])) fks.set(m[1], new Map());
    fks.get(m[1])!.set(m[2], { ref: m[3], onDelete: m[4] });
  }

  const hasColumn = (table: string, column: string) =>
    new RegExp("^\\s*" + column + " uuid", "m").test(tables.get(table) ?? "");

  it("parsed the baseline", () => {
    expect(tables.size).toBeGreaterThan(40);
    expect(fks.get("profiles")?.get("id")).toEqual({ ref: "auth.users", onDelete: "CASCADE" });
  });

  it("covers every table with a user_id column", () => {
    const unaccounted: string[] = [];
    for (const table of tables.keys()) {
      if (!hasColumn(table, "user_id")) continue;
      const fk = fks.get(table)?.get("user_id");
      const cascades = fk && fk.onDelete === "CASCADE" && ["auth.users", "profiles"].includes(fk.ref);
      const explicit = (EXPLICIT_USER_TABLES as readonly string[]).includes(table);
      const retained = (RETAINED_TABLES as readonly string[]).includes(table);
      if (!cascades && !explicit && !retained) unaccounted.push(table);
    }
    expect(
      unaccounted,
      "tables holding a user's rows that delete-account neither cascades to nor deletes:\n" +
        unaccounted.join("\n") +
        "\nAdd an ON DELETE CASCADE foreign key, or list the table in deletion.ts.",
    ).toEqual([]);
  });

  it("covers every table keyed on a contact without a foreign key to contacts", () => {
    const unaccounted: string[] = [];
    for (const table of tables.keys()) {
      for (const column of ["contact_id", "lead_id"]) {
        if (!hasColumn(table, column)) continue;
        const fk = fks.get(table)?.get(column);
        if (fk && fk.ref === "contacts") continue;
        if ((EXPLICIT_CONTACT_TABLES as readonly string[]).includes(table)) continue;
        unaccounted.push(table + "." + column);
      }
    }
    expect(unaccounted).toEqual([]);
  });

  it("only retains tables whose link to the user is nulled, not kept", () => {
    for (const table of RETAINED_TABLES) {
      expect(fks.get(table)?.get("user_id")).toEqual({ ref: "auth.users", onDelete: "SET NULL" });
      expect(fks.get(table)?.get("contact_id")).toEqual({ ref: "contacts", onDelete: "SET NULL" });
    }
  });

  it("lists only tables that exist", () => {
    for (const table of [...EXPLICIT_USER_TABLES, ...EXPLICIT_CONTACT_TABLES, ...RETAINED_TABLES]) {
      expect(tables.has(table), table + " is not in the schema baseline").toBe(true);
    }
  });

  it("reads the same storage path convention the upload code writes", () => {
    // {user_id}/... in both buckets: the function deletes by that prefix.
    expect(readFileSync(join(ROOT, "src/pages/Settings.tsx"), "utf8")).toMatch(
      /const fileName = `\$\{userId\}\/\$\{Date\.now\(\)\}\.\$\{fileExt\}`/,
    );
    expect(readFileSync(join(ROOT, "src/components/contact-detail/DocumentsTab.tsx"), "utf8")).toMatch(
      /const fileName = `\$\{session\.user\.id\}\/\$\{contactId\}\//,
    );
  });
});

describe("delete-account: the HTTP wrapper keeps its promises", () => {
  const index = readFileSync(join(ROOT, "supabase/functions/delete-account/index.ts"), "utf8");

  it("takes the user id from the verified token only", () => {
    expect(index).toMatch(/admin\.auth\.getUser\(token\)/);
    expect(index).toMatch(/deleteAccount\(\{ id: user\.id, email: user\.email \?\? null \}, ports\)/);
    // The body is parsed for the confirmation phrase and nothing else.
    expect(index.match(/req\.json\(\)/g)).toHaveLength(1);
    expect(index).not.toMatch(/body\.(user_?id|userId|id|email)\b/i);
  });

  it("requires the confirmation phrase", () => {
    expect(index).toMatch(/if \(confirm !== CONFIRM_PHRASE\)/);
  });

  it("never logs the email or the token", () => {
    for (const m of index.matchAll(/logStep\(([^;]*)\);/g)) {
      expect(m[1]).not.toMatch(/email|token|authHeader/i);
    }
  });
});
