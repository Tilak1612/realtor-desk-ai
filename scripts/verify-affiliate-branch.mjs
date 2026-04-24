#!/usr/bin/env node
// Secondary verification: the user's original queries undercount
// functions (fn_recompute_* and fn_current_* don't match
// 'affiliate%') and overcount enums (counts pre-existing public
// enums alongside the 8 new ones). This runs tighter scoped checks.

import pg from "pg";
const { Client } = pg;

const dbUrl = process.env.BRANCH_DB_URL;
if (!dbUrl) { console.error("BRANCH_DB_URL required"); process.exit(1); }
const host = new URL(dbUrl).hostname;
if (!host.startsWith("db.") || host.endsWith("vxkqwkeqincbxrgglmca.supabase.co")) {
  console.error(`Refusing — ${host} is not a branch`); process.exit(1);
}

const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
await client.connect();

const queries = [
  [
    "new_affiliate_enums (expect 8)",
    `SELECT typname FROM pg_type
     WHERE typtype='e' AND typnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')
       AND typname IN (
         'affiliate_status','affiliate_tier','affiliate_track',
         'referral_status','commission_status','commission_type',
         'payout_status','payout_method'
       )
     ORDER BY typname`,
  ],
  [
    "new_affiliate_functions (expect 4)",
    `SELECT p.proname FROM pg_proc p
     JOIN pg_namespace n ON n.oid=p.pronamespace
     WHERE n.nspname='public'
       AND p.proname IN (
         'fn_recompute_affiliate_tier',
         'fn_current_commission_rate_bps',
         'tg_set_updated_at',
         'increment_click_count'
       )
     ORDER BY p.proname`,
  ],
  [
    "rls_enabled_affiliate_tables (expect all 7 + products = 8)",
    `SELECT relname, relrowsecurity FROM pg_class
     WHERE relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')
       AND relname IN (
         'products','affiliates','affiliate_links','affiliate_clicks',
         'affiliate_referrals','affiliate_commissions','affiliate_payouts',
         'affiliate_assets'
       )
     ORDER BY relname`,
  ],
  [
    "foreign_key_check",
    `SELECT conname FROM pg_constraint
     WHERE conrelid::regclass::text LIKE 'affiliate_%'
       AND contype='f'
     ORDER BY conname`,
  ],
  [
    "unique_idempotency_constraint_on_commissions",
    `SELECT conname, pg_get_constraintdef(oid) AS def FROM pg_constraint
     WHERE conrelid='public.affiliate_commissions'::regclass
       AND contype='u'`,
  ],
  [
    "seeded_assets_count (expect 6)",
    `SELECT COUNT(*)::int AS n FROM public.affiliate_assets`,
  ],
];

for (const [label, q] of queries) {
  try {
    const res = await client.query(q);
    console.log(`\n${label}:`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.log(`\n${label}: ERROR ${err.message}`);
  }
}

await client.end();
