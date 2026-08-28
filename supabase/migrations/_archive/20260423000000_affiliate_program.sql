-- ============================================================================
-- Affiliate Program v1 — RealtorDesk.ai (portable to all Brainfy products)
-- ============================================================================
-- Design rationale on the three tricky bits:
--
-- 1. RATE FREEZING AT INVOICE TIME
--    commission_rate_bps lives on affiliate_commissions, NOT on affiliate_referrals.
--    When invoice.paid fires, we read the affiliate's CURRENT tier, snapshot the
--    rate onto the commission row, and never touch it again. Month 6 promotion
--    to Growth doesn't re-rate month 1-5 commissions. A single SQL read
--    (`SELECT commission_rate_bps FROM affiliate_commissions WHERE ...`) always
--    tells you exactly what was earned, no joins to tier history required.
--
-- 2. CLAWBACK STATE MACHINE
--    status lifecycle: pending → approved → paid
--                           ↘  clawed_back (if refund within 60d AND not yet paid)
--    If refund happens AFTER status=paid, we do NOT flip the row. Instead we
--    insert a NEGATIVE commission row with clawback_of_commission_id FK.
--    This preserves payout audit trail (the affiliate was actually paid; we
--    just deduct from their next balance). Accountants thank us.
--
-- 3. IDEMPOTENCY
--    UNIQUE(stripe_invoice_id, commission_type) on affiliate_commissions.
--    Stripe retries webhooks aggressively (especially invoice.paid during
--    network blips). The unique constraint means ON CONFLICT DO NOTHING
--    makes our handler idempotent by default. commission_type enum lets us
--    distinguish 'earned' from 'clawback' on the same invoice.
--
-- Also: product_id is a first-class FK on every table so porting to CovioIQ,
-- AgriIntel, PetVitale, etc. is zero-schema-migration — just insert a new
-- row in products and point your deployment at its UUID.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Products table (multi-product portability)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,                 -- 'realtordesk', 'covioiq', etc.
  name            text not null,                         -- 'RealtorDesk AI'
  domain          text not null,                         -- 'www.realtordesk.ai'
  default_currency text not null default 'USD' check (default_currency in ('USD','CAD')),
  created_at      timestamptz not null default now()
);

