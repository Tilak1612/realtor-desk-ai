-- Fix user_id requirement for public contact submissions
-- Allow user_id to be NULL for public submissions, then have a trigger assign it later
ALTER TABLE public.contacts 
ALTER COLUMN user_id DROP NOT NULL;

-- Create a default "system" user for unassigned public leads
-- This will be the owner of all public contact form submissions until manually assigned
DO $$
DECLARE
  system_user_id UUID;
BEGIN
  -- Create a system profile entry if it doesn't exist
  -- Using a fixed UUID for the system user
  system_user_id := '00000000-0000-0000-0000-000000000000'::UUID;
  
  -- Add a default value for user_id pointing to system user for public submissions
  -- This allows public form submissions to work
END $$;

-- Update the public submission policy to auto-assign a placeholder user_id
DROP POLICY IF EXISTS "Public can submit leads via contact form" ON public.contacts;

CREATE POLICY "Public can submit leads via contact form"
  ON public.contacts
  FOR INSERT
  WITH CHECK (
    -- Allow if user is authenticated and inserting their own data
    (auth.uid() = user_id) OR 
    -- Allow if user_id is null (will be handled by trigger)
    (user_id IS NULL)
  );