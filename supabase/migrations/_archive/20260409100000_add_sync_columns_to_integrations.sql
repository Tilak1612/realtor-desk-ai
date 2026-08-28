-- Add sync health and webhook columns to integration_connections
ALTER TABLE integration_connections
  ADD COLUMN IF NOT EXISTS webhook_token text,
  ADD COLUMN IF NOT EXISTS last_sync_error text,
  ADD COLUMN IF NOT EXISTS sync_count_total integer DEFAULT 0;

-- Index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_integration_connections_webhook
  ON integration_connections (user_id, tool_slug, webhook_token)
  WHERE webhook_token IS NOT NULL;

COMMENT ON COLUMN integration_connections.webhook_token IS 'Unique token for webhook URL validation';
COMMENT ON COLUMN integration_connections.last_sync_error IS 'Last sync error message if status is error';
COMMENT ON COLUMN integration_connections.sync_count_total IS 'Total number of successful syncs';
