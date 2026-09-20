-- Stop an UPDATE from moving a row into another tenant's workspace.
--
-- Six tables had an UPDATE policy with a USING clause and no WITH CHECK:
--   chatbot_settings, contact_activities, contacts, deals,
--   integration_connections, property_listings
--
-- USING decides which rows you may update. WITH CHECK decides what the row is
-- allowed to look like AFTERWARDS, and Postgres does not infer one from the
-- other. Without it a signed-in user could update a row they legitimately own
-- and set user_id to someone else's uuid -- planting a contact, deal or
-- listing inside another brokerage's account, and removing it from their own.
--
-- integration_connections is the worst of the six: it carries
-- credentials_encrypted and webhook_token, so reassigning user_id hands a
-- connected mailbox or CRM to another tenant.
--
-- No read path changes and no legitimate update changes: an update that leaves
-- user_id alone already satisfies the new clause. Policies are recreated rather
-- than altered so the definition is explicit in one place.

-- chatbot_settings
DROP POLICY IF EXISTS "Users can update own chatbot settings" ON public.chatbot_settings;
CREATE POLICY "Users can update own chatbot settings" ON public.chatbot_settings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- contact_activities
DROP POLICY IF EXISTS "Users can update their own contact activities" ON public.contact_activities;
CREATE POLICY "Users can update their own contact activities" ON public.contact_activities
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- contacts
DROP POLICY IF EXISTS "Users can update own contacts" ON public.contacts;
CREATE POLICY "Users can update own contacts" ON public.contacts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- deals
DROP POLICY IF EXISTS "Users can update own deals" ON public.deals;
CREATE POLICY "Users can update own deals" ON public.deals
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- integration_connections
DROP POLICY IF EXISTS "Users can update own connections" ON public.integration_connections;
CREATE POLICY "Users can update own connections" ON public.integration_connections
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- property_listings
DROP POLICY IF EXISTS "Users can update their own property listings" ON public.property_listings;
CREATE POLICY "Users can update their own property listings" ON public.property_listings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- The same six tables also had their other policies granted to `public`
-- (which includes anon) rather than `authenticated`. auth.uid() is NULL for
-- anon so nothing was exposed, but the grant is wider than the intent. The
-- UPDATE policies above are now explicitly `TO authenticated`.
