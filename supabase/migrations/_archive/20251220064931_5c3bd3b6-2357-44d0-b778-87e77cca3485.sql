-- Create import_history table to track all import runs
CREATE TABLE public.import_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  import_type TEXT NOT NULL, -- 'listings', 'agents', 'combined'
  source_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  total_records INTEGER DEFAULT 0,
  saved_records INTEGER DEFAULT 0,
  duplicate_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  raw_payload JSONB, -- Store raw Apify response for debugging
  error_message TEXT,
  parser_version TEXT DEFAULT '1.0.0',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create apify_usage table to track API usage per user
CREATE TABLE public.apify_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL,
  credits_used NUMERIC DEFAULT 0,
  records_fetched INTEGER DEFAULT 0,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  import_history_id UUID REFERENCES public.import_history(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add is_qa_account column to profiles for QA bypass
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_qa_account BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.import_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apify_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for import_history
CREATE POLICY "Users can view their own import history"
  ON public.import_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own import history"
  ON public.import_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own import history"
  ON public.import_history FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for apify_usage
CREATE POLICY "Users can view their own apify usage"
  ON public.apify_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own apify usage"
  ON public.apify_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_import_history_user_id ON public.import_history(user_id);
CREATE INDEX idx_import_history_status ON public.import_history(status);
CREATE INDEX idx_apify_usage_user_id ON public.apify_usage(user_id);
CREATE INDEX idx_apify_usage_request_date ON public.apify_usage(request_date);

-- Create a function to check daily rate limit (10 imports per day)
CREATE OR REPLACE FUNCTION public.check_apify_rate_limit(checking_user_id UUID, max_daily_imports INTEGER DEFAULT 10)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  daily_count INTEGER;
  is_qa BOOLEAN;
BEGIN
  -- Check if user is QA account (bypass rate limit)
  SELECT is_qa_account INTO is_qa FROM profiles WHERE id = checking_user_id;
  IF is_qa = true THEN
    RETURN true;
  END IF;
  
  -- Count today's imports
  SELECT COUNT(*) INTO daily_count
  FROM import_history
  WHERE user_id = checking_user_id
    AND DATE(created_at) = CURRENT_DATE
    AND status != 'failed';
  
  RETURN daily_count < max_daily_imports;
END;
$$;

-- Create a function to check for concurrent imports
CREATE OR REPLACE FUNCTION public.check_concurrent_import(checking_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  running_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO running_count
  FROM import_history
  WHERE user_id = checking_user_id
    AND status = 'running';
  
  RETURN running_count = 0;
END;
$$;