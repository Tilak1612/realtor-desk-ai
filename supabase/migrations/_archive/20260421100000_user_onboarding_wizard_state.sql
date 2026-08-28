-- Phase C wiring: persistent state for the /onboarding 5-step wizard.
-- Adds a single jsonb column to the existing user_onboarding table so we
-- don't explode the schema per wizard step. The UI layer (Phase 4
-- Onboarding.tsx) reads + writes this blob through useOnboardingWizard.
--
-- Shape (enforced by TypeScript, not by the DB):
--   {
--     "currentStep": "welcome" | "profile" | "connect_ddf" | "ai_voice" | "go_live",
--     "completed":   { "<step_id>": "<ISO timestamp>", ... },
--     "profile":     { fullName, brokerage, province, licenseNumber?, preferredLanguage },
--     "ddfConnection": { boardName, connectedAt, listingCount },
--     "aiPersona":   "professional" | "warm" | "witty"
--   }

ALTER TABLE public.user_onboarding
  ADD COLUMN IF NOT EXISTS wizard_state jsonb;

COMMENT ON COLUMN public.user_onboarding.wizard_state IS
  'JSON payload for the 5-step /onboarding wizard (welcome → profile → DDF → AI voice → go live). Shape owned by src/types/rd.ts OnboardingState.';

-- The existing RLS policies cover SELECT/INSERT/UPDATE on the row, which
-- is all we need to read and write this column.