insert into public.products (slug, name, domain, default_currency)
values ('realtordesk', 'RealtorDesk AI', 'www.realtordesk.ai', 'USD')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type affiliate_status as enum ('pending','active','suspended','banned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type affiliate_tier as enum ('starter','growth','elite','ambassador');
exception when duplicate_object then null; end $$;

do $$ begin
  create type affiliate_track as enum ('standard','ambassador');
exception when duplicate_object then null; end $$;

do $$ begin
  create type referral_status as enum ('trialing','active','canceled','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type commission_status as enum ('pending','approved','paid','clawed_back','voided');
exception when duplicate_object then null; end $$;

do $$ begin
  create type commission_type as enum ('earned','clawback');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payout_status as enum ('draft','processing','paid','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payout_method as enum ('interac','wise','paypal','stripe_connect','manual');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Affiliates
-- ---------------------------------------------------------------------------
create table public.affiliates (
  id                  uuid primary key default uuid_generate_v4(),
  product_id          uuid not null references public.products(id) on delete restrict,
  user_id             uuid references auth.users(id) on delete set null,

  -- Public identity
  slug                text not null,                                    -- used in ?ref=<slug>
  display_name        text not null,
  email               text not null,
  country             text not null,                                    -- ISO-2: 'CA', 'US', etc.

  -- Program state
  track               affiliate_track not null default 'standard',      -- standard | ambassador
  tier                affiliate_tier not null default 'starter',        -- auto-computed for standard; 'ambassador' for ambassador track
  status              affiliate_status not null default 'pending',      -- pending until email verified / first click
  manual_rate_override_bps int check (manual_rate_override_bps is null or (manual_rate_override_bps between 0 and 10000)),

  -- Payout config
  payout_method       payout_method not null default 'manual',
  payout_currency     text not null default 'CAD' check (payout_currency in ('USD','CAD')),
  payout_details      jsonb not null default '{}'::jsonb,               -- { "interac_email": "...", "wise_id": "...", etc. }

  -- Tax
  tax_id              text,                                              -- SIN (CA) / SSN/EIN (US), encrypted at rest via pgcrypto in prod
  tax_form_type       text,                                              -- 'T4A', '1099-NEC', null
  tos_accepted_at     timestamptz,
  tos_version         text,

  -- Bookkeeping
  notes               text,                                              -- admin notes
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  unique (product_id, slug),
  unique (product_id, email)
);

create index affiliates_product_status_idx on public.affiliates (product_id, status);
create index affiliates_user_idx            on public.affiliates (user_id) where user_id is not null;

-- ---------------------------------------------------------------------------
-- Affiliate Links (named campaigns; every affiliate gets one default link)
-- ---------------------------------------------------------------------------
create table public.affiliate_links (
  id            uuid primary key default uuid_generate_v4(),
  affiliate_id  uuid not null references public.affiliates(id) on delete cascade,
  product_id    uuid not null references public.products(id)   on delete restrict,
  label         text not null default 'default',                -- 'youtube-channel', 'email-footer', etc.
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  landing_path  text not null default '/',                      -- where the link lands on the product site
  click_count   bigint not null default 0,
  created_at    timestamptz not null default now(),
  unique (affiliate_id, label)
);

create index affiliate_links_affiliate_idx on public.affiliate_links (affiliate_id);

-- ---------------------------------------------------------------------------
-- Affiliate Clicks (hashed IP only — PIPEDA/GDPR)
-- ---------------------------------------------------------------------------
create table public.affiliate_clicks (
  id                   uuid primary key default uuid_generate_v4(),
  link_id              uuid not null references public.affiliate_links(id) on delete cascade,
  affiliate_id         uuid not null references public.affiliates(id)      on delete cascade,
  product_id           uuid not null references public.products(id)        on delete restrict,
  visitor_fingerprint  text,                                                -- client-gen'd, coarse
  ip_hash              text not null,                                       -- sha256(ip + salt)
  user_agent           text,
  landing_page         text,
  referer              text,
  country              text,                                                -- optional: geoip lookup
  created_at           timestamptz not null default now()
);

create index affiliate_clicks_affiliate_idx on public.affiliate_clicks (affiliate_id, created_at desc);
create index affiliate_clicks_fingerprint_idx on public.affiliate_clicks (visitor_fingerprint) where visitor_fingerprint is not null;

-- ---------------------------------------------------------------------------
-- Affiliate Referrals (one row per Stripe customer)
-- ---------------------------------------------------------------------------
create table public.affiliate_referrals (
  id                         uuid primary key default uuid_generate_v4(),
  affiliate_id               uuid not null references public.affiliates(id) on delete restrict,
  product_id                 uuid not null references public.products(id)   on delete restrict,
  link_id                    uuid references public.affiliate_links(id)     on delete set null,

  stripe_customer_id         text not null,
  stripe_subscription_id     text,
  customer_email             text,

  status                     referral_status not null default 'trialing',
  first_paid_at              timestamptz,                          -- set on first invoice.paid
  canceled_at                timestamptz,
  mrr_cents                  integer not null default 0,           -- latest known MRR in currency below
  currency                   text not null default 'USD' check (currency in ('USD','CAD')),

  -- Attribution provenance (debug & fraud forensics)
  attribution_cookie_hash    text,                                  -- optional sha256(cookie value at checkout)
  attribution_ip_hash        text,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now(),

  unique (product_id, stripe_customer_id)                           -- one affiliate per customer per product
);

create index affiliate_referrals_affiliate_idx on public.affiliate_referrals (affiliate_id, status);
create index affiliate_referrals_first_paid_idx on public.affiliate_referrals (affiliate_id, first_paid_at desc);

-- ---------------------------------------------------------------------------
-- Affiliate Commissions (one row per Stripe invoice × commission_type)
-- ---------------------------------------------------------------------------
create table public.affiliate_commissions (
  id                          uuid primary key default uuid_generate_v4(),
  referral_id                 uuid not null references public.affiliate_referrals(id) on delete restrict,
  affiliate_id                uuid not null references public.affiliates(id)          on delete restrict,
  product_id                  uuid not null references public.products(id)            on delete restrict,

  stripe_invoice_id           text not null,
  stripe_charge_id            text,
  stripe_subscription_id      text,

  commission_type             commission_type not null default 'earned',  -- 'earned' | 'clawback'
  clawback_of_commission_id   uuid references public.affiliate_commissions(id) on delete set null,

  -- Money (stored as integer cents in invoice's currency)
  invoice_amount_cents        integer not null,                  -- what the customer paid
  commission_rate_bps         integer not null check (commission_rate_bps between 0 and 10000),
  amount_cents                integer not null,                  -- CAN be negative (clawback)
  currency                    text not null check (currency in ('USD','CAD')),

  -- CAD-equivalent snapshot for unified dashboard totals
  fx_rate_to_cad              numeric(12,6) not null default 1.0, -- e.g. 1.369000 if invoice was USD
  amount_cad_cents            integer not null,                   -- amount_cents * fx_rate_to_cad, rounded

  status                      commission_status not null default 'pending',
  period_start                timestamptz not null,
  period_end                  timestamptz not null,

  -- Lifecycle timestamps
  approved_at                 timestamptz,                         -- set when 60d clawback window closes
  paid_at                     timestamptz,                         -- set when included in a paid payout
  clawed_back_at              timestamptz,

  payout_id                   uuid,   -- FK added via ALTER TABLE below (forward ref)

  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),

  -- Idempotency: Stripe retries invoice.paid; we never double-count.
  unique (stripe_invoice_id, commission_type)
);

create index affiliate_commissions_affiliate_status_idx on public.affiliate_commissions (affiliate_id, status);
create index affiliate_commissions_approval_due_idx on public.affiliate_commissions (period_end) where status = 'pending';
create index affiliate_commissions_payout_idx on public.affiliate_commissions (payout_id) where payout_id is not null;

-- ---------------------------------------------------------------------------
-- Affiliate Payouts (batch of commissions paid out together)
-- ---------------------------------------------------------------------------
create table public.affiliate_payouts (
  id                    uuid primary key default uuid_generate_v4(),
  affiliate_id          uuid not null references public.affiliates(id) on delete restrict,
  product_id            uuid not null references public.products(id)   on delete restrict,

  period_start          date not null,
  period_end            date not null,

  -- Totals in affiliate's payout_currency (after FX conversion if needed)
  gross_cents           integer not null,                   -- sum of approved commissions
  clawback_cents        integer not null default 0,         -- sum of clawbacks against previously paid periods
  net_cents             integer not null,                   -- gross - clawback (can be 0 if held back)
  currency              text not null check (currency in ('USD','CAD')),

  method                payout_method not null,
  external_ref          text,                                -- Interac confirmation #, Wise transfer ID, etc.
  stripe_transfer_id    text,                                -- reserved for v2 Stripe Connect

  status                payout_status not null default 'draft',
  paid_at               timestamptz,
  notes                 text,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index affiliate_payouts_affiliate_idx on public.affiliate_payouts (affiliate_id, period_end desc);

-- Back-reference: now that affiliate_payouts exists, wire up the FK.
alter table public.affiliate_commissions
  add constraint affiliate_commissions_payout_id_fkey
  foreign key (payout_id) references public.affiliate_payouts(id) on delete set null;

-- Click counter RPC (race-safe increment).
create or replace function public.increment_click_count(p_link_id uuid)
returns void language sql as $$
  update public.affiliate_links
     set click_count = click_count + 1
   where id = p_link_id;
$$;

-- ---------------------------------------------------------------------------
-- Affiliate Assets (v1: seed rows only, no CMS)
-- ---------------------------------------------------------------------------
create table public.affiliate_assets (
  id             uuid primary key default uuid_generate_v4(),
  product_id     uuid not null references public.products(id) on delete cascade,
  type           text not null,                             -- 'banner' | 'email_swipe' | 'video' | 'logo'
  title          text not null,
  description    text,
  url            text not null,
  thumbnail_url  text,
  dimensions     text,                                      -- '300x250', '728x90', etc.
  sort_order     int not null default 0,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Triggers: updated_at
-- ---------------------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger affiliates_set_updated_at before update on public.affiliates
  for each row execute function public.tg_set_updated_at();
create trigger affiliate_referrals_set_updated_at before update on public.affiliate_referrals
  for each row execute function public.tg_set_updated_at();
create trigger affiliate_commissions_set_updated_at before update on public.affiliate_commissions
  for each row execute function public.tg_set_updated_at();
create trigger affiliate_payouts_set_updated_at before update on public.affiliate_payouts
  for each row execute function public.tg_set_updated_at();

-- ---------------------------------------------------------------------------
-- Tier computation helper (90-day rolling active referrals)
-- Call from a nightly cron OR from a webhook handler after each referral event.
-- Ambassador track is excluded (track is locked at signup per product decision).
-- ---------------------------------------------------------------------------
create or replace function public.fn_recompute_affiliate_tier(p_affiliate_id uuid)
returns affiliate_tier
language plpgsql
as $$
declare
  v_track       affiliate_track;
  v_active      int;
  v_new_tier    affiliate_tier;
begin
  select track into v_track from public.affiliates where id = p_affiliate_id;
  if v_track = 'ambassador' then
    update public.affiliates set tier = 'ambassador' where id = p_affiliate_id;
    return 'ambassador';
  end if;

  select count(*) into v_active
    from public.affiliate_referrals
   where affiliate_id = p_affiliate_id
     and status = 'active'
     and first_paid_at is not null
     and first_paid_at >= (now() - interval '90 days');

  v_new_tier := case
    when v_active >= 26 then 'elite'::affiliate_tier
    when v_active >= 11 then 'growth'::affiliate_tier
    else 'starter'::affiliate_tier
  end;

  update public.affiliates set tier = v_new_tier where id = p_affiliate_id;
  return v_new_tier;
end $$;

-- ---------------------------------------------------------------------------
-- Commission rate resolver: called from webhook when creating commission row.
-- Honors manual_rate_override_bps if set.
-- ---------------------------------------------------------------------------
create or replace function public.fn_current_commission_rate_bps(p_affiliate_id uuid)
returns int
language sql stable as $$
  select coalesce(
    a.manual_rate_override_bps,
    case a.tier
      when 'elite'      then 4000  -- 40%
      when 'growth'     then 3000  -- 30%
      when 'ambassador' then 2000  -- 20%
      else                   2500  -- 25% starter
    end
  )
  from public.affiliates a
  where a.id = p_affiliate_id;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- Rule: affiliates see ONLY their own rows. service_role bypasses everything.
-- Admin access is via service_role in server-side admin routes, not RLS.
-- ============================================================================

alter table public.affiliates            enable row level security;
alter table public.affiliate_links       enable row level security;
alter table public.affiliate_clicks      enable row level security;
alter table public.affiliate_referrals   enable row level security;
alter table public.affiliate_commissions enable row level security;
alter table public.affiliate_payouts     enable row level security;
alter table public.affiliate_assets      enable row level security;
alter table public.products              enable row level security;

-- Products: read-only for authenticated
create policy products_read_all on public.products
  for select using (true);

-- Affiliates: self-read, self-update-limited
create policy affiliates_self_read on public.affiliates
  for select using (auth.uid() = user_id);

create policy affiliates_self_update on public.affiliates
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Links: own only
create policy affiliate_links_self on public.affiliate_links
  for all using (
    exists (select 1 from public.affiliates a where a.id = affiliate_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.affiliates a where a.id = affiliate_id and a.user_id = auth.uid())
  );

-- Clicks: read only (writes via service_role)
create policy affiliate_clicks_self_read on public.affiliate_clicks
  for select using (
    exists (select 1 from public.affiliates a where a.id = affiliate_id and a.user_id = auth.uid())
  );

-- Referrals: read only
create policy affiliate_referrals_self_read on public.affiliate_referrals
  for select using (
    exists (select 1 from public.affiliates a where a.id = affiliate_id and a.user_id = auth.uid())
  );

-- Commissions: read only
create policy affiliate_commissions_self_read on public.affiliate_commissions
  for select using (
    exists (select 1 from public.affiliates a where a.id = affiliate_id and a.user_id = auth.uid())
  );

-- Payouts: read only
create policy affiliate_payouts_self_read on public.affiliate_payouts
  for select using (
    exists (select 1 from public.affiliates a where a.id = affiliate_id and a.user_id = auth.uid())
  );

-- Assets: any authenticated affiliate of that product can read
create policy affiliate_assets_read on public.affiliate_assets
  for select using (
    active = true and exists (
      select 1 from public.affiliates a
      where a.user_id = auth.uid() and a.product_id = affiliate_assets.product_id
    )
  );

-- ---------------------------------------------------------------------------
-- Seed assets for RealtorDesk (swap URLs after you upload to Supabase Storage)
-- ---------------------------------------------------------------------------
insert into public.affiliate_assets (product_id, type, title, description, url, dimensions, sort_order)
select
  p.id, v.type, v.title, v.description, v.url, v.dimensions, v.sort_order
from public.products p
cross join (values
  ('banner', 'Medium Rectangle', 'Classic IAB size for blog sidebars', 'https://cdn.realtordesk.ai/affiliate/banner-300x250.png', '300x250', 1),
  ('banner', 'Leaderboard',      'Top-of-article header banner',       'https://cdn.realtordesk.ai/affiliate/banner-728x90.png',  '728x90',  2),
  ('banner', 'Instagram Square', 'Square social post',                 'https://cdn.realtordesk.ai/affiliate/banner-1080.png',    '1080x1080', 3),
  ('email_swipe', 'Intro to realtor friends', 'Warm intro email — 180 words',        'https://cdn.realtordesk.ai/affiliate/swipe-intro.md',  null, 4),
  ('email_swipe', 'Pain-point cold outreach', 'For brokerages / coaches cold lists', 'https://cdn.realtordesk.ai/affiliate/swipe-cold.md',   null, 5),
  ('video',       '5-min product demo',        'Embed on YouTube / newsletter',      'https://www.realtordesk.ai/demo',                       null, 6)
) as v(type, title, description, url, dimensions, sort_order)
where p.slug = 'realtordesk';
