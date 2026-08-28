-- Create SMS messages table
CREATE TABLE public.sms_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  message TEXT NOT NULL,
  to_phone TEXT NOT NULL,
  from_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'sent', 'delivered', 'failed', 'undelivered')),
  twilio_sid TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create SMS templates table
CREATE TABLE public.sms_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT,
  variables TEXT[],
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create SMS consent table for CASL compliance
CREATE TABLE public.sms_consent (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opted_in BOOLEAN NOT NULL DEFAULT false,
  opted_in_at TIMESTAMPTZ,
  opted_out_at TIMESTAMPTZ,
  consent_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contact_id, user_id)
);

-- Enable RLS
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_consent ENABLE ROW LEVEL SECURITY;

-- RLS policies for sms_messages
CREATE POLICY "Users can view their own SMS messages" 
ON public.sms_messages FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create SMS messages" 
ON public.sms_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SMS messages" 
ON public.sms_messages FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for sms_templates
CREATE POLICY "Users can view their own SMS templates" 
ON public.sms_templates FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create SMS templates" 
ON public.sms_templates FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SMS templates" 
ON public.sms_templates FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SMS templates" 
ON public.sms_templates FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for sms_consent
CREATE POLICY "Users can view SMS consent for their contacts" 
ON public.sms_consent FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create SMS consent" 
ON public.sms_consent FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update SMS consent" 
ON public.sms_consent FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_sms_messages_user_id ON public.sms_messages(user_id);
CREATE INDEX idx_sms_messages_contact_id ON public.sms_messages(contact_id);
CREATE INDEX idx_sms_messages_status ON public.sms_messages(status);
CREATE INDEX idx_sms_templates_user_id ON public.sms_templates(user_id);
CREATE INDEX idx_sms_consent_contact_id ON public.sms_consent(contact_id);

-- Triggers for updated_at
CREATE TRIGGER update_sms_messages_updated_at
BEFORE UPDATE ON public.sms_messages
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sms_templates_updated_at
BEFORE UPDATE ON public.sms_templates
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sms_consent_updated_at
BEFORE UPDATE ON public.sms_consent
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();