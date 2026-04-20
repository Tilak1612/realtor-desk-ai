-- ============================================================
-- Demo account seed: Jordan Tremblay (Montréal / Ottawa)
-- ============================================================
--
-- Purpose: populate a production account that looks like a real realtor
-- on day 45 of use. Used for recording the product walkthrough.
--
-- Prereq: demo@realtordesk.ai must already exist in auth.users.
--   1. Sign up via the app UI (don't use Supabase Auth Admin — you want
--      the handle_new_user() trigger to fire and create the profile row).
--   2. Complete onboarding to at least step 2 (hit the dashboard once).
--   3. Grab the user's UUID from Supabase → Auth → Users, or:
--        SELECT id FROM auth.users WHERE email = 'demo@realtordesk.ai';
--   4. Paste it into :demo_user_id below and run this file from the
--      Supabase SQL editor.
--
-- Safety:
--   - Every insert is tagged source='demo_seed' (contacts) or
--     data_source='demo_seed' (properties) so you can purge with:
--       DELETE FROM tasks WHERE user_id = <uuid> AND description LIKE '[demo_seed]%';
--       DELETE FROM deals WHERE user_id = <uuid> AND metadata->>'seed' = 'demo';
--       DELETE FROM contacts WHERE user_id = <uuid> AND source = 'demo_seed';
--       DELETE FROM property_listings WHERE user_id = <uuid> AND data_source = 'demo_seed';
--   - Phone numbers use (XXX) 555-01NN — NANPA-reserved fictitious range.
--   - Email domains mix common Canadian ISPs (videotron, sympatico,
--     rogers) and gmail/outlook to signal Canadian provenance.
--
-- To re-run: delete with the queries above, then paste again.
-- ============================================================

-- ↓↓↓ PASTE DEMO USER UUID HERE ↓↓↓
\set demo_user_id '00000000-0000-0000-0000-000000000000'
-- ↑↑↑ PASTE DEMO USER UUID HERE ↑↑↑

-- ------------------------------------------------------------
-- 1. Profile polish — brokerage, city, language, subscription
-- ------------------------------------------------------------
UPDATE public.profiles
SET
  full_name = 'Jordan Tremblay',
  company_name = 'RE/MAX du Cartier (Montréal)',
  city = 'Montreal',
  province = 'Quebec',
  phone = '(514) 555-0199',
  license_number = 'QC-DEMO-0199',
  primary_language = 'both',
  subscription_status = 'active',
  subscription_tier = 'agent',
  onboarding_completed = true,
  onboarding_step = 99,
  -- push trial_ends_at far out so no expiry banner ever shows
  trial_ends_at = now() + interval '365 days',
  updated_at = now()
WHERE id = :'demo_user_id';

-- ============================================================
-- 2. Contacts (40 rows) — 6 hot, 14 warm, 20 cold
-- ============================================================
-- All rows: source='demo_seed', casl_consent=true, consent_given=true
-- so the dashboard's CASL badges populate.

INSERT INTO public.contacts (
  user_id, first_name, last_name, email, phone, source,
  tags, ai_score, stage, notes,
  last_contact_date, next_followup_date,
  casl_consent, consent_given, consent_date, consent_source,
  preferred_language, unsubscribed, metadata, created_at, updated_at
) VALUES

-- ---- HOT (score 85-99) — 6 contacts ----
(:'demo_user_id', 'Priya', 'Bhattacharya', 'priya.b@gmail.com', '(514) 555-0101',
  'demo_seed', ARRAY['hot','pre-approved','plateau'], 94, 'qualified',
  'Mortgage pre-approved $675K. 3 showings attended. Prefers Saturday showings.',
  now() - interval '2 days', now() + interval '1 day',
  true, true, now() - interval '12 days', 'signup', 'en', false,
  '{"budget_cad": 675000, "target_area": "Plateau-Mont-Royal"}'::jsonb,
  now() - interval '38 days', now() - interval '2 days'),

(:'demo_user_id', 'Élise', 'Bélanger', 'elise.belanger@videotron.ca', '(514) 555-0102',
  'demo_seed', ARRAY['hot','francophone','outremont'], 92, 'qualified',
  'Francophone buyer, Outremont. Viewed 12 listings this month.',
  now() - interval '1 day', now() + interval '1 day',
  true, true, now() - interval '20 days', 'signup', 'fr', false,
  '{"budget_cad": 820000, "target_area": "Outremont"}'::jsonb,
  now() - interval '40 days', now() - interval '1 day'),

