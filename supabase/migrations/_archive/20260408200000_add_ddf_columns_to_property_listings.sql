-- Add CREA DDF columns to property_listings for official listing import flow
ALTER TABLE property_listings
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual' CHECK (source IN ('manual', 'crea_ddf', 'url_scrape')),
  ADD COLUMN IF NOT EXISTS source_listing_id text,
  ADD COLUMN IF NOT EXISTS mls_number text,
  ADD COLUMN IF NOT EXISTS realtor_ca_url text,
  ADD COLUMN IF NOT EXISTS street text,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'CA',
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'CAD',
  ADD COLUMN IF NOT EXISTS photos_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS raw_source_payload jsonb,
  ADD COLUMN IF NOT EXISTS data_source text;

-- Rename price column alias (keep numeric, just clarify in app)
COMMENT ON COLUMN property_listings.price IS 'List price in CAD';

-- Indexes for DDF lookups
CREATE INDEX IF NOT EXISTS idx_property_listings_user_id ON property_listings (user_id);
CREATE INDEX IF NOT EXISTS idx_property_listings_mls_number ON property_listings (mls_number);
CREATE INDEX IF NOT EXISTS idx_property_listings_source_listing_id ON property_listings (source_listing_id);

-- Unique constraint: prevent duplicate imports per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_listings_user_source_unique
  ON property_listings (user_id, source, source_listing_id)
  WHERE source_listing_id IS NOT NULL;

COMMENT ON TABLE property_listings IS 'User property listings. Source can be manual entry or CREA DDF import.';
