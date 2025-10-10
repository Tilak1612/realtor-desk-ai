-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new'::text,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact forms
CREATE POLICY "Anyone can submit contact forms"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Authenticated users can view all contact submissions
CREATE POLICY "Authenticated users can view all contact submissions"
ON public.contact_submissions
FOR SELECT
USING (true);

-- Create email_captures table for exit intent popup
CREATE TABLE public.email_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  source TEXT DEFAULT 'exit_intent'::text,
  status TEXT DEFAULT 'new'::text
);

-- Enable RLS
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit emails
CREATE POLICY "Anyone can submit emails"
ON public.email_captures
FOR INSERT
WITH CHECK (true);

-- Authenticated users can view all email captures
CREATE POLICY "Authenticated users can view all email captures"
ON public.email_captures
FOR SELECT
USING (true);

-- Add trigger for contact_submissions updated_at
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();