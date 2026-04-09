-- Track when re-auth emails were sent to prevent spam (max 1 per 24h per tool)
ALTER TABLE integration_connections
  ADD COLUMN IF NOT EXISTS last_reauth_email_sent_at timestamptz;

COMMENT ON COLUMN integration_connections.last_reauth_email_sent_at IS 'Timestamp of last re-auth email sent. Used for 24h dedup.';