(:'demo_user_id', 'Michael', 'O''Sullivan', 'mosullivan@rogers.com', '(613) 555-0103',
  'demo_seed', ARRAY['hot','relocation','ottawa'], 89, 'qualified',
  'Relocating Toronto → Ottawa, 60-day timeline. Company paying closing costs.',
  now() - interval '3 days', now() + interval '2 days',
  true, true, now() - interval '8 days', 'signup', 'en', false,
  '{"relocation": true, "timeline_days": 60}'::jsonb,
  now() - interval '9 days', now() - interval '3 days'),

(:'demo_user_id', 'Ahmed', 'Qureshi', 'ahmed.q@outlook.com', '(514) 555-0104',
  'demo_seed', ARRAY['hot','second-home','mont-tremblant'], 87, 'qualified',
  'Second home in Mont-Tremblant. Cash buyer up to $1.2M.',
  now() - interval '4 days', now() + interval '3 days',
  true, true, now() - interval '15 days', 'signup', 'en', false,
  '{"cash_buyer": true, "budget_cad": 1200000}'::jsonb,
  now() - interval '22 days', now() - interval '4 days'),

(:'demo_user_id', 'Sophie', 'Tremblay', 's.tremblay@sympatico.ca', '(514) 555-0105',
  'demo_seed', ARRAY['hot','seller','verdun'], 85, 'contacted',
  'Seller in Verdun. Staging consult booked. Listing agreement in draft.',
  now() - interval '1 day', now() + interval '2 days',
  true, true, now() - interval '18 days', 'signup', 'fr', false,
  '{"role": "seller", "list_price_target_cad": 980000}'::jsonb,
  now() - interval '25 days', now() - interval '1 day'),

(:'demo_user_id', 'Raj', 'Kapoor', 'r.kapoor@gmail.com', '(613) 555-0106',
  'demo_seed', ARRAY['hot','downgrader','glebe'], 85, 'contacted',
  'Condo downgrader in the Glebe. Empty-nester.',
  now() - interval '5 days', now() + interval '2 days',
  true, true, now() - interval '28 days', 'signup', 'en', false,
  '{"role": "buyer", "stage_of_life": "empty_nest"}'::jsonb,
  now() - interval '30 days', now() - interval '5 days'),

