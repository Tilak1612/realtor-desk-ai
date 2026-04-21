-- Phase D wiring: conversation_messages.
--
-- Why a new table (not contact_activities):
--   contact_activities is a loose audit log — its description field
--   can't hold full message bodies cleanly, it doesn't distinguish
--   author (ai / lead / agent / system), and it has no channel or
--   language fields. The redesign's ConversationMessage type needs
--   all four. Overloading metadata would make every read site
--   parse JSON, which we avoided in leads/onboarding.
--
-- This table owns the chat/sms/email thread rendered on
-- /app/leads/:id and the list on /app/inbox. Mutations run through
-- useSendMessage in Phase D.

CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  channel text NOT NULL CHECK (channel IN ('chat', 'sms', 'email')),
  author text NOT NULL CHECK (author IN ('ai', 'lead', 'agent', 'system')),
  author_name text NOT NULL,
  body text NOT NULL,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'fr')),
  sent_at timestamptz NOT NULL DEFAULT now(),
  system_note text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Primary access pattern: load a lead's thread newest-first, and list
-- per-user recent conversations. Compound covers both.
CREATE INDEX IF NOT EXISTS idx_conversation_messages_lead_sent
  ON public.conversation_messages(lead_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_user_sent
  ON public.conversation_messages(user_id, sent_at DESC);

ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own conversation messages"
  ON public.conversation_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own conversation messages"
  ON public.conversation_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own conversation messages"
  ON public.conversation_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Deletes stay off the client — keep the thread for CASL + audit.
-- Row removal happens only via ON DELETE CASCADE when a contact or
-- user is deleted.

COMMENT ON TABLE public.conversation_messages IS
  'Chat / SMS / email thread rendered on /app/leads/:id + /app/inbox. '
  'author distinguishes AI from agent from lead from system notes. '
  'Append-only from the client; CASCADE-cleaned when lead/user is removed.';
