-- ─────────────────────────────────────────────────────────────────────────────
-- BASELINE: production schema, generated from the live database.
--
-- Regenerate with: SUPABASE_ACCESS_TOKEN=... ./scripts/generate-schema-baseline.sh
--
-- This replaces 51 hand-maintained migration files that had drifted badly from
-- production. They created 64 tables against production's 41, two of them could
-- not replay on a clean database at all, and replaying the set would have
-- introduced RLS holes production does not have (an email_log INSERT policy and
-- a scheduled_emails ALL policy, both named for the service role but with no TO
-- clause, so both applied to PUBLIC). The old files are kept for history under
-- supabase/migrations/_archive/ and are not applied.
--
-- Everything below is generated, so it cannot drift by hand again.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Types ──────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.activity_type AS ENUM ('email_sent', 'email_received', 'call_made', 'call_received', 'sms_sent', 'sms_received', 'meeting_held', 'note_added', 'status_changed', 'tag_added', 'tag_removed', 'property_viewed', 'deal_created', 'deal_updated');
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'cancelled', 'expired');
  CREATE TYPE public.subscription_tier AS ENUM ('agent', 'team', 'brokerage');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Tables ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adoption_events (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_lead_scores (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  contact_id uuid NOT NULL,
  score integer NOT NULL,
  factors jsonb DEFAULT '{}'::jsonb NOT NULL,
  prediction_confidence numeric(3,2) DEFAULT 0.5 NOT NULL,
  recommended_actions text[] DEFAULT '{}'::text[] NOT NULL,
  optimal_contact_time text,
  insights text,
  calculated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.apify_usage (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  actor_id text NOT NULL,
  records_fetched integer DEFAULT 0 NOT NULL,
  import_history_id uuid,
  request_date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.automation_enrollments (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  sequence_id uuid NOT NULL,
  contact_id uuid NOT NULL,
  current_step integer DEFAULT 0 NOT NULL,
  status text DEFAULT 'active'::text NOT NULL,
  enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
  completed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.automation_sequence_steps (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  sequence_id uuid NOT NULL,
  "position" integer NOT NULL,
  kind text NOT NULL,
  label text NOT NULL,
  hours integer,
  template_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.automation_sequences (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  trigger text NOT NULL,
  active boolean DEFAULT false NOT NULL,
  last_run_at timestamp with time zone,
  stats_30d jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.automation_steps (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  automation_id uuid NOT NULL,
  step_order integer NOT NULL,
  action_type text NOT NULL,
  action_config jsonb DEFAULT '{}'::jsonb NOT NULL,
  delay_days integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.calendar_settings (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  availability jsonb DEFAULT '{}'::jsonb,
  buffer_time integer DEFAULT 15,
  meeting_types jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chatbot_settings (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  bot_name text DEFAULT 'RealtorBot'::text NOT NULL,
  greeting_message text,
  qualification_questions text[],
  handoff_rules text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_activities (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  contact_id uuid NOT NULL,
  user_id uuid NOT NULL,
  activity_type activity_type NOT NULL,
  title text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  activity_date timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_documents (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  contact_id uuid NOT NULL,
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_notes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  contact_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new'::text NOT NULL,
  title text,
  description text,
  variant text,
  duration text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  first_name text,
  last_name text,
  email text,
  phone text,
  source text,
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  ai_score integer DEFAULT 0,
  last_contact_date timestamp with time zone,
  best_contact_time text,
  stage text DEFAULT 'new_lead'::text,
  notes text,
  next_followup_date timestamp with time zone,
  consent_date timestamp with time zone,
  casl_consent boolean DEFAULT false,
  preferred_language text DEFAULT 'English'::text,
  consent_given boolean DEFAULT false,
  consent_source text,
  unsubscribed boolean DEFAULT false,
  unsubscribe_date timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  lead_id uuid NOT NULL,
  channel text DEFAULT 'chat'::text NOT NULL,
  author text NOT NULL,
  author_name text,
  body text NOT NULL,
  language text DEFAULT 'EN'::text NOT NULL,
  sent_at timestamp with time zone DEFAULT now() NOT NULL,
  system_note text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ddf_properties (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  mls_number text NOT NULL,
  board text,
  listing_type text,
  property_type text,
  status text,
  street_address text,
  city text,
  province text,
  postal_code text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  price numeric(12,2),
  bedrooms smallint,
  bathrooms smallint,
  square_feet numeric(10,2),
  lot_size_sqft numeric(12,2),
  year_built smallint,
  description text,
  photo_urls text[] DEFAULT '{}'::text[],
  virtual_tour_url text,
  listing_agent_name text,
  listing_agent_phone text,
  listing_brokerage text,
  source text DEFAULT 'crea_ddf'::text NOT NULL,
  raw_payload jsonb,
  synced_at timestamp with time zone DEFAULT now() NOT NULL,
  listed_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ddf_sync_log (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  started_at timestamp with time zone DEFAULT now() NOT NULL,
  completed_at timestamp with time zone,
  listings_fetched integer DEFAULT 0,
  listings_upserted integer DEFAULT 0,
  listings_errors integer DEFAULT 0,
  error_details jsonb,
  status text DEFAULT 'running'::text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.deals (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  contact_id uuid,
  title text NOT NULL,
  stage text DEFAULT 'lead'::text NOT NULL,
  value numeric(12,2),
  probability integer DEFAULT 50,
  expected_close_date date,
  status text DEFAULT 'active'::text,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  listing_price numeric,
  commission_percentage numeric,
  closing_date date
);

CREATE TABLE IF NOT EXISTS public.demo_requests (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  brokerage text,
  province text,
  current_crm text,
  team_size text,
  biggest_challenge text,
  comments text,
  status text DEFAULT 'new'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_automations (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL,
  status text DEFAULT 'draft'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_captures (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  email text NOT NULL,
  source text NOT NULL,
  status text DEFAULT 'active'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_events (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  sent_at timestamp with time zone DEFAULT now() NOT NULL,
  recipient_email text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.email_log (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  contact_id uuid NOT NULL,
  type text NOT NULL,
  sent_at timestamp with time zone DEFAULT now() NOT NULL,
  status text DEFAULT 'sent'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_suppressions (
  email text NOT NULL,
  source text NOT NULL,
  user_id uuid,
  contact_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.engagement_stats (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  contact_id uuid NOT NULL,
  emails_sent integer DEFAULT 0,
  emails_opened integer DEFAULT 0,
  emails_clicked integer DEFAULT 0,
  emails_replied integer DEFAULT 0,
  last_email_opened timestamp with time zone,
  website_visits integer DEFAULT 0,
  properties_viewed integer DEFAULT 0,
  documents_viewed integer DEFAULT 0,
  avg_session_duration integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.import_history (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  import_type text NOT NULL,
  source_url text NOT NULL,
  status text DEFAULT 'pending'::text NOT NULL,
  total_records integer,
  saved_records integer,
  duplicate_records integer,
  failed_records integer,
  raw_payload jsonb,
  error_message text,
  parser_version text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.integration_connections (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  status text DEFAULT 'connected'::text NOT NULL,
  credentials_encrypted text,
  connected_account_label text,
  connection_method text,
  sync_direction text DEFAULT 'one_way_out'::text,
  sync_config jsonb DEFAULT '{}'::jsonb,
  last_sync_at timestamp with time zone,
  last_sync_status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  webhook_token text,
  last_sync_error text,
  sync_count_total integer DEFAULT 0,
  last_reauth_email_sent_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.integration_interest (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.integration_requests (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  tool_name text NOT NULL,
  use_case text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.integrations (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  provider text NOT NULL,
  provider_type text NOT NULL,
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_magnet_requests (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oauth_state_store (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  state text NOT NULL,
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  company_name text,
  role text DEFAULT 'agent'::text,
  subscription_tier subscription_tier DEFAULT 'agent'::subscription_tier,
  subscription_status subscription_status DEFAULT 'trial'::subscription_status,
  trial_ends_at timestamp with time zone,
  onboarding_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  province text,
  city text,
  license_number text,
  onboarding_step integer DEFAULT 1,
  avatar_url text,
  primary_language text DEFAULT 'english'::text,
  business_preferences jsonb DEFAULT '{}'::jsonb,
  first_contact_added_at timestamp with time zone,
  preferred_language text DEFAULT 'en'::text NOT NULL,
  is_demo boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS public.property_interests (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  contact_id uuid NOT NULL,
  user_id uuid NOT NULL,
  address text NOT NULL,
  price numeric,
  property_type text,
  interest_level text DEFAULT 'medium'::text,
  notes text,
  image_url text,
  viewed_date date,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.property_listings (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  address text NOT NULL,
  city text,
  province text,
  postal_code text,
  property_type text,
  listing_type text DEFAULT 'sale'::text,
  price numeric,
  bedrooms integer,
  bathrooms numeric,
  square_feet integer,
  lot_size numeric,
  year_built integer,
  status text DEFAULT 'active'::text,
  image_url text,
  images jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  source text DEFAULT 'manual'::text,
  source_listing_id text,
  mls_number text,
  realtor_ca_url text,
  street text,
  country text DEFAULT 'CA'::text,
  currency text DEFAULT 'CAD'::text,
  photos_json jsonb DEFAULT '[]'::jsonb,
  raw_source_payload jsonb,
  data_source text
);

CREATE TABLE IF NOT EXISTS public.scheduled_emails (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  contact_id uuid NOT NULL,
  type text NOT NULL,
  scheduled_for timestamp with time zone NOT NULL,
  status text DEFAULT 'scheduled'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sms_consent (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  contact_id uuid NOT NULL,
  opted_in boolean DEFAULT false NOT NULL,
  consent_type text DEFAULT 'express'::text NOT NULL,
  consent_source text,
  opted_in_at timestamp with time zone,
  opted_out_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  contact_id uuid,
  deal_id uuid,
  title text NOT NULL,
  description text,
  due_date date,
  due_time time without time zone,
  priority text DEFAULT 'medium'::text,
  status text DEFAULT 'pending'::text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_analytics (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  monthly_leads integer DEFAULT 0,
  leads_change_percent numeric(5,2) DEFAULT 0,
  active_deals_count integer DEFAULT 0,
  pipeline_value numeric(12,2) DEFAULT 0,
  ytd_revenue numeric(12,2) DEFAULT 0,
  annual_goal numeric(12,2) DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_feedback (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  page_url text,
  feedback_type text,
  was_helpful boolean,
  comment text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_onboarding (
  user_id uuid NOT NULL,
  dismissed_at timestamp with time zone,
  step_profile_at timestamp with time zone,
  step_first_contact_at timestamp with time zone,
  step_first_property_at timestamp with time zone,
  step_website_widget_ack_at timestamp with time zone,
  step_calendar_connected_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  wizard_state jsonb
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  connection_id uuid,
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  received_at timestamp with time zone DEFAULT now(),
  processing_status text DEFAULT 'received'::text NOT NULL,
  contact_id uuid,
  processing_error text
);

-- ── Constraints ────────────────────────────────────────────────────────
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'adoption_events_pkey' AND conrelid = 'public.adoption_events'::regclass) THEN ALTER TABLE public.adoption_events ADD CONSTRAINT adoption_events_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'adoption_events_user_id_fkey' AND conrelid = 'public.adoption_events'::regclass) THEN ALTER TABLE public.adoption_events ADD CONSTRAINT adoption_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_lead_scores_contact_id_key' AND conrelid = 'public.ai_lead_scores'::regclass) THEN ALTER TABLE public.ai_lead_scores ADD CONSTRAINT ai_lead_scores_contact_id_key UNIQUE (contact_id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_lead_scores_pkey' AND conrelid = 'public.ai_lead_scores'::regclass) THEN ALTER TABLE public.ai_lead_scores ADD CONSTRAINT ai_lead_scores_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_lead_scores_contact_id_fkey' AND conrelid = 'public.ai_lead_scores'::regclass) THEN ALTER TABLE public.ai_lead_scores ADD CONSTRAINT ai_lead_scores_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_lead_scores_score_check' AND conrelid = 'public.ai_lead_scores'::regclass) THEN ALTER TABLE public.ai_lead_scores ADD CONSTRAINT ai_lead_scores_score_check CHECK (((score >= 0) AND (score <= 100))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'apify_usage_pkey' AND conrelid = 'public.apify_usage'::regclass) THEN ALTER TABLE public.apify_usage ADD CONSTRAINT apify_usage_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'apify_usage_import_history_id_fkey' AND conrelid = 'public.apify_usage'::regclass) THEN ALTER TABLE public.apify_usage ADD CONSTRAINT apify_usage_import_history_id_fkey FOREIGN KEY (import_history_id) REFERENCES import_history(id) ON DELETE SET NULL; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'apify_usage_user_id_fkey' AND conrelid = 'public.apify_usage'::regclass) THEN ALTER TABLE public.apify_usage ADD CONSTRAINT apify_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_enrollments_sequence_id_contact_id_key' AND conrelid = 'public.automation_enrollments'::regclass) THEN ALTER TABLE public.automation_enrollments ADD CONSTRAINT automation_enrollments_sequence_id_contact_id_key UNIQUE (sequence_id, contact_id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_enrollments_pkey' AND conrelid = 'public.automation_enrollments'::regclass) THEN ALTER TABLE public.automation_enrollments ADD CONSTRAINT automation_enrollments_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_enrollments_contact_id_fkey' AND conrelid = 'public.automation_enrollments'::regclass) THEN ALTER TABLE public.automation_enrollments ADD CONSTRAINT automation_enrollments_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_enrollments_sequence_id_fkey' AND conrelid = 'public.automation_enrollments'::regclass) THEN ALTER TABLE public.automation_enrollments ADD CONSTRAINT automation_enrollments_sequence_id_fkey FOREIGN KEY (sequence_id) REFERENCES automation_sequences(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_enrollments_user_id_fkey' AND conrelid = 'public.automation_enrollments'::regclass) THEN ALTER TABLE public.automation_enrollments ADD CONSTRAINT automation_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_enrollments_status_check' AND conrelid = 'public.automation_enrollments'::regclass) THEN ALTER TABLE public.automation_enrollments ADD CONSTRAINT automation_enrollments_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'cancelled'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_sequence_steps_sequence_id_position_key' AND conrelid = 'public.automation_sequence_steps'::regclass) THEN ALTER TABLE public.automation_sequence_steps ADD CONSTRAINT automation_sequence_steps_sequence_id_position_key UNIQUE (sequence_id, "position"); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_sequence_steps_pkey' AND conrelid = 'public.automation_sequence_steps'::regclass) THEN ALTER TABLE public.automation_sequence_steps ADD CONSTRAINT automation_sequence_steps_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_sequence_steps_sequence_id_fkey' AND conrelid = 'public.automation_sequence_steps'::regclass) THEN ALTER TABLE public.automation_sequence_steps ADD CONSTRAINT automation_sequence_steps_sequence_id_fkey FOREIGN KEY (sequence_id) REFERENCES automation_sequences(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_sequences_pkey' AND conrelid = 'public.automation_sequences'::regclass) THEN ALTER TABLE public.automation_sequences ADD CONSTRAINT automation_sequences_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_sequences_user_id_fkey' AND conrelid = 'public.automation_sequences'::regclass) THEN ALTER TABLE public.automation_sequences ADD CONSTRAINT automation_sequences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_steps_pkey' AND conrelid = 'public.automation_steps'::regclass) THEN ALTER TABLE public.automation_steps ADD CONSTRAINT automation_steps_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'automation_steps_automation_id_fkey' AND conrelid = 'public.automation_steps'::regclass) THEN ALTER TABLE public.automation_steps ADD CONSTRAINT automation_steps_automation_id_fkey FOREIGN KEY (automation_id) REFERENCES email_automations(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'calendar_settings_user_id_key' AND conrelid = 'public.calendar_settings'::regclass) THEN ALTER TABLE public.calendar_settings ADD CONSTRAINT calendar_settings_user_id_key UNIQUE (user_id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'calendar_settings_pkey' AND conrelid = 'public.calendar_settings'::regclass) THEN ALTER TABLE public.calendar_settings ADD CONSTRAINT calendar_settings_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'calendar_settings_user_id_fkey' AND conrelid = 'public.calendar_settings'::regclass) THEN ALTER TABLE public.calendar_settings ADD CONSTRAINT calendar_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chatbot_settings_user_id_key' AND conrelid = 'public.chatbot_settings'::regclass) THEN ALTER TABLE public.chatbot_settings ADD CONSTRAINT chatbot_settings_user_id_key UNIQUE (user_id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chatbot_settings_pkey' AND conrelid = 'public.chatbot_settings'::regclass) THEN ALTER TABLE public.chatbot_settings ADD CONSTRAINT chatbot_settings_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chatbot_settings_user_id_fkey' AND conrelid = 'public.chatbot_settings'::regclass) THEN ALTER TABLE public.chatbot_settings ADD CONSTRAINT chatbot_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_activities_pkey' AND conrelid = 'public.contact_activities'::regclass) THEN ALTER TABLE public.contact_activities ADD CONSTRAINT contact_activities_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_activities_contact_id_fkey' AND conrelid = 'public.contact_activities'::regclass) THEN ALTER TABLE public.contact_activities ADD CONSTRAINT contact_activities_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_documents_pkey' AND conrelid = 'public.contact_documents'::regclass) THEN ALTER TABLE public.contact_documents ADD CONSTRAINT contact_documents_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_documents_contact_id_fkey' AND conrelid = 'public.contact_documents'::regclass) THEN ALTER TABLE public.contact_documents ADD CONSTRAINT contact_documents_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_notes_pkey' AND conrelid = 'public.contact_notes'::regclass) THEN ALTER TABLE public.contact_notes ADD CONSTRAINT contact_notes_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_notes_contact_id_fkey' AND conrelid = 'public.contact_notes'::regclass) THEN ALTER TABLE public.contact_notes ADD CONSTRAINT contact_notes_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_submissions_pkey' AND conrelid = 'public.contact_submissions'::regclass) THEN ALTER TABLE public.contact_submissions ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contacts_pkey' AND conrelid = 'public.contacts'::regclass) THEN ALTER TABLE public.contacts ADD CONSTRAINT contacts_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contacts_user_id_fkey' AND conrelid = 'public.contacts'::regclass) THEN ALTER TABLE public.contacts ADD CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conversation_messages_pkey' AND conrelid = 'public.conversation_messages'::regclass) THEN ALTER TABLE public.conversation_messages ADD CONSTRAINT conversation_messages_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conversation_messages_lead_id_fkey' AND conrelid = 'public.conversation_messages'::regclass) THEN ALTER TABLE public.conversation_messages ADD CONSTRAINT conversation_messages_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conversation_messages_user_id_fkey' AND conrelid = 'public.conversation_messages'::regclass) THEN ALTER TABLE public.conversation_messages ADD CONSTRAINT conversation_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conversation_messages_author_check' AND conrelid = 'public.conversation_messages'::regclass) THEN ALTER TABLE public.conversation_messages ADD CONSTRAINT conversation_messages_author_check CHECK ((author = ANY (ARRAY['ai'::text, 'agent'::text, 'lead'::text, 'system'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conversation_messages_channel_check' AND conrelid = 'public.conversation_messages'::regclass) THEN ALTER TABLE public.conversation_messages ADD CONSTRAINT conversation_messages_channel_check CHECK ((channel = ANY (ARRAY['chat'::text, 'email'::text, 'sms'::text, 'call'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ddf_properties_mls_number_key' AND conrelid = 'public.ddf_properties'::regclass) THEN ALTER TABLE public.ddf_properties ADD CONSTRAINT ddf_properties_mls_number_key UNIQUE (mls_number); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ddf_properties_pkey' AND conrelid = 'public.ddf_properties'::regclass) THEN ALTER TABLE public.ddf_properties ADD CONSTRAINT ddf_properties_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ddf_sync_log_pkey' AND conrelid = 'public.ddf_sync_log'::regclass) THEN ALTER TABLE public.ddf_sync_log ADD CONSTRAINT ddf_sync_log_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ddf_sync_log_status_check' AND conrelid = 'public.ddf_sync_log'::regclass) THEN ALTER TABLE public.ddf_sync_log ADD CONSTRAINT ddf_sync_log_status_check CHECK ((status = ANY (ARRAY['running'::text, 'completed'::text, 'failed'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'deals_pkey' AND conrelid = 'public.deals'::regclass) THEN ALTER TABLE public.deals ADD CONSTRAINT deals_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'deals_contact_id_fkey' AND conrelid = 'public.deals'::regclass) THEN ALTER TABLE public.deals ADD CONSTRAINT deals_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'deals_user_id_fkey' AND conrelid = 'public.deals'::regclass) THEN ALTER TABLE public.deals ADD CONSTRAINT deals_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'demo_requests_pkey' AND conrelid = 'public.demo_requests'::regclass) THEN ALTER TABLE public.demo_requests ADD CONSTRAINT demo_requests_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_automations_pkey' AND conrelid = 'public.email_automations'::regclass) THEN ALTER TABLE public.email_automations ADD CONSTRAINT email_automations_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_automations_user_id_fkey' AND conrelid = 'public.email_automations'::regclass) THEN ALTER TABLE public.email_automations ADD CONSTRAINT email_automations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_captures_email_source_key' AND conrelid = 'public.email_captures'::regclass) THEN ALTER TABLE public.email_captures ADD CONSTRAINT email_captures_email_source_key UNIQUE (email, source); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_captures_pkey' AND conrelid = 'public.email_captures'::regclass) THEN ALTER TABLE public.email_captures ADD CONSTRAINT email_captures_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_events_pkey' AND conrelid = 'public.email_events'::regclass) THEN ALTER TABLE public.email_events ADD CONSTRAINT email_events_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_events_user_id_fkey' AND conrelid = 'public.email_events'::regclass) THEN ALTER TABLE public.email_events ADD CONSTRAINT email_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_log_pkey' AND conrelid = 'public.email_log'::regclass) THEN ALTER TABLE public.email_log ADD CONSTRAINT email_log_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_suppressions_pkey' AND conrelid = 'public.email_suppressions'::regclass) THEN ALTER TABLE public.email_suppressions ADD CONSTRAINT email_suppressions_pkey PRIMARY KEY (email); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_suppressions_contact_id_fkey' AND conrelid = 'public.email_suppressions'::regclass) THEN ALTER TABLE public.email_suppressions ADD CONSTRAINT email_suppressions_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_suppressions_user_id_fkey' AND conrelid = 'public.email_suppressions'::regclass) THEN ALTER TABLE public.email_suppressions ADD CONSTRAINT email_suppressions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'engagement_stats_contact_id_key' AND conrelid = 'public.engagement_stats'::regclass) THEN ALTER TABLE public.engagement_stats ADD CONSTRAINT engagement_stats_contact_id_key UNIQUE (contact_id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'engagement_stats_pkey' AND conrelid = 'public.engagement_stats'::regclass) THEN ALTER TABLE public.engagement_stats ADD CONSTRAINT engagement_stats_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'engagement_stats_contact_id_fkey' AND conrelid = 'public.engagement_stats'::regclass) THEN ALTER TABLE public.engagement_stats ADD CONSTRAINT engagement_stats_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'import_history_pkey' AND conrelid = 'public.import_history'::regclass) THEN ALTER TABLE public.import_history ADD CONSTRAINT import_history_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'import_history_user_id_fkey' AND conrelid = 'public.import_history'::regclass) THEN ALTER TABLE public.import_history ADD CONSTRAINT import_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_connections_pkey' AND conrelid = 'public.integration_connections'::regclass) THEN ALTER TABLE public.integration_connections ADD CONSTRAINT integration_connections_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_connections_user_id_fkey' AND conrelid = 'public.integration_connections'::regclass) THEN ALTER TABLE public.integration_connections ADD CONSTRAINT integration_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_connections_connection_method_check' AND conrelid = 'public.integration_connections'::regclass) THEN ALTER TABLE public.integration_connections ADD CONSTRAINT integration_connections_connection_method_check CHECK ((connection_method = ANY (ARRAY['oauth'::text, 'api_key'::text, 'webhook'::text, 'smtp'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_connections_last_sync_status_check' AND conrelid = 'public.integration_connections'::regclass) THEN ALTER TABLE public.integration_connections ADD CONSTRAINT integration_connections_last_sync_status_check CHECK ((last_sync_status = ANY (ARRAY['pending'::text, 'success'::text, 'error'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_connections_status_check' AND conrelid = 'public.integration_connections'::regclass) THEN ALTER TABLE public.integration_connections ADD CONSTRAINT integration_connections_status_check CHECK ((status = ANY (ARRAY['connected'::text, 'disconnected'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_connections_sync_direction_check' AND conrelid = 'public.integration_connections'::regclass) THEN ALTER TABLE public.integration_connections ADD CONSTRAINT integration_connections_sync_direction_check CHECK ((sync_direction = ANY (ARRAY['one_way_in'::text, 'one_way_out'::text, 'two_way'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_interest_user_id_tool_slug_key' AND conrelid = 'public.integration_interest'::regclass) THEN ALTER TABLE public.integration_interest ADD CONSTRAINT integration_interest_user_id_tool_slug_key UNIQUE (user_id, tool_slug); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_interest_pkey' AND conrelid = 'public.integration_interest'::regclass) THEN ALTER TABLE public.integration_interest ADD CONSTRAINT integration_interest_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_interest_user_id_fkey' AND conrelid = 'public.integration_interest'::regclass) THEN ALTER TABLE public.integration_interest ADD CONSTRAINT integration_interest_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_requests_pkey' AND conrelid = 'public.integration_requests'::regclass) THEN ALTER TABLE public.integration_requests ADD CONSTRAINT integration_requests_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_requests_user_id_fkey' AND conrelid = 'public.integration_requests'::regclass) THEN ALTER TABLE public.integration_requests ADD CONSTRAINT integration_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integrations_user_id_provider_provider_type_key' AND conrelid = 'public.integrations'::regclass) THEN ALTER TABLE public.integrations ADD CONSTRAINT integrations_user_id_provider_provider_type_key UNIQUE (user_id, provider, provider_type); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integrations_pkey' AND conrelid = 'public.integrations'::regclass) THEN ALTER TABLE public.integrations ADD CONSTRAINT integrations_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integrations_user_id_fkey' AND conrelid = 'public.integrations'::regclass) THEN ALTER TABLE public.integrations ADD CONSTRAINT integrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lead_magnet_requests_pkey' AND conrelid = 'public.lead_magnet_requests'::regclass) THEN ALTER TABLE public.lead_magnet_requests ADD CONSTRAINT lead_magnet_requests_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oauth_state_store_state_key' AND conrelid = 'public.oauth_state_store'::regclass) THEN ALTER TABLE public.oauth_state_store ADD CONSTRAINT oauth_state_store_state_key UNIQUE (state); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oauth_state_store_pkey' AND conrelid = 'public.oauth_state_store'::regclass) THEN ALTER TABLE public.oauth_state_store ADD CONSTRAINT oauth_state_store_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_pkey' AND conrelid = 'public.profiles'::regclass) THEN ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_fkey' AND conrelid = 'public.profiles'::regclass) THEN ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_preferred_language_check' AND conrelid = 'public.profiles'::regclass) THEN ALTER TABLE public.profiles ADD CONSTRAINT profiles_preferred_language_check CHECK ((preferred_language = ANY (ARRAY['en'::text, 'fr'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'property_interests_pkey' AND conrelid = 'public.property_interests'::regclass) THEN ALTER TABLE public.property_interests ADD CONSTRAINT property_interests_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'property_interests_contact_id_fkey' AND conrelid = 'public.property_interests'::regclass) THEN ALTER TABLE public.property_interests ADD CONSTRAINT property_interests_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'property_listings_pkey' AND conrelid = 'public.property_listings'::regclass) THEN ALTER TABLE public.property_listings ADD CONSTRAINT property_listings_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'property_listings_source_check' AND conrelid = 'public.property_listings'::regclass) THEN ALTER TABLE public.property_listings ADD CONSTRAINT property_listings_source_check CHECK ((source = ANY (ARRAY['manual'::text, 'crea_ddf'::text, 'url_scrape'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'scheduled_emails_pkey' AND conrelid = 'public.scheduled_emails'::regclass) THEN ALTER TABLE public.scheduled_emails ADD CONSTRAINT scheduled_emails_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sms_consent_contact_key' AND conrelid = 'public.sms_consent'::regclass) THEN ALTER TABLE public.sms_consent ADD CONSTRAINT sms_consent_contact_key UNIQUE (contact_id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sms_consent_pkey' AND conrelid = 'public.sms_consent'::regclass) THEN ALTER TABLE public.sms_consent ADD CONSTRAINT sms_consent_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sms_consent_contact_id_fkey' AND conrelid = 'public.sms_consent'::regclass) THEN ALTER TABLE public.sms_consent ADD CONSTRAINT sms_consent_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sms_consent_user_id_fkey' AND conrelid = 'public.sms_consent'::regclass) THEN ALTER TABLE public.sms_consent ADD CONSTRAINT sms_consent_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sms_consent_consent_type_check' AND conrelid = 'public.sms_consent'::regclass) THEN ALTER TABLE public.sms_consent ADD CONSTRAINT sms_consent_consent_type_check CHECK ((consent_type = ANY (ARRAY['express'::text, 'implied'::text]))); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_pkey' AND conrelid = 'public.tasks'::regclass) THEN ALTER TABLE public.tasks ADD CONSTRAINT tasks_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_contact_id_fkey' AND conrelid = 'public.tasks'::regclass) THEN ALTER TABLE public.tasks ADD CONSTRAINT tasks_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_deal_id_fkey' AND conrelid = 'public.tasks'::regclass) THEN ALTER TABLE public.tasks ADD CONSTRAINT tasks_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_user_id_fkey' AND conrelid = 'public.tasks'::regclass) THEN ALTER TABLE public.tasks ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_analytics_user_id_key' AND conrelid = 'public.user_analytics'::regclass) THEN ALTER TABLE public.user_analytics ADD CONSTRAINT user_analytics_user_id_key UNIQUE (user_id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_analytics_pkey' AND conrelid = 'public.user_analytics'::regclass) THEN ALTER TABLE public.user_analytics ADD CONSTRAINT user_analytics_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_analytics_user_id_fkey' AND conrelid = 'public.user_analytics'::regclass) THEN ALTER TABLE public.user_analytics ADD CONSTRAINT user_analytics_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_feedback_pkey' AND conrelid = 'public.user_feedback'::regclass) THEN ALTER TABLE public.user_feedback ADD CONSTRAINT user_feedback_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_feedback_user_id_fkey' AND conrelid = 'public.user_feedback'::regclass) THEN ALTER TABLE public.user_feedback ADD CONSTRAINT user_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_onboarding_pkey' AND conrelid = 'public.user_onboarding'::regclass) THEN ALTER TABLE public.user_onboarding ADD CONSTRAINT user_onboarding_pkey PRIMARY KEY (user_id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_onboarding_user_id_fkey' AND conrelid = 'public.user_onboarding'::regclass) THEN ALTER TABLE public.user_onboarding ADD CONSTRAINT user_onboarding_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key' AND conrelid = 'public.user_roles'::regclass) THEN ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_pkey' AND conrelid = 'public.user_roles'::regclass) THEN ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_fkey' AND conrelid = 'public.user_roles'::regclass) THEN ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'webhook_events_pkey' AND conrelid = 'public.webhook_events'::regclass) THEN ALTER TABLE public.webhook_events ADD CONSTRAINT webhook_events_pkey PRIMARY KEY (id); END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'webhook_events_connection_id_fkey' AND conrelid = 'public.webhook_events'::regclass) THEN ALTER TABLE public.webhook_events ADD CONSTRAINT webhook_events_connection_id_fkey FOREIGN KEY (connection_id) REFERENCES integration_connections(id) ON DELETE CASCADE; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'webhook_events_contact_id_fkey' AND conrelid = 'public.webhook_events'::regclass) THEN ALTER TABLE public.webhook_events ADD CONSTRAINT webhook_events_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL; END IF; END $c$;
DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'webhook_events_processing_status_check' AND conrelid = 'public.webhook_events'::regclass) THEN ALTER TABLE public.webhook_events ADD CONSTRAINT webhook_events_processing_status_check CHECK ((processing_status = ANY (ARRAY['received'::text, 'contact_created'::text, 'contact_updated'::text, 'ignored'::text, 'failed'::text]))); END IF; END $c$;

