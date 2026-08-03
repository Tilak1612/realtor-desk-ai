-- lifecycle-cron has been returning 500 on every scheduled run because its
-- profiles query selects two columns that do not exist:
--   first_contact_added_at  (drives the Day-3 activation nudge)
--   preferred_language      (selects the EN/FR email template)
-- PostgREST rejects the unknown columns, the handler hits its error branch and
-- returns 500 in ~300ms. Net effect: the entire trial-retention email sequence
-- (Day 3 / 7 / 12 / 14) has never sent.
--
-- Additive and nullable — no data loss, reversible with DROP COLUMN.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_contact_added_at timestamptz,
  ADD COLUMN IF NOT EXISTS preferred_language text NOT NULL DEFAULT 'en';

-- Constrain to the two locales the templates actually implement.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_preferred_language_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_preferred_language_check
      CHECK (preferred_language IN ('en', 'fr'));
  END IF;
END $$;

-- Backfill first_contact_added_at from each user's earliest contact, so the
-- Day-3 activation check is correct for existing users instead of treating
-- everyone as "never imported anything".
UPDATE public.profiles p
SET first_contact_added_at = c.first_at
FROM (
  SELECT user_id, MIN(created_at) AS first_at
  FROM public.contacts
  WHERE user_id IS NOT NULL
  GROUP BY user_id
) c
WHERE p.id = c.user_id
  AND p.first_contact_added_at IS NULL;

COMMENT ON COLUMN public.profiles.first_contact_added_at IS
  'Timestamp of the user''s first contact. Set on first contact insert; drives the Day-3 activation nudge in lifecycle-cron.';
COMMENT ON COLUMN public.profiles.preferred_language IS
  'UI/email locale: en or fr. Selects the bilingual template in lifecycle-cron.';
