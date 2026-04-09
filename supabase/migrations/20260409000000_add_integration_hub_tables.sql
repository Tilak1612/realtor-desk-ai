-- Integration Hub: stores user connections, interest, and requests

-- Connected integrations per user
CREATE TABLE IF NOT EXISTS integration_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug text NOT NULL,
  status text NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected')),
  credentials_encrypted text,
  connected_account_label text,
  connection_method text CHECK (connection_method IN ('oauth', 'api_key', 'webhook', 'smtp')),
  sync_direction text DEFAULT 'one_way_out' CHECK (sync_direction IN ('one_way_in', 'one_way_out', 'two_way')),
  sync_config jsonb DEFAULT '{}'::jsonb,
  last_sync_at timestamptz,
  last_sync_status text DEFAULT 'pending' CHECK (last_sync_status IN ('pending', 'success', 'error')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Prevent duplicate active connections per user per tool
CREATE UNIQUE INDEX idx_integration_connections_unique
  ON integration_connections (user_id, tool_slug)
  WHERE status = 'connected';

CREATE INDEX idx_integration_connections_user ON integration_connections (user_id);
CREATE INDEX idx_integration_connections_tool ON integration_connections (tool_slug);

ALTER TABLE integration_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections"
  ON integration_connections FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
  ON integration_connections FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
  ON integration_connections FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections"
  ON integration_connections FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Coming Soon interest tracking
CREATE TABLE IF NOT EXISTS integration_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tool_slug)
);

ALTER TABLE integration_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interests"
  ON integration_interest FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interests"
  ON integration_interest FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User-submitted integration requests
CREATE TABLE IF NOT EXISTS integration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  use_case text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE integration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
  ON integration_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests"
  ON integration_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Updated_at triggers
CREATE TRIGGER set_integration_connections_updated_at
  BEFORE UPDATE ON integration_connections
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

COMMENT ON TABLE integration_connections IS 'User-connected third-party integrations with encrypted credentials';
COMMENT ON TABLE integration_interest IS 'Users interested in Coming Soon integrations (for launch notification)';
COMMENT ON TABLE integration_requests IS 'User-submitted requests for new integrations';
