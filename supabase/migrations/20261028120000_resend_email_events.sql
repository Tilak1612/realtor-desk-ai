-- Resend delivery events (bounces, complaints, delays, suppressions) received
-- by the resend-webhook edge function. Written only with the service role;
-- RLS is on with no policies, so the browser can neither read nor write it.
-- Additive and idempotent. email_suppressions already exists (baseline).

create table if not exists public.resend_email_events (
  svix_id text primary key,
  event_type text not null,
  resend_email_id text,
  recipient text,
  from_address text,
  subject text,
  bounce_type text,
  bounce_subtype text,
  payload jsonb not null,
  occurred_at timestamptz,
  received_at timestamptz not null default now()
);

create index if not exists resend_email_events_recipient_idx
  on public.resend_email_events (recipient, received_at desc);
create index if not exists resend_email_events_type_idx
  on public.resend_email_events (event_type, received_at desc);

alter table public.resend_email_events enable row level security;
revoke all on public.resend_email_events from anon, authenticated;
