-- Allow public lead submissions through website forms
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can submit leads via contact form" ON public.contacts;

-- Create policy to enable public contact form submissions
CREATE POLICY "Public can submit leads via contact form"
  ON public.contacts
  FOR INSERT
  WITH CHECK (true);

-- Add an index on email for duplicate detection
CREATE INDEX IF NOT EXISTS idx_contacts_email 
  ON public.contacts(email) 
  WHERE email IS NOT NULL;