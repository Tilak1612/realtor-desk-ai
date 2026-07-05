-- Security & performance hardening from the 2026-06-21 production audit.
-- All changes are additive or access-tightening; no data is modified.

-- 1. scheduled_emails: the "manage" policy was FOR ALL USING(true) WITH CHECK(true)
--    with NO role restriction, so it applied to `public`/`authenticated` — any
--    logged-in user could read and write EVERY user's scheduled emails.
--    Only the service-role `email-automation` function writes this table, so
--    scope the policy to service_role. (The per-user SELECT policy is unchanged.)
DROP POLICY IF EXISTS "Service role can manage scheduled emails" ON public.scheduled_emails;
CREATE POLICY "Service role can manage scheduled emails"
  ON public.scheduled_emails
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. ddf_properties: the "temporary" manual-insert policy let ANY authenticated
--    user INSERT unattributed rows into the shared (cross-tenant) MLS table.
--    No client code path uses it — the only writer is the service-role
--    crea-ddf-sync function — so remove the authenticated-insert policy.
DROP POLICY IF EXISTS "Authenticated users can insert DDF properties" ON public.ddf_properties;

-- 3. Missing indexes on hot RLS / filter columns. Every RLS policy on these
--    tables filters `auth.uid() = user_id`, and list/pipeline views filter the
--    FK columns — all currently doing sequential scans that worsen as each
--    brokerage grows.
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts (user_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id    ON public.deals (user_id);
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON public.deals (contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id    ON public.tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_contact_id ON public.tasks (contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id    ON public.tasks (deal_id);
