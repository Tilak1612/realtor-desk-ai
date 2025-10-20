-- Fix security issues by implementing proper RLS policies
-- Drop all existing policies first to avoid conflicts

-- Drop existing policies for demo_requests
DROP POLICY IF EXISTS "Anyone can view demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Anyone can submit demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Authenticated users can view all demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Authenticated users can update demo requests" ON public.demo_requests;

-- Drop existing policies for contact_submissions
DROP POLICY IF EXISTS "Authenticated users can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.contact_submissions;

-- Drop existing policies for email_captures
DROP POLICY IF EXISTS "Anyone can view email captures" ON public.email_captures;
DROP POLICY IF EXISTS "Anyone can submit emails" ON public.email_captures;
DROP POLICY IF EXISTS "Authenticated users can view all email captures" ON public.email_captures;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (SELECT raw_user_meta_data->>'role' = 'admin' 
       FROM auth.users 
       WHERE id = auth.uid()),
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Demo requests: Only admins can view, anyone can insert (for lead capture)
CREATE POLICY "Only admins can view demo requests"
  ON public.demo_requests
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Public can submit demo requests"
  ON public.demo_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can delete demo requests"
  ON public.demo_requests
  FOR DELETE
  USING (is_admin());

CREATE POLICY "Only admins can update demo requests"
  ON public.demo_requests
  FOR UPDATE
  USING (is_admin());

-- Contact submissions: Only admins can view and manage
CREATE POLICY "Only admins can view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Public can submit contact forms"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Only admins can delete contact submissions"
  ON public.contact_submissions
  FOR DELETE
  USING (is_admin());

-- Email captures: Only admins can view and manage
CREATE POLICY "Only admins can view email captures"
  ON public.email_captures
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Public can submit email captures"
  ON public.email_captures
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can delete email captures"
  ON public.email_captures
  FOR DELETE
  USING (is_admin());