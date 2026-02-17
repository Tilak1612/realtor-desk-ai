import type { Json } from "@/integrations/supabase/types";

export interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  source: string | null;
  status: string | null;
  tags: string[] | null;
  ai_score: number | null;
  lead_score: number | null;
  best_contact_time: string | null;
  last_contact_date: string | null;
  preferred_language: string | null;
  consent_given: boolean | null;
  consent_date: string | null;
  consent_source: string | null;
  unsubscribed: boolean | null;
  unsubscribe_date: string | null;
  metadata: Record<string, string> | null;
  avatar_url?: string;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ContactActivity {
  id: string;
  contact_id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ContactNote {
  id: string;
  contact_id: string;
  user_id: string;
  content: string;
  is_pinned: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ContactDocument {
  id: string;
  contact_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

export interface Deal {
  id: string;
  title: string;
  stage: string;
  status: string | null;
  value: number | null;
  contact_id: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  [key: string]: unknown;
}

export interface EngagementStat {
  id: string;
  contact_id: string;
  emails_sent: number | null;
  emails_opened: number | null;
  emails_clicked: number | null;
  emails_replied: number | null;
  website_visits: number | null;
  documents_viewed: number | null;
  properties_viewed: number | null;
  avg_session_duration: number | null;
  last_email_opened: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyInterest {
  id: string;
  contact_id: string;
  address: string;
  price: number | null;
  property_type: string | null;
  interest_level: string;
  notes: string | null;
  viewed_date: string | null;
  created_at: string;
  [key: string]: unknown;
}
