-- Add missing columns to contacts table for call workflow
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'new_lead';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS next_followup_date TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_next_followup ON contacts(next_followup_date);
CREATE INDEX IF NOT EXISTS idx_contacts_stage ON contacts(stage);

-- Add comment for documentation
COMMENT ON COLUMN contacts.stage IS 'Current pipeline stage: new_lead, cold_lead, warm_lead, hot_lead, viewing, offer, negotiation, under_contract, closed, lost, past_client, sphere';
COMMENT ON COLUMN contacts.notes IS 'Free-form notes about the contact';
COMMENT ON COLUMN contacts.next_followup_date IS 'Date and time for next scheduled follow-up';
