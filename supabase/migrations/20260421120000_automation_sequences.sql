-- Phase F wiring: automation_sequences + automation_steps.
--
-- Matches AutomationSequence / AutomationStep in src/types/rd.ts so
-- Automation.tsx can read + write without a translation layer. No
-- execution runtime yet — that's a separate product surface; this
-- migration is the data spine the UI writes into.

CREATE TABLE IF NOT EXISTS public.automation_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  trigger text NOT NULL CHECK (
    trigger IN (
      'lead.created',
      'lead.wentCold',
      'showing.scheduled',
      'consent.captured'
    )
  ),
  active boolean NOT NULL DEFAULT false,
  last_run_at timestamptz,
  stats_30d jsonb NOT NULL DEFAULT '{"sent":0,"opened":0,"replied":0}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_automation_sequences_user
  ON public.automation_sequences(user_id);

ALTER TABLE public.automation_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own sequences"
  ON public.automation_sequences FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own sequences"
  ON public.automation_sequences FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own sequences"
  ON public.automation_sequences FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users delete own sequences"
  ON public.automation_sequences FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.automation_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES public.automation_sequences(id) ON DELETE CASCADE NOT NULL,
  position integer NOT NULL,
  kind text NOT NULL CHECK (kind IN ('wait', 'email', 'sms', 'task', 'ai_followup')),
  label text NOT NULL,
  hours numeric,
  template_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_automation_steps_sequence
  ON public.automation_steps(sequence_id, position);

ALTER TABLE public.automation_steps ENABLE ROW LEVEL SECURITY;

-- Step RLS rides on the parent sequence's ownership.
CREATE POLICY "users read own steps"
  ON public.automation_steps FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.automation_sequences s
    WHERE s.id = automation_steps.sequence_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "users insert own steps"
  ON public.automation_steps FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.automation_sequences s
    WHERE s.id = automation_steps.sequence_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "users update own steps"
  ON public.automation_steps FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.automation_sequences s
    WHERE s.id = automation_steps.sequence_id AND s.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.automation_sequences s
    WHERE s.id = automation_steps.sequence_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "users delete own steps"
  ON public.automation_steps FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.automation_sequences s
    WHERE s.id = automation_steps.sequence_id AND s.user_id = auth.uid()
  ));

COMMENT ON TABLE public.automation_sequences IS
  'Drip / trigger-based sequences rendered on /app/automation. '
  'Execution runtime ships separately.';
COMMENT ON TABLE public.automation_steps IS
  'Individual steps inside a sequence. position is 1-based.';
