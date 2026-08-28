-- Update default trial period to 14 days instead of 60 days
ALTER TABLE public.profiles 
ALTER COLUMN trial_ends_at SET DEFAULT (now() + '14 days'::interval);