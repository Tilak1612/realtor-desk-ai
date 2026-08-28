-- Add CASL compliance and Canadian-specific fields

-- Add CASL compliance fields to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS consent_given boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_date timestamptz,
ADD COLUMN IF NOT EXISTS consent_source text,
ADD COLUMN IF NOT EXISTS unsubscribed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS unsubscribe_date timestamptz,
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr'));

-- Add Canadian-specific fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS province_code text CHECK (province_code IN ('AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT')),
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'America/Toronto',
ADD COLUMN IF NOT EXISTS regulatory_body text,
ADD COLUMN IF NOT EXISTS license_expiry date;

-- Add MLS-related fields to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS source_url text,
ADD COLUMN IF NOT EXISTS last_synced_at timestamptz,
ADD COLUMN IF NOT EXISTS data_source text DEFAULT 'manual' CHECK (data_source IN ('manual', 'url_scrape', 'mls_feed'));

-- Create index for faster CASL compliance queries
CREATE INDEX IF NOT EXISTS idx_contacts_consent ON contacts(consent_given, unsubscribed);
CREATE INDEX IF NOT EXISTS idx_contacts_unsubscribed ON contacts(unsubscribed) WHERE unsubscribed = true;

-- Create index for province-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_province ON profiles(province_code);

COMMENT ON COLUMN contacts.consent_given IS 'CASL: Has contact given explicit consent for communication';
COMMENT ON COLUMN contacts.consent_date IS 'CASL: When consent was given';
COMMENT ON COLUMN contacts.consent_source IS 'CASL: Source of consent (e.g., website form, phone call, in-person)';
COMMENT ON COLUMN contacts.unsubscribed IS 'CASL: Has contact unsubscribed from communications';
COMMENT ON COLUMN contacts.unsubscribe_date IS 'CASL: When contact unsubscribed';
COMMENT ON COLUMN profiles.province_code IS 'Canadian province/territory code';
COMMENT ON COLUMN profiles.timezone IS 'User timezone for scheduling';
COMMENT ON COLUMN profiles.regulatory_body IS 'Provincial regulatory body (e.g., RECO, BCFSA, RECA)';
COMMENT ON COLUMN profiles.license_expiry IS 'Real estate license expiry date';
COMMENT ON COLUMN properties.source_url IS 'Original listing URL if scraped';
COMMENT ON COLUMN properties.data_source IS 'How property data was added (manual, url scrape, or MLS feed)';