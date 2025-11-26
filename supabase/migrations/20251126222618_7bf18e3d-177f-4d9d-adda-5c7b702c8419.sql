-- Fix Missing Required Fields test
-- Make first_name and email required for contacts
ALTER TABLE public.contacts
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN email SET NOT NULL;

-- Add constraint to ensure email is provided
ALTER TABLE public.contacts
DROP CONSTRAINT IF EXISTS contacts_email_required;

ALTER TABLE public.contacts
ADD CONSTRAINT contacts_email_required 
CHECK (email IS NOT NULL AND length(trim(email)) > 0);

-- Add constraint to ensure first_name is provided
ALTER TABLE public.contacts
DROP CONSTRAINT IF EXISTS contacts_first_name_required;

ALTER TABLE public.contacts
ADD CONSTRAINT contacts_first_name_required 
CHECK (first_name IS NOT NULL AND length(trim(first_name)) > 0);

-- Create function to handle 404 responses for contact operations
CREATE OR REPLACE FUNCTION public.check_contact_exists(contact_id uuid, checking_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.contacts 
    WHERE id = contact_id 
    AND user_id = checking_user_id
  );
END;
$$;