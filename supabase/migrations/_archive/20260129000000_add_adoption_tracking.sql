-- Create adoption_events table for tracking user adoption metrics
CREATE TABLE IF NOT EXISTS adoption_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_adoption_events_user_id ON adoption_events(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_events_event_type ON adoption_events(event_type);
CREATE INDEX IF NOT EXISTS idx_adoption_events_created_at ON adoption_events(created_at);

-- Enable RLS
ALTER TABLE adoption_events ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own events
CREATE POLICY "Users can insert their own adoption events"
  ON adoption_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to read their own events
CREATE POLICY "Users can read their own adoption events"
  ON adoption_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create contact_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  notes TEXT,
  activity_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_contact_activities_contact_id ON contact_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_activities_user_id ON contact_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_activities_activity_date ON contact_activities(activity_date);

-- Enable RLS
ALTER TABLE contact_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own contact activities"
  ON contact_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own contact activities"
  ON contact_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own contact activities"
  ON contact_activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contact activities"
  ON contact_activities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_feedback table for collecting feedback
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_url TEXT,
  feedback_type TEXT,
  was_helpful BOOLEAN,
  comment TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);

-- Enable RLS
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own feedback"
  ON user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own feedback"
  ON user_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
