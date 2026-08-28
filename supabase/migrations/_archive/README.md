# Archived migrations

These 52 files are kept for history only. **They are not applied** — the
`_archive/` directory is outside the path the Supabase CLI reads.

They were retired on 2026-08-28 because the set had drifted from production
past the point where hand-fixing was safer than regenerating:

- They created **64 tables**; production had **43**.
- `automation_steps` and `contact_activities` are each created twice with
  incompatible shapes. The second `CREATE TABLE IF NOT EXISTS` is a silent
  no-op and the index that follows references columns that do not exist, so
  **those two files could not replay on a clean database at all**.
- Replaying the set would have **introduced two RLS holes production does not
  have**: an `email_log` INSERT policy and a `scheduled_emails` FOR ALL policy,
  both named for the service role but with no `TO` clause, so both applied to
  `PUBLIC`. The `scheduled_emails` one used `USING (true)`, which would have
  let any authenticated user read and delete every other tenant's scheduled
  email.
- Conversely, production carried objects present in **no** migration file —
  notably `profiles.is_demo` and the `trg_guard_profile_privileged_columns`
  trigger, without which any signed-in user can grant themselves a
  subscription (the "Users can update own profile" policy has no `WITH CHECK`).

They are replaced by a single generated baseline,
`../00000000000000_baseline_production_schema.sql`, produced by
`scripts/generate-schema-baseline.sh` directly from the live database.
