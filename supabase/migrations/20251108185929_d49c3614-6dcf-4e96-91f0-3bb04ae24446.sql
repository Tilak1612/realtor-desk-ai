-- Add missing status field to contacts table for lead management
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'lead';

-- Add lead_score as alias/computed from ai_score for API compatibility
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0;

-- Update existing records to sync lead_score with ai_score
UPDATE public.contacts 
SET lead_score = ai_score 
WHERE lead_score = 0 OR lead_score IS NULL;