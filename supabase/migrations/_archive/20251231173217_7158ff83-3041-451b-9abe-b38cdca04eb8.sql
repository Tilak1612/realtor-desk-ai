-- Email Automation Tables for MVP

-- Email automation workflows
CREATE TABLE public.email_automations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('new_lead', 'lead_score_change', 'tag_added', 'deal_stage_change', 'manual', 'schedule')),
  trigger_config JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Automation steps (the individual actions in a workflow)
CREATE TABLE public.automation_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES public.email_automations(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('send_email', 'wait', 'add_tag', 'update_score', 'create_task', 'send_notification')),
  action_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track contact enrollments in automations
CREATE TABLE public.automation_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES public.email_automations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_action_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Automation execution logs
CREATE TABLE public.automation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES public.email_automations(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.automation_enrollments(id) ON DELETE CASCADE,
  step_id UUID REFERENCES public.automation_steps(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'skipped')),
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on all tables
ALTER TABLE public.email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_automations
CREATE POLICY "Users can view their own automations" 
ON public.email_automations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own automations" 
ON public.email_automations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automations" 
ON public.email_automations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own automations" 
ON public.email_automations FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for automation_steps (via automation ownership)
CREATE POLICY "Users can view steps of their automations" 
ON public.automation_steps FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create steps for their automations" 
ON public.automation_steps FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update steps of their automations" 
ON public.automation_steps FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can delete steps of their automations" 
ON public.automation_steps FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

-- RLS Policies for automation_enrollments
CREATE POLICY "Users can view enrollments of their automations" 
ON public.automation_enrollments FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create enrollments for their automations" 
ON public.automation_enrollments FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update enrollments of their automations" 
ON public.automation_enrollments FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can delete enrollments of their automations" 
ON public.automation_enrollments FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

-- RLS Policies for automation_logs
CREATE POLICY "Users can view logs of their automations" 
ON public.automation_logs FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create logs for their automations" 
ON public.automation_logs FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.email_automations 
  WHERE id = automation_id AND user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_email_automations_user_id ON public.email_automations(user_id);
CREATE INDEX idx_email_automations_status ON public.email_automations(status);
CREATE INDEX idx_automation_steps_automation_id ON public.automation_steps(automation_id);
CREATE INDEX idx_automation_enrollments_automation_id ON public.automation_enrollments(automation_id);
CREATE INDEX idx_automation_enrollments_contact_id ON public.automation_enrollments(contact_id);
CREATE INDEX idx_automation_enrollments_next_action ON public.automation_enrollments(next_action_at) WHERE status = 'active';
CREATE INDEX idx_automation_logs_automation_id ON public.automation_logs(automation_id);

-- Triggers for updated_at
CREATE TRIGGER update_email_automations_updated_at
BEFORE UPDATE ON public.email_automations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();