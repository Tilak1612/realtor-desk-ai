-- Fix search_path security warning for set_user_id_from_auth function
CREATE OR REPLACE FUNCTION public.set_user_id_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set user_id if it's NULL and user is authenticated
  IF NEW.user_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;