-- Reconcile the repo migration set with production, 2026-08-28.
--
-- Context: supabase/migrations/ creates 64 tables; production has 37, and
-- production carries objects that exist in no migration file at all. Migration
-- state had been managed by hand in the dashboard. The practical consequences
-- were:
--
--   1. `supabase db reset`, a staging environment, or a second region would
--      produce a database that does NOT match production.
--   2. Worse, replaying the repo would introduce two RLS holes that production
--      does not have (see section 1).
--   3. The privilege-guard trigger protecting billing columns exists only in
--      production, so a rebuilt environment would silently lose it.
--
-- This migration is idempotent and safe to run against production (where it is
-- a no-op) as well as against a fresh reset.

-- ---------------------------------------------------------------------------
-- 1. Close two RLS holes the repo would otherwise introduce.
-- ---------------------------------------------------------------------------
-- 20251020132112 creates:
--   CREATE POLICY "Service role can insert email logs"
--     ON public.email_log FOR INSERT WITH CHECK (true);
--   CREATE POLICY "Service role can manage scheduled emails"
--     ON public.scheduled_emails FOR ALL USING (true) WITH CHECK (true);
--
-- Both are named "service role" but neither carries a TO clause, so they apply
-- to PUBLIC. The scheduled_emails one is the more serious of the two: FOR ALL
-- with USING(true) lets any authenticated user read, modify and delete every
-- other tenant's scheduled email.
--
-- Production instead has a single "Service role only" ALL policy with
-- USING(false). A policyless-for-clients table is still fully reachable by the
-- service_role key, which is what the edge functions use, so dropping client
-- access costs nothing operationally.
DROP POLICY IF EXISTS "Service role can insert email logs" ON public.email_log;
DROP POLICY IF EXISTS "Users can view their contact email logs" ON public.email_log;
DROP POLICY IF EXISTS "Users can view their scheduled emails" ON public.scheduled_emails;

DROP POLICY IF EXISTS "Service role only" ON public.email_log;
CREATE POLICY "Service role only" ON public.email_log
  FOR ALL USING (false);

DROP POLICY IF EXISTS "Service role only" ON public.scheduled_emails;
CREATE POLICY "Service role only" ON public.scheduled_emails
  FOR ALL USING (false);

-- Production keeps this policy but scoped TO service_role; the repo version
-- omits the TO clause, which is what makes it apply to PUBLIC. Recreate it
-- scoped, rather than dropping it, so this migration is a true no-op against
-- production. (service_role bypasses RLS anyway; this keeps the two in sync.)
DROP POLICY IF EXISTS "Service role can manage scheduled emails" ON public.scheduled_emails;
CREATE POLICY "Service role can manage scheduled emails" ON public.scheduled_emails
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 2. Privilege guard on profiles — exists in production, in no migration.
-- ---------------------------------------------------------------------------
-- The "Users can update own profile" policy has no WITH CHECK clause, so
-- without this trigger any signed-in user could UPDATE their own profile row to
-- set is_demo = true, or set subscription_status/subscription_tier/
-- trial_ends_at directly, and skip billing entirely.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.guard_profile_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Body matches the function already running in production verbatim.
  -- service_role (edge functions, Stripe webhook) may set these freely;
  -- everyone else keeps whatever the row already had.
  IF coalesce(auth.role(), '') <> 'service_role' THEN
    NEW.is_demo             := OLD.is_demo;
    NEW.subscription_status := OLD.subscription_status;
    NEW.subscription_tier   := OLD.subscription_tier;
    NEW.trial_ends_at       := OLD.trial_ends_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profile_privileged_columns ON public.profiles;
CREATE TRIGGER trg_guard_profile_privileged_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileged_columns();

-- ---------------------------------------------------------------------------
-- 3. Import rate limiting — src/lib/apify.ts called these; neither existed.
-- ---------------------------------------------------------------------------
-- Both call sites fail OPEN ("Allow on error to not block users"), so while
-- these functions were missing the 10-imports/day cap and the
-- one-import-at-a-time rule were never enforced.
CREATE OR REPLACE FUNCTION public.check_apify_rate_limit(
  checking_user_id uuid,
  max_daily_imports integer DEFAULT 10
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) < max_daily_imports
  FROM public.import_history
  WHERE user_id = checking_user_id
    AND created_at >= date_trunc('day', now());
$$;

CREATE OR REPLACE FUNCTION public.check_concurrent_import(checking_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.import_history
    WHERE user_id = checking_user_id
      AND status IN ('pending', 'running')
      -- Stale guard: a crashed import must not lock the user out forever.
      AND created_at > now() - interval '1 hour'
  );
$$;

