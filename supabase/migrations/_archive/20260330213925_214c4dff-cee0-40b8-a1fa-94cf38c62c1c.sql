
-- Create email_events table for lifecycle email tracking
CREATE TABLE public.email_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  recipient_email text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- Service role only - no public access
CREATE POLICY "Service role only" ON public.email_events
  FOR ALL USING (false);

-- Index for duplicate checking
CREATE INDEX idx_email_events_user_event ON public.email_events(user_id, event_type);
