-- Add realtor-specific fields to deals table
ALTER TABLE deals
  ADD COLUMN IF NOT EXISTS mls_number TEXT,
  ADD COLUMN IF NOT EXISTS property_address TEXT,
  ADD COLUMN IF NOT EXISTS listing_price NUMERIC,
  ADD COLUMN IF NOT EXISTS commission_percentage NUMERIC DEFAULT 2.5,
  ADD COLUMN IF NOT EXISTS closing_date DATE,
  ADD COLUMN IF NOT EXISTS property_type TEXT CHECK (property_type IN ('condo', 'house', 'townhouse', 'commercial', 'land', 'other')),
  ADD COLUMN IF NOT EXISTS client_type TEXT CHECK (client_type IN ('buyer', 'seller', 'both'));

-- Add index on property_address for searching
CREATE INDEX IF NOT EXISTS idx_deals_property_address ON deals(property_address);

-- Add index on closing_date for filtering
CREATE INDEX IF NOT EXISTS idx_deals_closing_date ON deals(closing_date);

-- Add index on client_type for filtering
CREATE INDEX IF NOT EXISTS idx_deals_client_type ON deals(client_type);

-- Comment on new columns
COMMENT ON COLUMN deals.mls_number IS 'MLS listing number';
COMMENT ON COLUMN deals.property_address IS 'Full property address';
COMMENT ON COLUMN deals.listing_price IS 'Property listing price';
COMMENT ON COLUMN deals.commission_percentage IS 'Commission percentage (default 2.5%)';
COMMENT ON COLUMN deals.closing_date IS 'Expected or actual closing date';
COMMENT ON COLUMN deals.property_type IS 'Type of property: condo, house, townhouse, commercial, land, other';
COMMENT ON COLUMN deals.client_type IS 'Client type: buyer, seller, or both';