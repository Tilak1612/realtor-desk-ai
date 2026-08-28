-- Align DB default with the advertised 14-day free trial.
--
-- A migration with this intent (20251218052356) existed in the repo but
-- was never applied to the live project — the live column default was
-- still (now() + '60 days'::interval), which meant every real signup
-- silently received 60 days instead of the 14 days promised on every
-- marketing surface.
--
-- This migration is UPDATE-safe: it only changes the default for future
-- INSERTs. Existing users keep whatever trial_ends_at they already had,
-- by intent — shrinking an active user's trial after they signed up
-- would be a bait-and-switch. Any retroactive adjustment is a product
-- decision and should be done with an explicit UPDATE + user comms.

ALTER TABLE public.profiles
  ALTER COLUMN trial_ends_at SET DEFAULT (now() + '14 days'::interval);
