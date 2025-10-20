-- Add missing DELETE policies for data lifecycle management and PIPEDA compliance

-- Calendar settings - users can delete their own settings
CREATE POLICY "Users can delete own calendar settings"
  ON public.calendar_settings FOR DELETE
  USING (auth.uid() = user_id);

-- User analytics - users can delete their own analytics
CREATE POLICY "Users can delete own analytics"
  ON public.user_analytics FOR DELETE
  USING (auth.uid() = user_id);

-- Chatbot settings - users can delete their own chatbot settings
CREATE POLICY "Users can delete own chatbot settings"
  ON public.chatbot_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Engagement stats - users can delete stats for their contacts
CREATE POLICY "Users can delete engagement stats for their contacts"
  ON public.engagement_stats FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.contacts
    WHERE contacts.id = engagement_stats.contact_id
      AND contacts.user_id = auth.uid()
  ));

-- AI lead scores - users can delete scores for their contacts
CREATE POLICY "Users can delete AI scores for their contacts"
  ON public.ai_lead_scores FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.contacts
    WHERE contacts.id = ai_lead_scores.contact_id
      AND contacts.user_id = auth.uid()
  ));

-- Lead scores - users can delete scores for their contacts
CREATE POLICY "Users can delete lead scores for their contacts"
  ON public.lead_scores FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.contacts
    WHERE contacts.id = lead_scores.contact_id
      AND contacts.user_id = auth.uid()
  ));

-- Scheduled emails - users can delete scheduled emails for their contacts
CREATE POLICY "Users can delete scheduled emails for their contacts"
  ON public.scheduled_emails FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.contacts
    WHERE contacts.id = scheduled_emails.contact_id
      AND contacts.user_id = auth.uid()
  ));

-- Email log - admins can delete email logs for cleanup
CREATE POLICY "Admins can delete email logs"
  ON public.email_log FOR DELETE
  USING (public.is_admin());

-- Email captures - admins can delete email captures
CREATE POLICY "Admins can delete email captures"
  ON public.email_captures FOR DELETE
  USING (public.is_admin());

-- Contact submissions - already has admin delete policy, add update for status management
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  USING (public.is_admin());