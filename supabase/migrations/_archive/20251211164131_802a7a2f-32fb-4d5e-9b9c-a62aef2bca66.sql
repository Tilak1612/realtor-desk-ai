-- Remove the vulnerable public insert policy that allows unauthenticated database spam
DROP POLICY IF EXISTS "Public can submit leads via contact form" ON public.contacts;

-- The "Users can insert own contacts" policy already exists and requires auth.uid() = user_id
-- This ensures only authenticated users can insert contacts for themselves