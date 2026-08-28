-- CASL compliance: email suppression list.
-- A row here = never send. Populated by /unsubscribe + Resend hard bounces.

CREATE TABLE IF NOT EXISTS public.email_suppressions (
  email text PRIMARY KEY,
  source text NOT NULL CHECK (source IN ('unsubscribe_link', 'manual', 'hard_bounce', 'spam_complaint', 'admin')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  suppressed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_suppressions_user ON public.email_suppressions(user_id);
CREATE INDEX IF NOT EXISTS idx_email_suppressions_contact ON public.email_suppressions(contact_id);

ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;

-- Service role writes only. No user-visible read surface.
-- (The /unsubscribe page calls an RPC that uses service role.)
CREATE POLICY "service role manages suppressions"
  ON public.email_suppressions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.email_suppressions IS 'CASL: one-way opt-out list. A row here blocks all outbound mail to that email.';
COMMENT ON COLUMN public.email_suppressions.source IS 'Where the suppression came from for audit purposes.';
