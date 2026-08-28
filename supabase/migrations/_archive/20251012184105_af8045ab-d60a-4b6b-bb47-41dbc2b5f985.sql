-- Create enum for activity types
CREATE TYPE activity_type AS ENUM (
  'email_sent',
  'email_received', 
  'call_made',
  'call_received',
  'sms_sent',
  'sms_received',
  'meeting_held',
  'note_added',
  'status_changed',
  'tag_added',
  'tag_removed',
  'property_viewed',
  'deal_created',
  'deal_updated'
);

-- Create contact_activities table
CREATE TABLE contact_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  activity_type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact_notes table
CREATE TABLE contact_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create property_interests table
CREATE TABLE property_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  address TEXT NOT NULL,
  price NUMERIC,
  property_type TEXT,
  interest_level TEXT DEFAULT 'medium',
  notes TEXT,
  image_url TEXT,
  viewed_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact_documents table
CREATE TABLE contact_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_activities
CREATE POLICY "Users can view own contact activities"
  ON contact_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contact activities"
  ON contact_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contact activities"
  ON contact_activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contact activities"
  ON contact_activities FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for contact_notes
CREATE POLICY "Users can view own contact notes"
  ON contact_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contact notes"
  ON contact_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contact notes"
  ON contact_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contact notes"
  ON contact_notes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for property_interests
CREATE POLICY "Users can view own property interests"
  ON property_interests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own property interests"
  ON property_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own property interests"
  ON property_interests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own property interests"
  ON property_interests FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for contact_documents
CREATE POLICY "Users can view own contact documents"
  ON contact_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contact documents"
  ON contact_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contact documents"
  ON contact_documents FOR DELETE
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_contact_activities_updated_at
  BEFORE UPDATE ON contact_activities
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_contact_notes_updated_at
  BEFORE UPDATE ON contact_notes
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_property_interests_updated_at
  BEFORE UPDATE ON property_interests
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_contact_activities_contact_id ON contact_activities(contact_id);
CREATE INDEX idx_contact_activities_created_at ON contact_activities(created_at DESC);
CREATE INDEX idx_contact_notes_contact_id ON contact_notes(contact_id);
CREATE INDEX idx_property_interests_contact_id ON property_interests(contact_id);
CREATE INDEX idx_contact_documents_contact_id ON contact_documents(contact_id);

-- Create storage bucket for contact documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-documents', 'contact-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for contact documents — DROP IF EXISTS so this
-- migration can replay against the shared storage plane on preview-branch reset.
DROP POLICY IF EXISTS "Users can upload own contact documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own contact documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own contact documents" ON storage.objects;

CREATE POLICY "Users can upload own contact documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'contact-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own contact documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contact-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own contact documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'contact-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );