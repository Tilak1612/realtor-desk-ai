-- Careers resume storage bucket and RLS policies
-- Creates a private bucket used by /careers form uploads.

-- 1) Create bucket (idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'career-resumes',
  'career-resumes',
  false,
  5242880,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2) Remove old policies if they exist (safe re-run)
DROP POLICY IF EXISTS "Public can upload career resumes" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view career resumes" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update career resumes" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete career resumes" ON storage.objects;

-- 3) Public upload policy for careers page submissions
-- Restrict to this bucket and to the applications/ prefix.
CREATE POLICY "Public can upload career resumes"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'career-resumes'
    AND name LIKE 'applications/%'
  );

-- 4) Admin-only read/manage policies
CREATE POLICY "Admins can view career resumes"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'career-resumes'
    AND public.is_admin()
  );

CREATE POLICY "Admins can update career resumes"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'career-resumes'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'career-resumes'
    AND public.is_admin()
  );

CREATE POLICY "Admins can delete career resumes"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'career-resumes'
    AND public.is_admin()
  );