-- ── Indexes ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS apify_usage_user_date_idx ON public.apify_usage USING btree (user_id, request_date DESC);
CREATE INDEX IF NOT EXISTS automation_enrollments_seq_idx ON public.automation_enrollments USING btree (user_id, sequence_id, status);
CREATE INDEX IF NOT EXISTS automation_sequences_user_idx ON public.automation_sequences USING btree (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS contacts_user_created_idx ON public.contacts USING btree (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS conversation_messages_recent_idx ON public.conversation_messages USING btree (user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS conversation_messages_thread_idx ON public.conversation_messages USING btree (user_id, lead_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_adoption_events_created_at ON public.adoption_events USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_adoption_events_event_type ON public.adoption_events USING btree (event_type);
CREATE INDEX IF NOT EXISTS idx_adoption_events_user_id ON public.adoption_events USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_automation_steps_automation ON public.automation_steps USING btree (automation_id);
CREATE INDEX IF NOT EXISTS idx_contact_activities_activity_date ON public.contact_activities USING btree (activity_date);
CREATE INDEX IF NOT EXISTS idx_contact_activities_contact_id ON public.contact_activities USING btree (contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_activities_user_id ON public.contact_activities USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_next_followup ON public.contacts USING btree (next_followup_date);
CREATE INDEX IF NOT EXISTS idx_contacts_stage ON public.contacts USING btree (stage);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_ddf_properties_city ON public.ddf_properties USING btree (city);
CREATE INDEX IF NOT EXISTS idx_ddf_properties_mls ON public.ddf_properties USING btree (mls_number);
CREATE INDEX IF NOT EXISTS idx_ddf_properties_price ON public.ddf_properties USING btree (price);
CREATE INDEX IF NOT EXISTS idx_ddf_properties_province ON public.ddf_properties USING btree (province);
CREATE INDEX IF NOT EXISTS idx_ddf_properties_status ON public.ddf_properties USING btree (status);
CREATE INDEX IF NOT EXISTS idx_ddf_properties_synced_at ON public.ddf_properties USING btree (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_ddf_properties_type ON public.ddf_properties USING btree (property_type);
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON public.deals USING btree (contact_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON public.deals USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_email_automations_user ON public.email_automations USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_email_events_user_event ON public.email_events USING btree (user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_email_suppressions_contact ON public.email_suppressions USING btree (contact_id);
CREATE INDEX IF NOT EXISTS idx_email_suppressions_user ON public.email_suppressions USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_import_history_user ON public.import_history USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_integration_connections_tool ON public.integration_connections USING btree (tool_slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_integration_connections_unique ON public.integration_connections USING btree (user_id, tool_slug) WHERE (status = 'connected'::text);
CREATE INDEX IF NOT EXISTS idx_integration_connections_user ON public.integration_connections USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_integration_connections_webhook ON public.integration_connections USING btree (user_id, tool_slug, webhook_token) WHERE (webhook_token IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_lead_magnet_requests_email_created ON public.lead_magnet_requests USING btree (email, created_at);
CREATE INDEX IF NOT EXISTS idx_oauth_state_expires ON public.oauth_state_store USING btree (expires_at);
CREATE INDEX IF NOT EXISTS idx_property_listings_mls_number ON public.property_listings USING btree (mls_number);
CREATE INDEX IF NOT EXISTS idx_property_listings_source_listing_id ON public.property_listings USING btree (source_listing_id);
CREATE INDEX IF NOT EXISTS idx_property_listings_user_id ON public.property_listings USING btree (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_listings_user_source_unique ON public.property_listings USING btree (user_id, source, source_listing_id) WHERE (source_listing_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_sms_consent_user ON public.sms_consent USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_contact_id ON public.tasks USING btree (contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks USING btree (deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON public.user_feedback USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON public.user_feedback USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user ON public.user_onboarding USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_received ON public.webhook_events USING btree (received_at);
CREATE INDEX IF NOT EXISTS webhook_events_user_received_idx ON public.webhook_events USING btree (user_id, received_at DESC);

-- ── Functions ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_apify_rate_limit(checking_user_id uuid, max_daily_imports integer DEFAULT 10)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COUNT(*) < max_daily_imports
  FROM public.import_history
  WHERE user_id = checking_user_id
    AND created_at >= date_trunc('day', now());
$function$
;

CREATE OR REPLACE FUNCTION public.check_concurrent_import(checking_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.import_history
    WHERE user_id = checking_user_id
      AND status IN ('pending', 'running')
      -- Stale guard: a crashed import must not lock the user out forever.
      AND created_at > now() - interval '1 hour'
  );
$function$
;

CREATE OR REPLACE FUNCTION public.guard_profile_privileged_columns()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF coalesce(auth.role(), '') <> 'service_role' THEN
    NEW.is_demo             := OLD.is_demo;
    NEW.subscription_status := OLD.subscription_status;
    NEW.subscription_tier   := OLD.subscription_tier;
    NEW.trial_ends_at       := OLD.trial_ends_at;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, company_name, subscription_tier)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'subscription_tier')::public.subscription_tier, 'agent')
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT public.has_role(auth.uid(), 'admin')
$function$
;

-- ── Row Level Security ─────────────────────────────────────────────────
ALTER TABLE public.adoption_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apify_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ddf_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ddf_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnet_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_state_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- ── Policies ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can insert their own adoption events" ON public.adoption_events;
CREATE POLICY "Users can insert their own adoption events" ON public.adoption_events AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can read their own adoption events" ON public.adoption_events;
CREATE POLICY "Users can read their own adoption events" ON public.adoption_events AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_insert ON public.ai_lead_scores;
CREATE POLICY owner_insert ON public.ai_lead_scores AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM contacts c
  WHERE ((c.id = ai_lead_scores.contact_id) AND (c.user_id = auth.uid())))));
DROP POLICY IF EXISTS owner_select ON public.ai_lead_scores;
CREATE POLICY owner_select ON public.ai_lead_scores AS PERMISSIVE FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM contacts c
  WHERE ((c.id = ai_lead_scores.contact_id) AND (c.user_id = auth.uid())))));
DROP POLICY IF EXISTS owner_update ON public.ai_lead_scores;
CREATE POLICY owner_update ON public.ai_lead_scores AS PERMISSIVE FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM contacts c
  WHERE ((c.id = ai_lead_scores.contact_id) AND (c.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM contacts c
  WHERE ((c.id = ai_lead_scores.contact_id) AND (c.user_id = auth.uid())))));
DROP POLICY IF EXISTS apify_usage_insert_own ON public.apify_usage;
CREATE POLICY apify_usage_insert_own ON public.apify_usage AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS apify_usage_select_own ON public.apify_usage;
CREATE POLICY apify_usage_select_own ON public.apify_usage AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS ae_all_own ON public.automation_enrollments;
CREATE POLICY ae_all_own ON public.automation_enrollments AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS ass_all_own ON public.automation_sequence_steps;
CREATE POLICY ass_all_own ON public.automation_sequence_steps AS PERMISSIVE FOR ALL TO authenticated USING ((EXISTS ( SELECT 1
   FROM automation_sequences s
  WHERE ((s.id = automation_sequence_steps.sequence_id) AND (s.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM automation_sequences s
  WHERE ((s.id = automation_sequence_steps.sequence_id) AND (s.user_id = auth.uid())))));
DROP POLICY IF EXISTS as_all_own ON public.automation_sequences;
CREATE POLICY as_all_own ON public.automation_sequences AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_all_via_parent ON public.automation_steps;
CREATE POLICY owner_all_via_parent ON public.automation_steps AS PERMISSIVE FOR ALL TO authenticated USING ((EXISTS ( SELECT 1
   FROM email_automations a
  WHERE ((a.id = automation_steps.automation_id) AND (a.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM email_automations a
  WHERE ((a.id = automation_steps.automation_id) AND (a.user_id = auth.uid())))));
DROP POLICY IF EXISTS "Users can manage their own calendar settings" ON public.calendar_settings;
CREATE POLICY "Users can manage their own calendar settings" ON public.calendar_settings AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can create own chatbot settings" ON public.chatbot_settings;
CREATE POLICY "Users can create own chatbot settings" ON public.chatbot_settings AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can delete own chatbot settings" ON public.chatbot_settings;
CREATE POLICY "Users can delete own chatbot settings" ON public.chatbot_settings AS PERMISSIVE FOR DELETE TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can update own chatbot settings" ON public.chatbot_settings;
CREATE POLICY "Users can update own chatbot settings" ON public.chatbot_settings AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can view own chatbot settings" ON public.chatbot_settings;
CREATE POLICY "Users can view own chatbot settings" ON public.chatbot_settings AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can delete their own contact activities" ON public.contact_activities;
CREATE POLICY "Users can delete their own contact activities" ON public.contact_activities AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert their own contact activities" ON public.contact_activities;
CREATE POLICY "Users can insert their own contact activities" ON public.contact_activities AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can read their own contact activities" ON public.contact_activities;
CREATE POLICY "Users can read their own contact activities" ON public.contact_activities AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can update their own contact activities" ON public.contact_activities;
CREATE POLICY "Users can update their own contact activities" ON public.contact_activities AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_delete ON public.contact_documents;
CREATE POLICY owner_delete ON public.contact_documents AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_insert ON public.contact_documents;
CREATE POLICY owner_insert ON public.contact_documents AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_select ON public.contact_documents;
CREATE POLICY owner_select ON public.contact_documents AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_update ON public.contact_documents;
CREATE POLICY owner_update ON public.contact_documents AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_delete ON public.contact_notes;
CREATE POLICY owner_delete ON public.contact_notes AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_insert ON public.contact_notes;
CREATE POLICY owner_insert ON public.contact_notes AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_select ON public.contact_notes;
CREATE POLICY owner_select ON public.contact_notes AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_update ON public.contact_notes;
CREATE POLICY owner_update ON public.contact_notes AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS anon_can_submit ON public.contact_submissions;
CREATE POLICY anon_can_submit ON public.contact_submissions AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Users can delete own contacts" ON public.contacts;
CREATE POLICY "Users can delete own contacts" ON public.contacts AS PERMISSIVE FOR DELETE TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert own contacts" ON public.contacts;
CREATE POLICY "Users can insert own contacts" ON public.contacts AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can update own contacts" ON public.contacts;
CREATE POLICY "Users can update own contacts" ON public.contacts AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can view own contacts" ON public.contacts;
CREATE POLICY "Users can view own contacts" ON public.contacts AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS cm_delete_own ON public.conversation_messages;
CREATE POLICY cm_delete_own ON public.conversation_messages AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS cm_insert_own ON public.conversation_messages;
CREATE POLICY cm_insert_own ON public.conversation_messages AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS cm_select_own ON public.conversation_messages;
CREATE POLICY cm_select_own ON public.conversation_messages AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS cm_update_own ON public.conversation_messages;
CREATE POLICY cm_update_own ON public.conversation_messages AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Authenticated users can read DDF properties" ON public.ddf_properties;
CREATE POLICY "Authenticated users can read DDF properties" ON public.ddf_properties AS PERMISSIVE FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users can delete own deals" ON public.deals;
CREATE POLICY "Users can delete own deals" ON public.deals AS PERMISSIVE FOR DELETE TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert own deals" ON public.deals;
CREATE POLICY "Users can insert own deals" ON public.deals AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can update own deals" ON public.deals;
CREATE POLICY "Users can update own deals" ON public.deals AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can view own deals" ON public.deals;
CREATE POLICY "Users can view own deals" ON public.deals AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS anon_can_request_demo ON public.demo_requests;
CREATE POLICY anon_can_request_demo ON public.demo_requests AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS owner_all ON public.email_automations;
CREATE POLICY owner_all ON public.email_automations AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS anon_can_capture ON public.email_captures;
CREATE POLICY anon_can_capture ON public.email_captures AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Service role only" ON public.email_events;
CREATE POLICY "Service role only" ON public.email_events AS PERMISSIVE FOR ALL TO public USING (false);
DROP POLICY IF EXISTS "Service role only" ON public.email_log;
CREATE POLICY "Service role only" ON public.email_log AS PERMISSIVE FOR ALL TO public USING (false);
DROP POLICY IF EXISTS owner_reads_own_suppressions ON public.email_suppressions;
CREATE POLICY owner_reads_own_suppressions ON public.email_suppressions AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_insert ON public.engagement_stats;
CREATE POLICY owner_insert ON public.engagement_stats AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM contacts c
  WHERE ((c.id = engagement_stats.contact_id) AND (c.user_id = auth.uid())))));
DROP POLICY IF EXISTS owner_select ON public.engagement_stats;
CREATE POLICY owner_select ON public.engagement_stats AS PERMISSIVE FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM contacts c
  WHERE ((c.id = engagement_stats.contact_id) AND (c.user_id = auth.uid())))));
DROP POLICY IF EXISTS owner_update ON public.engagement_stats;
CREATE POLICY owner_update ON public.engagement_stats AS PERMISSIVE FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM contacts c
  WHERE ((c.id = engagement_stats.contact_id) AND (c.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM contacts c
  WHERE ((c.id = engagement_stats.contact_id) AND (c.user_id = auth.uid())))));
DROP POLICY IF EXISTS owner_all ON public.import_history;
CREATE POLICY owner_all ON public.import_history AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can delete own connections" ON public.integration_connections;
CREATE POLICY "Users can delete own connections" ON public.integration_connections AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert own connections" ON public.integration_connections;
CREATE POLICY "Users can insert own connections" ON public.integration_connections AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can update own connections" ON public.integration_connections;
CREATE POLICY "Users can update own connections" ON public.integration_connections AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can view own connections" ON public.integration_connections;
CREATE POLICY "Users can view own connections" ON public.integration_connections AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert own interests" ON public.integration_interest;
CREATE POLICY "Users can insert own interests" ON public.integration_interest AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can view own interests" ON public.integration_interest;
CREATE POLICY "Users can view own interests" ON public.integration_interest AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert own requests" ON public.integration_requests;
CREATE POLICY "Users can insert own requests" ON public.integration_requests AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can view own requests" ON public.integration_requests;
CREATE POLICY "Users can view own requests" ON public.integration_requests AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_delete ON public.integrations;
CREATE POLICY owner_delete ON public.integrations AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_insert ON public.integrations;
CREATE POLICY owner_insert ON public.integrations AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_select ON public.integrations;
CREATE POLICY owner_select ON public.integrations AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_update ON public.integrations;
CREATE POLICY owner_update ON public.integrations AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Service role only" ON public.lead_magnet_requests;
CREATE POLICY "Service role only" ON public.lead_magnet_requests AS PERMISSIVE FOR ALL TO public USING (false);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = id));
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = id));
DROP POLICY IF EXISTS owner_delete ON public.property_interests;
CREATE POLICY owner_delete ON public.property_interests AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_insert ON public.property_interests;
CREATE POLICY owner_insert ON public.property_interests AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_select ON public.property_interests;
CREATE POLICY owner_select ON public.property_interests AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_update ON public.property_interests;
CREATE POLICY owner_update ON public.property_interests AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can delete their own property listings" ON public.property_listings;
CREATE POLICY "Users can delete their own property listings" ON public.property_listings AS PERMISSIVE FOR DELETE TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert their own property listings" ON public.property_listings;
CREATE POLICY "Users can insert their own property listings" ON public.property_listings AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can update their own property listings" ON public.property_listings;
CREATE POLICY "Users can update their own property listings" ON public.property_listings AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can view their own property listings" ON public.property_listings;
CREATE POLICY "Users can view their own property listings" ON public.property_listings AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Service role can manage scheduled emails" ON public.scheduled_emails;
CREATE POLICY "Service role can manage scheduled emails" ON public.scheduled_emails AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role only" ON public.scheduled_emails;
CREATE POLICY "Service role only" ON public.scheduled_emails AS PERMISSIVE FOR ALL TO public USING (false);
DROP POLICY IF EXISTS owner_all ON public.sms_consent;
CREATE POLICY owner_all ON public.sms_consent AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_delete ON public.tasks;
CREATE POLICY owner_delete ON public.tasks AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_insert ON public.tasks;
CREATE POLICY owner_insert ON public.tasks AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_select ON public.tasks;
CREATE POLICY owner_select ON public.tasks AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_update ON public.tasks;
CREATE POLICY owner_update ON public.tasks AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_delete ON public.user_analytics;
CREATE POLICY owner_delete ON public.user_analytics AS PERMISSIVE FOR DELETE TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_insert ON public.user_analytics;
CREATE POLICY owner_insert ON public.user_analytics AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_select ON public.user_analytics;
CREATE POLICY owner_select ON public.user_analytics AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS owner_update ON public.user_analytics;
CREATE POLICY owner_update ON public.user_analytics AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.user_feedback;
CREATE POLICY "Users can insert their own feedback" ON public.user_feedback AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can read their own feedback" ON public.user_feedback;
CREATE POLICY "Users can read their own feedback" ON public.user_feedback AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "users read own onboarding row" ON public.user_onboarding;
CREATE POLICY "users read own onboarding row" ON public.user_onboarding AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "users update own onboarding row" ON public.user_onboarding;
CREATE POLICY "users update own onboarding row" ON public.user_onboarding AS PERMISSIVE FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "users upsert own onboarding row" ON public.user_onboarding;
CREATE POLICY "users upsert own onboarding row" ON public.user_onboarding AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles" ON public.user_roles AS PERMISSIVE FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles" ON public.user_roles AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles AS PERMISSIVE FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can view own webhook events" ON public.webhook_events;
CREATE POLICY "Users can view own webhook events" ON public.webhook_events AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS we_select_own ON public.webhook_events;
CREATE POLICY we_select_own ON public.webhook_events AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));

-- ── Triggers ───────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
DROP TRIGGER IF EXISTS set_ddf_properties_updated_at ON public.ddf_properties;
CREATE TRIGGER set_ddf_properties_updated_at BEFORE UPDATE ON public.ddf_properties FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
DROP TRIGGER IF EXISTS set_integration_connections_updated_at ON public.integration_connections;
CREATE TRIGGER set_integration_connections_updated_at BEFORE UPDATE ON public.integration_connections FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
DROP TRIGGER IF EXISTS trg_guard_profile_privileged_columns ON public.profiles;
CREATE TRIGGER trg_guard_profile_privileged_columns BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION guard_profile_privileged_columns();
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
DROP TRIGGER IF EXISTS update_property_listings_updated_at ON public.property_listings;
CREATE TRIGGER update_property_listings_updated_at BEFORE UPDATE ON public.property_listings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
