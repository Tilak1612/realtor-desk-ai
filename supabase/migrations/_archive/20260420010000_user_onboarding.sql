-- DB-backed onboarding checklist state.
-- One row per user. Drives the 5-step card on /today.

CREATE TABLE IF NOT EXISTS public.user_onboarding (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dismissed_at timestamptz,
  step_profile_at timestamptz,
  step_first_contact_at timestamptz,
  step_first_property_at timestamptz,
  step_website_widget_ack_at timestamptz,
  step_calendar_connected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_onboarding_user ON public.user_onboarding(user_id);

ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own onboarding row"
  ON public.user_onboarding FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users upsert own onboarding row"
  ON public.user_onboarding FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own onboarding row"
  ON public.user_onboarding FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.user_onboarding IS 'Persistent state for the /today onboarding checklist (PR F). Dismissal + per-step completion timestamps.';
