-- CREA DDF® property sync schema
-- This table stores listings synced from the DDF API, separate from
-- user-created property_listings to keep data provenance clear.

CREATE TABLE IF NOT EXISTS ddf_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mls_number text UNIQUE NOT NULL,
  board text,
  listing_type text,  -- 'sale', 'lease'
  property_type text, -- 'residential', 'condo', 'commercial', 'land'
  status text,        -- 'active', 'sold', 'expired', 'terminated'

  -- Address
  street_address text,
  city text,
  province text,
  postal_code text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),

  -- Details
  price numeric(12, 2),
  bedrooms smallint,
  bathrooms smallint,
  square_feet numeric(10, 2),
  lot_size_sqft numeric(12, 2),
  year_built smallint,
  description text,

  -- Media (URLs only — no binary storage)
  photo_urls text[] DEFAULT '{}',
  virtual_tour_url text, -- Matterport / iGuide

  -- Agent / Brokerage
  listing_agent_name text,
  listing_agent_phone text,
  listing_brokerage text,

  -- Sync metadata
  source text NOT NULL DEFAULT 'crea_ddf',
  raw_payload jsonb,
  synced_at timestamptz NOT NULL DEFAULT now(),

  -- Timestamps
  listed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_ddf_properties_city ON ddf_properties (city);
CREATE INDEX idx_ddf_properties_province ON ddf_properties (province);
CREATE INDEX idx_ddf_properties_status ON ddf_properties (status);
CREATE INDEX idx_ddf_properties_price ON ddf_properties (price);
CREATE INDEX idx_ddf_properties_type ON ddf_properties (property_type);
CREATE INDEX idx_ddf_properties_synced_at ON ddf_properties (synced_at DESC);
CREATE INDEX idx_ddf_properties_mls ON ddf_properties (mls_number);

-- Sync log to track DDF sync history
CREATE TABLE IF NOT EXISTS ddf_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  listings_fetched int DEFAULT 0,
  listings_upserted int DEFAULT 0,
  listings_errors int DEFAULT 0,
  error_details jsonb,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed'))
);

-- RLS: ddf_properties are read-only for authenticated users (public listing data)
ALTER TABLE ddf_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read DDF properties"
  ON ddf_properties FOR SELECT
  TO authenticated
  USING (true);

-- No insert/update/delete for regular users — only service role (edge function)

-- RLS: sync log is service-role only
ALTER TABLE ddf_sync_log ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger
CREATE TRIGGER set_ddf_properties_updated_at
  BEFORE UPDATE ON ddf_properties
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

COMMENT ON TABLE ddf_properties IS 'Property listings synced from CREA DDF API. Read-only for users.';
COMMENT ON TABLE ddf_sync_log IS 'Tracks DDF sync runs for monitoring. Service-role access only.';