REVOKE ALL ON FUNCTION public.check_apify_rate_limit(uuid, integer) FROM public;
REVOKE ALL ON FUNCTION public.check_concurrent_import(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.check_apify_rate_limit(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_concurrent_import(uuid) TO authenticated;

-- ---------------------------------------------------------------------------
-- 4. apify_usage — trackApifyUsage() wrote here on every import path.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.apify_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id text NOT NULL,
  records_fetched integer NOT NULL DEFAULT 0,
  import_history_id uuid REFERENCES public.import_history(id) ON DELETE SET NULL,
  request_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS apify_usage_user_date_idx
  ON public.apify_usage (user_id, request_date DESC);
ALTER TABLE public.apify_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "apify_usage_select_own" ON public.apify_usage;
CREATE POLICY "apify_usage_select_own" ON public.apify_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "apify_usage_insert_own" ON public.apify_usage;
CREATE POLICY "apify_usage_insert_own" ON public.apify_usage
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. conversation_messages — the Inbox, composer and response-time report.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'chat'
    CHECK (channel IN ('chat','email','sms','call')),
  -- 'ai' vs 'agent' is what makes AI-vs-human attribution measurable.
  author text NOT NULL CHECK (author IN ('ai','agent','lead','system')),
  author_name text,
  body text NOT NULL,
  language text NOT NULL DEFAULT 'EN',
  sent_at timestamptz NOT NULL DEFAULT now(),
  system_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS conversation_messages_thread_idx
  ON public.conversation_messages (user_id, lead_id, sent_at);
CREATE INDEX IF NOT EXISTS conversation_messages_recent_idx
  ON public.conversation_messages (user_id, sent_at DESC);
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cm_select_own" ON public.conversation_messages;
CREATE POLICY "cm_select_own" ON public.conversation_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "cm_insert_own" ON public.conversation_messages;
CREATE POLICY "cm_insert_own" ON public.conversation_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- WITH CHECK as well as USING, or the update policy would permit moving a row
-- to another user_id.
DROP POLICY IF EXISTS "cm_update_own" ON public.conversation_messages;
CREATE POLICY "cm_update_own" ON public.conversation_messages
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "cm_delete_own" ON public.conversation_messages;
CREATE POLICY "cm_delete_own" ON public.conversation_messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 6. RD automation engine.
-- ---------------------------------------------------------------------------
-- Steps get their own table because public.automation_steps already exists and
-- belongs to the older email_automations engine with an incompatible shape
-- (automation_id / step_order / action_type / action_config / delay_days).
CREATE TABLE IF NOT EXISTS public.automation_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  trigger text NOT NULL,
  active boolean NOT NULL DEFAULT false,
  last_run_at timestamptz,
  stats_30d jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.automation_sequence_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL REFERENCES public.automation_sequences(id) ON DELETE CASCADE,
  position integer NOT NULL,
  kind text NOT NULL,
  label text NOT NULL,
  hours integer,
  template_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sequence_id, position)
);

CREATE TABLE IF NOT EXISTS public.automation_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_id uuid NOT NULL REFERENCES public.automation_sequences(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  current_step integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','completed','cancelled')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (sequence_id, contact_id)
);

CREATE INDEX IF NOT EXISTS automation_sequences_user_idx
  ON public.automation_sequences (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS automation_enrollments_seq_idx
  ON public.automation_enrollments (user_id, sequence_id, status);

ALTER TABLE public.automation_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "as_all_own" ON public.automation_sequences;
CREATE POLICY "as_all_own" ON public.automation_sequences
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Steps carry no user_id; ownership derives from the parent sequence.
DROP POLICY IF EXISTS "ass_all_own" ON public.automation_sequence_steps;
CREATE POLICY "ass_all_own" ON public.automation_sequence_steps
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.automation_sequences s
                 WHERE s.id = sequence_id AND s.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.automation_sequences s
                      WHERE s.id = sequence_id AND s.user_id = auth.uid()));

DROP POLICY IF EXISTS "ae_all_own" ON public.automation_enrollments;
CREATE POLICY "ae_all_own" ON public.automation_enrollments
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 7. webhook_events processing columns.
-- ---------------------------------------------------------------------------
-- webhook-receiver discarded every inbound payload and returned 200. These
-- columns record what happened to each one so a failed conversion is
-- recoverable instead of invisible.
ALTER TABLE public.webhook_events
  ADD COLUMN IF NOT EXISTS processing_status text NOT NULL DEFAULT 'received'
    CHECK (processing_status IN ('received','contact_created','contact_updated','ignored','failed')),
  ADD COLUMN IF NOT EXISTS contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS processing_error text;

CREATE INDEX IF NOT EXISTS webhook_events_user_received_idx
  ON public.webhook_events (user_id, received_at DESC);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "we_select_own" ON public.webhook_events;
CREATE POLICY "we_select_own" ON public.webhook_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 8. Dashboard index.
-- ---------------------------------------------------------------------------
-- contacts carries nine indexes, none of them the (user_id, created_at) the
-- lead list and the 7-day sparkline actually order by.
CREATE INDEX IF NOT EXISTS contacts_user_created_idx
  ON public.contacts (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 9. avatars storage bucket.
-- ---------------------------------------------------------------------------
-- The project had career-resumes and contact-documents but no avatars bucket,
-- so every profile photo upload failed. Writes are confined to a per-user
-- folder so one user cannot overwrite another's avatar.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880,
        ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars'
              AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars'
         AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars'
              AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects;
CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars'
         AND (storage.foldername(name))[1] = auth.uid()::text);
