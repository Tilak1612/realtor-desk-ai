-- Auth rate limiting table for brute-force protection
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  action text NOT NULL CHECK (action IN ('login', 'signup')),
  attempted_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by IP + action + time window
CREATE INDEX idx_auth_rate_limits_lookup
  ON auth_rate_limits (ip_address, action, attempted_at DESC);

-- Auto-cleanup: delete rows older than 1 hour (keeps table small)
-- Run via pg_cron or a scheduled edge function
CREATE OR REPLACE FUNCTION cleanup_auth_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_rate_limits WHERE attempted_at < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: only service role can read/write (edge function uses service role key)
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public policies — only service_role can access
COMMENT ON TABLE auth_rate_limits IS 'Tracks auth attempts per IP for rate limiting. Accessed only by auth-rate-limiter edge function via service role.';
