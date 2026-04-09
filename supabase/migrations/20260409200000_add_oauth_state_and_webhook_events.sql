-- OAuth state store for CSRF protection during OAuth flows
CREATE TABLE IF NOT EXISTS oauth_state_store (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  state text UNIQUE NOT NULL,
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oauth_state_expires ON oauth_state_store (expires_at);

-- RLS: service role only (state validation happens server-side)
ALTER TABLE oauth_state_store ENABLE ROW LEVEL SECURITY;

-- Webhook events log for debugging
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id uuid REFERENCES integration_connections(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  received_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_received ON webhook_events (received_at);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own webhook events"
  ON webhook_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

COMMENT ON TABLE oauth_state_store IS 'Temporary CSRF state for OAuth flows. Auto-cleanup after 10 min.';
COMMENT ON TABLE webhook_events IS 'Log of incoming webhook pings. Auto-cleanup after 30 days.';
