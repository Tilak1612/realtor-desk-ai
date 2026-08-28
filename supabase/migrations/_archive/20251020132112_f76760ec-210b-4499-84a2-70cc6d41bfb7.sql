-- Lead Scores Table
CREATE TABLE IF NOT EXISTS public.lead_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  quality TEXT NOT NULL CHECK (quality IN ('hot', 'warm', 'cold')),
  engagement_score INTEGER DEFAULT 0,
  recency_score INTEGER DEFAULT 0,
  property_match_score INTEGER DEFAULT 0,
  demographics_score INTEGER DEFAULT 0,
  communication_score INTEGER DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lead scores"
ON public.lead_scores FOR SELECT
USING (
  contact_id IN (
    SELECT id FROM public.contacts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own lead scores"
ON public.lead_scores FOR INSERT
WITH CHECK (
  contact_id IN (
    SELECT id FROM public.contacts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own lead scores"
ON public.lead_scores FOR UPDATE
USING (
  contact_id IN (
    SELECT id FROM public.contacts WHERE user_id = auth.uid()
  )
);

CREATE INDEX idx_lead_scores_contact ON public.lead_scores(contact_id);
CREATE INDEX idx_lead_scores_quality ON public.lead_scores(quality);

-- Email Log Table
CREATE TABLE IF NOT EXISTS public.email_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL,
  type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email logs"
ON public.email_log FOR SELECT
USING (
  contact_id IN (
    SELECT id FROM public.contacts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Service role can insert email logs"
ON public.email_log FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_email_log_contact ON public.email_log(contact_id);
CREATE INDEX idx_email_log_sent_at ON public.email_log(sent_at DESC);

-- Scheduled Emails Table
CREATE TABLE IF NOT EXISTS public.scheduled_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL,
  type TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.scheduled_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scheduled emails"
ON public.scheduled_emails FOR SELECT
USING (
  contact_id IN (
    SELECT id FROM public.contacts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Service role can manage scheduled emails"
ON public.scheduled_emails FOR ALL
USING (true)
WITH CHECK (true);

CREATE INDEX idx_scheduled_emails_contact ON public.scheduled_emails(contact_id);
CREATE INDEX idx_scheduled_emails_scheduled_for ON public.scheduled_emails(scheduled_for);
CREATE INDEX idx_scheduled_emails_status ON public.scheduled_emails(status);