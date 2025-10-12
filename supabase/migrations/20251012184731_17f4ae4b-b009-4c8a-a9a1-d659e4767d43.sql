-- Create ai_lead_scores table
CREATE TABLE ai_lead_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB NOT NULL DEFAULT '{}'::jsonb,
  prediction_confidence NUMERIC(3,2) NOT NULL,
  recommended_actions TEXT[] NOT NULL DEFAULT '{}',
  optimal_contact_time TEXT,
  insights TEXT,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contact_id)
);

-- Enable RLS
ALTER TABLE ai_lead_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view scores for their contacts"
  ON ai_lead_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = ai_lead_scores.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert scores for their contacts"
  ON ai_lead_scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = ai_lead_scores.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update scores for their contacts"
  ON ai_lead_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = ai_lead_scores.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_ai_lead_scores_updated_at
  BEFORE UPDATE ON ai_lead_scores
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create indexes
CREATE INDEX idx_ai_lead_scores_contact_id ON ai_lead_scores(contact_id);
CREATE INDEX idx_ai_lead_scores_score ON ai_lead_scores(score DESC);
CREATE INDEX idx_ai_lead_scores_calculated_at ON ai_lead_scores(calculated_at DESC);

-- Create engagement_stats table to track email and website analytics
CREATE TABLE engagement_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_replied INTEGER DEFAULT 0,
  last_email_opened TIMESTAMPTZ,
  website_visits INTEGER DEFAULT 0,
  properties_viewed INTEGER DEFAULT 0,
  documents_viewed INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contact_id)
);

-- Enable RLS for engagement_stats
ALTER TABLE engagement_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view engagement stats for their contacts"
  ON engagement_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = engagement_stats.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert engagement stats for their contacts"
  ON engagement_stats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = engagement_stats.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update engagement stats for their contacts"
  ON engagement_stats FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = engagement_stats.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

CREATE TRIGGER update_engagement_stats_updated_at
  BEFORE UPDATE ON engagement_stats
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX idx_engagement_stats_contact_id ON engagement_stats(contact_id);