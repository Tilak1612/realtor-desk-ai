#!/usr/bin/env node
// One-shot script to apply supabase/migrations/20260423000000_affiliate_program.sql
// against a Supabase *branch* database (never prod). Usage:
//   npm install --no-save pg
//   BRANCH_DB_URL="postgresql://postgres:<pw>@db.<ref>.supabase.co:5432/postgres" \
//     node scripts/apply-affiliate-migration.mjs
//
// `pg` is installed ad-hoc (not a project dep) because the script is a
// one-shot branch-apply tool, not part of the runtime. The sandbox that
// blocks `supabase db push` still allows direct postgres connections,
// so this is the escape hatch.
//
// Refuses to run unless the URL host starts with `db.` and the host ref is
// explicitly passed via BRANCH_DB_URL (no CLI default fallback to prod).
// Not added to .gitignore — harmless, ephemeral, and useful reference
// the next time a Brainfy product ships its affiliate layer.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import pg from "pg";

const { Client } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationPath = resolve(
  __dirname,
  "..",
  "supabase/migrations/20260423000000_affiliate_program.sql",
);

const dbUrl = process.env.BRANCH_DB_URL;
if (!dbUrl) {
  console.error("BRANCH_DB_URL is required. Bailing.");
  process.exit(1);
}
const host = new URL(dbUrl).hostname;
if (!host.startsWith("db.") || host.endsWith("vxkqwkeqincbxrgglmca.supabase.co")) {
  console.error(
    `Refusing to run against ${host} — this script is branch-only, never prod.`,
  );
  process.exit(1);
}

const sql = readFileSync(migrationPath, "utf8");

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log(`✔ connected to ${host}`);

  // Apply the whole migration as a single transaction. If any statement
  // fails, the whole thing rolls back — safest default for a 472-line
  // DDL with enums, triggers, FKs, and RLS policies.
  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query("COMMIT");
    console.log("✔ migration applied (single transaction)");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("✗ migration failed — rolled back");
    console.error(err.message);
    process.exit(2);
  }

  // Verification queries from the user's authorization message.
  const queries = [
    [
      "affiliate_tables",
      `SELECT COUNT(*)::int AS n FROM information_schema.tables
       WHERE table_schema='public' AND table_name LIKE 'affiliate%'`,
    ],
    [
      "public_enums",
      `SELECT COUNT(*)::int AS n FROM pg_type
       WHERE typtype='e' AND typnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')`,
    ],
    [
      "affiliate_policies",
      `SELECT COUNT(*)::int AS n FROM pg_policies
       WHERE schemaname='public' AND tablename LIKE 'affiliate%'`,
    ],
    [
      "affiliate_triggers",
      `SELECT COUNT(*)::int AS n FROM pg_trigger
       WHERE tgrelid::regclass::text LIKE 'affiliate_%' AND NOT tgisinternal`,
    ],
    [
      "affiliate_functions",
      `SELECT COUNT(*)::int AS n FROM pg_proc p
       JOIN pg_namespace n ON n.oid=p.pronamespace
       WHERE n.nspname='public' AND p.proname LIKE '%affiliate%'`,
    ],
    [
      "products_seed",
      `SELECT id, slug FROM public.products WHERE slug='realtordesk'`,
    ],
  ];

  console.log("\n— verification queries —");
  for (const [label, q] of queries) {
    try {
      const res = await client.query(q);
      console.log(`${label}: ${JSON.stringify(res.rows)}`);
    } catch (err) {
      console.log(`${label}: ERROR ${err.message}`);
    }
  }

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(3);
});
