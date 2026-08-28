-- Lifecycle tracking fields for automated email sequences
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS lifecycle_stage text DEFAULT 'onboarding'
    CHECK (lifecycle_stage IN ('onboarding', 'activated', 'engaged', 'converting', 'subscribed', 'churned')),
  ADD COLUMN IF NOT EXISTS first_lead_imported_at timestamptz,
  ADD COLUMN IF NOT EXISTS first_contact_added_at timestamptz,
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr'));

-- Index for lifecycle cron queries
CREATE INDEX IF NOT EXISTS idx_profiles_lifecycle
  ON profiles (subscription_status, lifecycle_stage, created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_trial_ends
  ON profiles (trial_ends_at)
  WHERE subscription_status = 'trial';

-- Track which lifecycle emails have been sent per user
-- (extends existing email_events table usage)
COMMENT ON TABLE email_events IS 'Tracks all lifecycle and transactional emails sent. Used for dedup and sequence tracking.';
