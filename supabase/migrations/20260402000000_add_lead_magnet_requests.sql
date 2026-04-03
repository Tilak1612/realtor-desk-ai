-- Track lead magnet email deliveries for rate-limiting unauthenticated requests.
-- No user_id — submissions come from public visitors, not signed-in accounts.
CREATE TABLE public.lead_magnet_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Service-role-only access (edge function uses service role key)
ALTER TABLE public.lead_magnet_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.lead_magnet_requests
  FOR ALL USING (false);

-- Index for the rate-limit query (email + created_at range scan)
CREATE INDEX idx_lead_magnet_requests_email_created
  ON public.lead_magnet_requests (email, created_at);
