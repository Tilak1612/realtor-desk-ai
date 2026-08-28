-- Create deals table
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'lead',
  value DECIMAL(12,2),
  probability INTEGER DEFAULT 50,
  expected_close_date DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deals"
ON public.deals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deals"
ON public.deals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deals"
ON public.deals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deals"
ON public.deals FOR DELETE
USING (auth.uid() = user_id);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  due_time TIME,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
ON public.tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);

-- Add AI score to contacts
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS ai_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS best_contact_time TEXT;

-- Create analytics table for dashboard stats
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  monthly_leads INTEGER DEFAULT 0,
  leads_change_percent DECIMAL(5,2) DEFAULT 0,
  active_deals_count INTEGER DEFAULT 0,
  pipeline_value DECIMAL(12,2) DEFAULT 0,
  ytd_revenue DECIMAL(12,2) DEFAULT 0,
  annual_goal DECIMAL(12,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
ON public.user_analytics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
ON public.user_analytics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
ON public.user_analytics FOR UPDATE
USING (auth.uid() = user_id);

-- Add triggers
CREATE TRIGGER update_deals_updated_at
BEFORE UPDATE ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_analytics_updated_at
BEFORE UPDATE ON public.user_analytics
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();