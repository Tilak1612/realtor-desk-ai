-- Fix 1: Add trigger to auto-set user_id for contacts when authenticated
CREATE OR REPLACE FUNCTION public.set_user_id_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set user_id if it's NULL and user is authenticated
  IF NEW.user_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to contacts table
DROP TRIGGER IF EXISTS set_contacts_user_id ON public.contacts;
CREATE TRIGGER set_contacts_user_id
  BEFORE INSERT ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id_from_auth();

-- Apply trigger to deals table
DROP TRIGGER IF EXISTS set_deals_user_id ON public.deals;
CREATE TRIGGER set_deals_user_id
  BEFORE INSERT ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id_from_auth();

-- Apply trigger to tasks table
DROP TRIGGER IF EXISTS set_tasks_user_id ON public.tasks;
CREATE TRIGGER set_tasks_user_id
  BEFORE INSERT ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id_from_auth();

-- Apply trigger to property_listings table
DROP TRIGGER IF EXISTS set_property_listings_user_id ON public.property_listings;
CREATE TRIGGER set_property_listings_user_id
  BEFORE INSERT ON public.property_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id_from_auth();

-- Fix 2: Add unique constraint on contacts email per user to handle duplicates properly
CREATE UNIQUE INDEX IF NOT EXISTS contacts_user_email_unique 
ON public.contacts(user_id, email) 
WHERE user_id IS NOT NULL AND email IS NOT NULL;

-- Fix 3: Add validation for email format
ALTER TABLE public.contacts
ADD CONSTRAINT contacts_email_format_check 
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Fix 4: Add constraint for deal value to be positive
ALTER TABLE public.deals
ADD CONSTRAINT deals_value_positive_check 
CHECK (value IS NULL OR value >= 0);

-- Fix 5: Add constraint for probability to be between 0 and 100
ALTER TABLE public.deals
ADD CONSTRAINT deals_probability_range_check 
CHECK (probability >= 0 AND probability <= 100);