-- ---- WARM (score 55-84) — 14 contacts ----
(:'demo_user_id', 'Marie-Hélène', 'Lavoie', 'mh.lavoie@videotron.ca', '(514) 555-0107',
  'demo_seed', ARRAY['warm','plateau'], 76, 'contacted', 'Browsing Plateau listings.',
  now() - interval '7 days', now() + interval '7 days',
  true, true, now() - interval '45 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '50 days', now() - interval '7 days'),
(:'demo_user_id', 'Laurent', 'Gagnon', 'laurent.gagnon@gmail.com', '(514) 555-0108',
  'demo_seed', ARRAY['warm','seller','st-henri'], 72, 'contacted', 'Considering listing St-Henri condo.',
  now() - interval '10 days', now() + interval '10 days',
  true, true, now() - interval '60 days', 'referral', 'fr', false, '{}'::jsonb,
  now() - interval '62 days', now() - interval '10 days'),
(:'demo_user_id', 'Jean-Philippe', 'Roy', 'jp.roy@outlook.com', '(514) 555-0109',
  'demo_seed', ARRAY['warm','first-time-buyer'], 70, 'contacted', 'First-time buyer workshop.',
  now() - interval '14 days', now() + interval '14 days',
  true, true, now() - interval '65 days', 'open_house', 'fr', false, '{}'::jsonb,
  now() - interval '70 days', now() - interval '14 days'),
(:'demo_user_id', 'Genevieve', 'Côté', 'g.cote@videotron.ca', '(514) 555-0110',
  'demo_seed', ARRAY['warm','investor'], 68, 'contacted', 'Building small plex portfolio.',
  now() - interval '9 days', now() + interval '9 days',
  true, true, now() - interval '40 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '48 days', now() - interval '9 days'),
(:'demo_user_id', 'Pierre-Luc', 'Bergeron', 'pl.bergeron@sympatico.ca', '(514) 555-0111',
  'demo_seed', ARRAY['warm','nun''s-island'], 66, 'contacted', 'Île-des-Sœurs waterfront interest.',
  now() - interval '11 days', now() + interval '11 days',
  true, true, now() - interval '55 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '60 days', now() - interval '11 days'),
(:'demo_user_id', 'Catherine', 'Morin', 'c.morin@rogers.com', '(613) 555-0112',
  'demo_seed', ARRAY['warm','ottawa','seller'], 64, 'contacted', 'Ottawa seller, flexible timeline.',
  now() - interval '13 days', now() + interval '13 days',
  true, true, now() - interval '70 days', 'referral', 'en', false, '{}'::jsonb,
  now() - interval '72 days', now() - interval '13 days'),
(:'demo_user_id', 'David', 'Chen', 'dchen@gmail.com', '(613) 555-0113',
  'demo_seed', ARRAY['warm','ottawa','bank-st'], 62, 'contacted', 'Offer drafted on 87 Bank St.',
  now() - interval '2 days', now() + interval '1 day',
  true, true, now() - interval '20 days', 'website', 'en', false, '{}'::jsonb,
  now() - interval '32 days', now() - interval '2 days'),
(:'demo_user_id', 'Nathalie', 'Fortin', 'n.fortin@videotron.ca', '(514) 555-0114',
  'demo_seed', ARRAY['warm','ahuntsic'], 60, 'contacted', 'Looking in Ahuntsic-Cartierville.',
  now() - interval '16 days', now() + interval '16 days',
  true, true, now() - interval '50 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '55 days', now() - interval '16 days'),
(:'demo_user_id', 'Jonathan', 'Nguyen', 'jnguyen@outlook.com', '(514) 555-0115',
  'demo_seed', ARRAY['warm','westmount'], 60, 'contacted', 'Westmount duplex closed — following up for referrals.',
  now() - interval '18 days', now() + interval '20 days',
  true, true, now() - interval '120 days', 'referral', 'en', false, '{}'::jsonb,
  now() - interval '150 days', now() - interval '18 days'),
(:'demo_user_id', 'Chloé', 'Lambert', 'chloe.lambert@gmail.com', '(514) 555-0116',
  'demo_seed', ARRAY['warm','griffintown'], 58, 'contacted', 'Young professional, Griffintown condo.',
  now() - interval '20 days', now() + interval '15 days',
  true, true, now() - interval '75 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '80 days', now() - interval '20 days'),
(:'demo_user_id', 'Olivier', 'Dubois', 'o.dubois@videotron.ca', '(514) 555-0117',
  'demo_seed', ARRAY['warm','rosemont'], 58, 'contacted', 'Rosemont family buyer.',
  now() - interval '22 days', now() + interval '18 days',
  true, true, now() - interval '80 days', 'open_house', 'fr', false, '{}'::jsonb,
  now() - interval '85 days', now() - interval '22 days'),
(:'demo_user_id', 'Mélanie', 'Simard', 'm.simard@sympatico.ca', '(514) 555-0118',
  'demo_seed', ARRAY['warm','laval'], 56, 'contacted', 'Laval townhouse search.',
  now() - interval '25 days', now() + interval '21 days',
  true, true, now() - interval '90 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '95 days', now() - interval '25 days'),
(:'demo_user_id', 'Benoit', 'Lévesque', 'b.levesque@gmail.com', '(514) 555-0119',
  'demo_seed', ARRAY['warm','hochelaga'], 56, 'contacted', 'Hochelaga-Maisonneuve investor.',
  now() - interval '28 days', now() + interval '25 days',
  true, true, now() - interval '100 days', 'referral', 'fr', false, '{}'::jsonb,
  now() - interval '105 days', now() - interval '28 days'),
(:'demo_user_id', 'Isabelle', 'Pelletier', 'i.pelletier@videotron.ca', '(514) 555-0120',
  'demo_seed', ARRAY['warm','mile-end'], 55, 'contacted', 'Mile End lofts.',
  now() - interval '30 days', now() + interval '28 days',
  true, true, now() - interval '110 days', 'open_house', 'fr', false, '{}'::jsonb,
  now() - interval '115 days', now() - interval '30 days'),

-- ---- COLD (score 10-54) — 20 contacts ----
(:'demo_user_id', 'Alain', 'Boucher', 'alain.b@gmail.com', '(514) 555-0121',
  'demo_seed', ARRAY['cold'], 45, 'new', NULL,
  now() - interval '62 days', NULL, true, true, now() - interval '130 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '140 days', now() - interval '62 days'),
(:'demo_user_id', 'Sandra', 'Martin', 'sandra.m@outlook.com', '(514) 555-0122',
  'demo_seed', ARRAY['cold'], 42, 'new', NULL,
  now() - interval '70 days', NULL, true, true, now() - interval '140 days', 'website', 'en', false, '{}'::jsonb,
  now() - interval '145 days', now() - interval '70 days'),
(:'demo_user_id', 'François', 'Leblanc', 'f.leblanc@videotron.ca', '(514) 555-0123',
  'demo_seed', ARRAY['cold'], 40, 'new', NULL,
  now() - interval '75 days', NULL, true, true, now() - interval '145 days', 'referral', 'fr', false, '{}'::jsonb,
  now() - interval '150 days', now() - interval '75 days'),
(:'demo_user_id', 'Karen', 'Wong', 'k.wong@rogers.com', '(613) 555-0124',
  'demo_seed', ARRAY['cold','ottawa'], 38, 'new', NULL,
  now() - interval '80 days', NULL, true, true, now() - interval '150 days', 'website', 'en', false, '{}'::jsonb,
  now() - interval '155 days', now() - interval '80 days'),
(:'demo_user_id', 'Thierry', 'Girard', 't.girard@sympatico.ca', '(514) 555-0125',
  'demo_seed', ARRAY['cold'], 36, 'new', NULL,
  now() - interval '85 days', NULL, true, true, now() - interval '155 days', 'open_house', 'fr', false, '{}'::jsonb,
  now() - interval '160 days', now() - interval '85 days'),
(:'demo_user_id', 'Amanda', 'Fletcher', 'a.fletcher@gmail.com', '(613) 555-0126',
  'demo_seed', ARRAY['cold','ottawa'], 34, 'new', NULL,
  now() - interval '90 days', NULL, true, true, now() - interval '160 days', 'website', 'en', false, '{}'::jsonb,
  now() - interval '165 days', now() - interval '90 days'),
(:'demo_user_id', 'Éric', 'Desjardins', 'e.desjardins@videotron.ca', '(514) 555-0127',
  'demo_seed', ARRAY['cold'], 32, 'new', NULL,
  now() - interval '95 days', NULL, true, true, now() - interval '165 days', 'referral', 'fr', false, '{}'::jsonb,
  now() - interval '170 days', now() - interval '95 days'),
(:'demo_user_id', 'Lisa', 'Patel', 'lisa.patel@outlook.com', '(514) 555-0128',
  'demo_seed', ARRAY['cold'], 30, 'new', NULL,
  now() - interval '100 days', NULL, true, true, now() - interval '170 days', 'website', 'en', false, '{}'::jsonb,
  now() - interval '175 days', now() - interval '100 days'),
(:'demo_user_id', 'Yannick', 'Caron', 'y.caron@sympatico.ca', '(514) 555-0129',
  'demo_seed', ARRAY['cold'], 28, 'new', NULL,
  now() - interval '105 days', NULL, true, true, now() - interval '175 days', 'open_house', 'fr', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '105 days'),
(:'demo_user_id', 'Rachel', 'Goldberg', 'r.goldberg@gmail.com', '(514) 555-0130',
  'demo_seed', ARRAY['cold','westmount'], 28, 'new', NULL,
  now() - interval '110 days', NULL, true, true, now() - interval '180 days', 'referral', 'en', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '110 days'),
(:'demo_user_id', 'Martin', 'Beaulieu', 'martin.b@videotron.ca', '(514) 555-0131',
  'demo_seed', ARRAY['cold'], 26, 'new', NULL,
  now() - interval '115 days', NULL, true, true, now() - interval '180 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '115 days'),
(:'demo_user_id', 'Diane', 'Tremblay-Roy', 'd.tremblayroy@rogers.com', '(514) 555-0132',
  'demo_seed', ARRAY['cold'], 24, 'new', NULL,
  now() - interval '120 days', NULL, true, true, now() - interval '180 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '120 days'),
(:'demo_user_id', 'Samir', 'Ahmed', 's.ahmed@gmail.com', '(613) 555-0133',
  'demo_seed', ARRAY['cold','ottawa'], 22, 'new', NULL,
  now() - interval '125 days', NULL, true, true, now() - interval '180 days', 'referral', 'en', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '125 days'),
(:'demo_user_id', 'Julie', 'Lemieux', 'julie.l@outlook.com', '(514) 555-0134',
  'demo_seed', ARRAY['cold'], 20, 'new', NULL,
  now() - interval '130 days', NULL, true, true, now() - interval '180 days', 'open_house', 'fr', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '130 days'),
(:'demo_user_id', 'Robert', 'MacDonald', 'r.macdonald@sympatico.ca', '(613) 555-0135',
  'demo_seed', ARRAY['cold','ottawa'], 20, 'new', NULL,
  now() - interval '135 days', NULL, true, true, now() - interval '180 days', 'website', 'en', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '135 days'),
(:'demo_user_id', 'Valérie', 'Savard', 'v.savard@videotron.ca', '(514) 555-0136',
  'demo_seed', ARRAY['cold'], 18, 'new', NULL,
  now() - interval '140 days', NULL, true, true, now() - interval '180 days', 'referral', 'fr', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '140 days'),
(:'demo_user_id', 'Patrick', 'O''Brien', 'p.obrien@gmail.com', '(613) 555-0137',
  'demo_seed', ARRAY['cold','ottawa'], 16, 'new', NULL,
  now() - interval '145 days', NULL, true, true, now() - interval '180 days', 'website', 'en', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '145 days'),
(:'demo_user_id', 'Amélie', 'Dubé', 'a.dube@sympatico.ca', '(514) 555-0138',
  'demo_seed', ARRAY['cold'], 14, 'new', NULL,
  now() - interval '150 days', NULL, true, true, now() - interval '180 days', 'open_house', 'fr', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '150 days'),
(:'demo_user_id', 'Kevin', 'Thompson', 'k.thompson@outlook.com', '(613) 555-0139',
  'demo_seed', ARRAY['cold','ottawa'], 12, 'new', NULL,
  now() - interval '160 days', NULL, true, true, now() - interval '180 days', 'referral', 'en', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '160 days'),
(:'demo_user_id', 'Sébastien', 'Poirier', 's.poirier@videotron.ca', '(514) 555-0140',
  'demo_seed', ARRAY['cold'], 10, 'new', NULL,
  now() - interval '175 days', NULL, true, true, now() - interval '180 days', 'website', 'fr', false, '{}'::jsonb,
  now() - interval '180 days', now() - interval '175 days');

-- ============================================================
-- 3. Deals (10 rows across pipeline stages)
-- ============================================================
-- Each deal linked to a hot/warm contact by matching email.
-- metadata.seed = 'demo' so you can bulk-delete later.

INSERT INTO public.deals (
  user_id, contact_id, title, stage, value, listing_price,
  commission_percentage, probability, status,
  expected_close_date, closing_date, notes, metadata, created_at, updated_at
)
SELECT :'demo_user_id'::uuid, c.id, d.title, d.stage, d.value, d.listing_price,
       d.commission_percentage, d.probability, d.status,
       d.expected_close, d.expected_close, d.notes,
       jsonb_build_object('seed','demo'), d.created_at, d.updated_at
FROM (VALUES
  ('priya.b@gmail.com',             'Bhattacharya — Plateau buyer',            'new',        675000::numeric, 675000::numeric, 2.5::numeric,  30, 'active',  (now() + interval '75 days')::date, 'Pre-approval letter in file. 3 showings attended.',                  now() - interval '12 days', now() - interval '2 days'),
  ('ahmed.q@outlook.com',           'Qureshi — Mont-Tremblant second home',    'new',       1150000::numeric,1150000::numeric, 2.5::numeric,  25, 'active',  (now() + interval '90 days')::date, 'Cash buyer. Weekend showings only.',                                 now() - interval '10 days', now() - interval '4 days'),
  ('elise.belanger@videotron.ca',   'Bélanger — Outremont condo',              'contacted',  820000::numeric, 820000::numeric, 2.5::numeric,  40, 'active',  (now() + interval '60 days')::date, 'Francophone, wants detailed FR pre-showing brief.',                  now() - interval '18 days', now() - interval '1 day'),
  ('r.kapoor@gmail.com',            'Kapoor — Glebe downgrade',                'contacted',  595000::numeric, 595000::numeric, 2.5::numeric,  35, 'active',  (now() + interval '55 days')::date, 'Empty-nester. Low-maintenance condo priority.',                      now() - interval '22 days', now() - interval '5 days'),
  ('mosullivan@rogers.com',         'O''Sullivan — Ottawa relocation',          'qualified',  785000::numeric, 785000::numeric, 2.5::numeric,  55, 'active',  (now() + interval '45 days')::date, 'Employer relocating; closing costs covered.',                        now() - interval '8 days',  now() - interval '3 days'),
  ('s.tremblay@sympatico.ca',       'Tremblay — Verdun listing prep',          'qualified',  980000::numeric, 980000::numeric, 2.5::numeric,  60, 'active',  (now() + interval '35 days')::date, 'Listing agreement draft; staging consult booked.',                   now() - interval '20 days', now() - interval '1 day'),
  ('dchen@gmail.com',               'Chen — 87 Bank St Ottawa counter',        'offer',      895000::numeric, 895000::numeric, 2.5::numeric,  70, 'active',  (now() + interval '20 days')::date, 'Counter-offer in motion. Response expected Friday.',                 now() - interval '14 days', now() - interval '2 days'),
  ('laurent.gagnon@gmail.com',      'Gagnon — 4242 St-Denis conditional',      'offer',      749000::numeric, 749000::numeric, 2.5::numeric,  75, 'active',  (now() + interval '25 days')::date, 'Conditional on financing. Deadline Apr 29.',                         now() - interval '25 days', now() - interval '3 days'),
  ('c.morin@rogers.com',            'Morin — 1205 Île-des-Sœurs closing',      'closed',    1100000::numeric,1100000::numeric, 2.5::numeric,  95, 'active',  (now() + interval '15 days')::date, 'Closing May 12. All conditions met.',                                now() - interval '60 days', now() - interval '5 days'),
  ('jnguyen@outlook.com',           'Nguyen — Westmount duplex',               'closed',    1400000::numeric,1400000::numeric, 2.5::numeric, 100, 'won',    (now() - interval '15 days')::date, 'Closed Apr 4 at $1.4M. Referral request pending.',                   now() - interval '90 days', now() - interval '15 days')
) AS d(contact_email, title, stage, value, listing_price, commission_percentage, probability, status, expected_close, notes, created_at, updated_at)
JOIN public.contacts c
  ON c.email = d.contact_email AND c.user_id = :'demo_user_id'::uuid;

-- ============================================================
-- 4. Tasks (11 rows — 5 due today, 3 overdue, 3 future)
-- ============================================================

INSERT INTO public.tasks (
  user_id, contact_id, title, description,
  due_date, priority, status, created_at, updated_at
)
SELECT :'demo_user_id'::uuid, c.id, t.title, t.description,
       t.due_date, t.priority, t.status, now() - interval '3 days', now()
FROM (VALUES
  -- due today (5)
  ('priya.b@gmail.com',           'Follow up with Priya Bhattacharya',          '[demo_seed] Check in on Plateau showing preferences.',                     (now())::date,                  'high',   'pending'),
  ('elise.belanger@videotron.ca', 'Send pre-showing packet (FR) — Bélanger',    '[demo_seed] Send French-language Outremont showing packet.',               (now())::date,                  'high',   'pending'),
  ('mosullivan@rogers.com',       'Confirm Saturday 10am — O''Sullivan',         '[demo_seed] Confirm 87 Bank St showing Saturday 10am.',                    (now())::date,                  'high',   'pending'),
  ('dchen@gmail.com',             'Review counter-offer — Chen / 87 Bank',      '[demo_seed] Review terms and draft response for David.',                   (now())::date,                  'high',   'pending'),
  ('ahmed.q@outlook.com',         'Call back Ahmed Qureshi — Mont-Tremblant',   '[demo_seed] Follow-up on weekend property set.',                           (now())::date,                  'medium', 'pending'),
  -- overdue (3)
  ('s.tremblay@sympatico.ca',     'Draft listing agreement — Tremblay',         '[demo_seed] Finalize Verdun listing agreement draft.',                     (now() - interval '2 days')::date, 'high',   'pending'),
  (NULL,                          'Staging consult follow-up — Verdun',         '[demo_seed] Confirm stager booking and furniture swap timing.',            (now() - interval '3 days')::date, 'medium', 'pending'),
  ('r.kapoor@gmail.com',          'Mortgage broker intro — Kapoor',             '[demo_seed] Send Raj to preferred broker for pre-qual.',                   (now() - interval '1 day')::date,  'medium', 'pending'),
  -- future (3)
  ('s.tremblay@sympatico.ca',     'Listing photoshoot — Tremblay',              '[demo_seed] Photographer booked; Verdun condo.',                           (now() + interval '5 days')::date, 'medium', 'pending'),
  ('laurent.gagnon@gmail.com',    'Open house — 4242 St-Denis',                 '[demo_seed] 4242 Rue Saint-Denis open house.',                             (now() + interval '7 days')::date, 'medium', 'pending'),
  ('c.morin@rogers.com',          'Closing — Morin — Île-des-Sœurs',            '[demo_seed] Final walkthrough + closing paperwork.',                       (now() + interval '15 days')::date,'high',   'pending')
) AS t(contact_email, title, description, due_date, priority, status)
LEFT JOIN public.contacts c
  ON c.email = t.contact_email AND c.user_id = :'demo_user_id'::uuid;

-- ============================================================
-- 5. Property listings (3 rows)
-- ============================================================

INSERT INTO public.property_listings (
  user_id, title, description, address, street, city, province,
  country, postal_code, property_type, listing_type, price, currency,
  bedrooms, bathrooms, square_feet, year_built,
  status, mls_number, realtor_ca_url, data_source, source, metadata,
  created_at, updated_at
) VALUES
  (:'demo_user_id', '4242 Rue Saint-Denis — Le Plateau',
   'Bright 3-bedroom condo on Saint-Denis. Rooftop access, newer mechanicals.',
   '4242 Rue Saint-Denis, Montréal, QC H2J', '4242 Rue Saint-Denis',
   'Montreal', 'Quebec', 'Canada', 'H2J 2L1', 'condo', 'sale',
   749000::numeric, 'CAD', 3, 2::numeric, 1250, 1920,
   'active', 'MTL-SEED-0001', NULL, 'demo_seed', 'demo_seed',
   '{"staging_consult": true}'::jsonb,
   now() - interval '25 days', now() - interval '3 days'),

  (:'demo_user_id', '87 Bank Street — Ottawa Centretown',
   'Townhouse with income suite potential. Walking distance to Parliament Hill.',
   '87 Bank Street, Ottawa, ON K1P', '87 Bank Street',
   'Ottawa', 'Ontario', 'Canada', 'K1P 5N5', 'townhouse', 'sale',
   895000::numeric, 'CAD', 4, 3::numeric, 1850, 1965,
   'active', 'OTT-SEED-0002', NULL, 'demo_seed', 'demo_seed',
   '{"offer_in_motion": true}'::jsonb,
   now() - interval '18 days', now() - interval '2 days'),

  (:'demo_user_id', '1205 Île-des-Sœurs — Waterfront',
   'Waterfront condo, south-facing. Under contract, closing May 12.',
   '1205 Boulevard de l''Île-des-Sœurs, Verdun, QC H3E', '1205 Boulevard de l''Île-des-Sœurs',
   'Verdun', 'Quebec', 'Canada', 'H3E 1Y7', 'condo', 'sale',
   1100000::numeric, 'CAD', 2, 2::numeric, 1400, 2005,
   'sold', 'MTL-SEED-0003', NULL, 'demo_seed', 'demo_seed',
   '{"closing_date":"2026-05-12"}'::jsonb,
   now() - interval '65 days', now() - interval '5 days');

-- ============================================================
-- 6. Confirmation
-- ============================================================

SELECT
  (SELECT count(*) FROM public.contacts         WHERE user_id = :'demo_user_id'::uuid AND source = 'demo_seed')       AS contacts_seeded,
  (SELECT count(*) FROM public.deals            WHERE user_id = :'demo_user_id'::uuid AND metadata->>'seed' = 'demo') AS deals_seeded,
  (SELECT count(*) FROM public.tasks            WHERE user_id = :'demo_user_id'::uuid AND description LIKE '[demo_seed]%') AS tasks_seeded,
  (SELECT count(*) FROM public.property_listings WHERE user_id = :'demo_user_id'::uuid AND data_source = 'demo_seed') AS properties_seeded;
-- Expected: contacts_seeded=40, deals_seeded=10, tasks_seeded=11, properties_seeded=3
