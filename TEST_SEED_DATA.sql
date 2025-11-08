-- ========================================
-- TestSprite Test Seed Data
-- Comprehensive test data for automated QA
-- Date: 2025-11-08
-- ========================================

-- IMPORTANT: Run this AFTER creating test users via signup
-- Test users must exist before running this script

-- ========================================
-- 1. TEST USER IDS (Replace with actual UUIDs after signup)
-- ========================================

-- Test Agent: test.agent@testsprite.test
-- UUID: [REPLACE_WITH_ACTUAL_UUID_AFTER_SIGNUP]
DO $$
DECLARE
  test_agent_id UUID := '89c7ef38-55f9-4202-8cce-f54435743a68'; -- REPLACE THIS
  test_team_id UUID := '89c7ef38-55f9-4202-8cce-f54435743a69'; -- REPLACE THIS
  test_broker_id UUID := '89c7ef38-55f9-4202-8cce-f54435743a70'; -- REPLACE THIS
  
  contact_id_1 UUID;
  contact_id_2 UUID;
  contact_id_3 UUID;
  contact_id_4 UUID;
  contact_id_5 UUID;
  
  deal_id_1 UUID;
  deal_id_2 UUID;
  
  property_id_1 UUID;
  property_id_2 UUID;
BEGIN

-- ========================================
-- 2. CONTACTS - Various lead types
-- ========================================

-- Hot Lead - Ready to buy
INSERT INTO public.contacts (
  user_id, first_name, last_name, email, phone,
  status, source, lead_score, ai_score,
  tags, best_contact_time,
  metadata
) VALUES (
  test_agent_id, 'Sarah', 'Johnson', 'sarah.johnson@testsprite.test', '555-0201',
  'qualified', 'website', 95, 95,
  ARRAY['buyer', 'hot-lead', 'first-time-buyer'],
  'weekday-evenings',
  '{"budget": 500000, "timeline": "immediate", "preapproved": true}'::jsonb
) RETURNING id INTO contact_id_1;

-- Warm Lead - Researching
INSERT INTO public.contacts (
  user_id, first_name, last_name, email, phone,
  status, source, lead_score, ai_score,
  tags, best_contact_time,
  metadata
) VALUES (
  test_agent_id, 'Michael', 'Chen', 'michael.chen@testsprite.test', '555-0202',
  'lead', 'referral', 70, 70,
  ARRAY['buyer', 'warm-lead', 'investor'],
  'weekday-mornings',
  '{"budget": 750000, "timeline": "3-6 months", "property_type": "condo"}'::jsonb
) RETURNING id INTO contact_id_2;

-- Cold Lead - Just inquired
INSERT INTO public.contacts (
  user_id, first_name, last_name, email, phone,
  status, source, lead_score, ai_score,
  tags, best_contact_time,
  metadata
) VALUES (
  test_agent_id, 'Emily', 'Rodriguez', 'emily.rodriguez@testsprite.test', '555-0203',
  'lead', 'facebook', 45, 45,
  ARRAY['buyer', 'cold-lead'],
  'weekends',
  '{"budget": 400000, "timeline": "12+ months"}'::jsonb
) RETURNING id INTO contact_id_3;

-- Seller Lead
INSERT INTO public.contacts (
  user_id, first_name, last_name, email, phone,
  status, source, lead_score, ai_score,
  tags, best_contact_time,
  metadata
) VALUES (
  test_agent_id, 'David', 'Williams', 'david.williams@testsprite.test', '555-0204',
  'qualified', 'website', 85, 85,
  ARRAY['seller', 'hot-lead'],
  'weekday-afternoons',
  '{"asking_price": 650000, "timeline": "immediate", "property_type": "house"}'::jsonb
) RETURNING id INTO contact_id_4;

-- Client - Closed deal
INSERT INTO public.contacts (
  user_id, first_name, last_name, email, phone,
  status, source, lead_score, ai_score,
  tags, best_contact_time,
  last_contact_date,
  metadata
) VALUES (
  test_agent_id, 'Jessica', 'Taylor', 'jessica.taylor@testsprite.test', '555-0205',
  'client', 'referral', 100, 100,
  ARRAY['buyer', 'client', 'repeat-client'],
  'anytime',
  NOW() - INTERVAL '30 days',
  '{"closed_deals": 2, "lifetime_value": 1200000}'::jsonb
) RETURNING id INTO contact_id_5;

-- ========================================
-- 3. ENGAGEMENT STATS for contacts
-- ========================================

INSERT INTO public.engagement_stats (
  contact_id, emails_sent, emails_opened, emails_clicked, emails_replied,
  website_visits, properties_viewed, documents_viewed, avg_session_duration
) VALUES
  (contact_id_1, 8, 7, 5, 3, 15, 12, 6, 420),
  (contact_id_2, 5, 3, 2, 1, 8, 6, 2, 280),
  (contact_id_3, 3, 1, 0, 0, 2, 1, 0, 60),
  (contact_id_4, 6, 5, 4, 2, 10, 0, 3, 350),
  (contact_id_5, 12, 10, 8, 6, 25, 18, 10, 600);

-- ========================================
-- 4. DEALS - Pipeline stages
-- ========================================

-- Active Deal - In Negotiation
INSERT INTO public.deals (
  user_id, contact_id, title, value, stage, status,
  probability, expected_close_date, notes,
  metadata
) VALUES (
  test_agent_id, contact_id_1, '456 Oak Street - Purchase', 485000, 'negotiation', 'active',
  75, CURRENT_DATE + INTERVAL '15 days', 'Hot buyer, pre-approved, motivated seller',
  '{"property_type": "single-family", "bedrooms": 3, "bathrooms": 2}'::jsonb
) RETURNING id INTO deal_id_1;

-- Active Deal - In Proposal
INSERT INTO public.deals (
  user_id, contact_id, title, value, stage, status,
  probability, expected_close_date, notes,
  metadata
) VALUES (
  test_agent_id, contact_id_4, '789 Maple Drive - Listing', 650000, 'proposal', 'active',
  60, CURRENT_DATE + INTERVAL '30 days', 'Preparing listing presentation',
  '{"property_type": "single-family", "bedrooms": 4, "bathrooms": 3}'::jsonb
) RETURNING id INTO deal_id_2;

-- Won Deal
INSERT INTO public.deals (
  user_id, contact_id, title, value, stage, status,
  probability, expected_close_date, notes,
  metadata
) VALUES (
  test_agent_id, contact_id_5, '123 Main Street - Purchase', 550000, 'closed_won', 'won',
  100, CURRENT_DATE - INTERVAL '30 days', 'Successfully closed, smooth transaction',
  '{"property_type": "condo", "bedrooms": 2, "bathrooms": 2, "commission": 16500}'::jsonb
);

-- Lost Deal
INSERT INTO public.deals (
  user_id, contact_id, title, value, stage, status,
  probability, expected_close_date, notes,
  metadata
) VALUES (
  test_agent_id, contact_id_3, '321 Pine Avenue - Purchase', 420000, 'closed_lost', 'lost',
  0, CURRENT_DATE - INTERVAL '45 days', 'Buyer went with another property',
  '{"loss_reason": "chose_different_property"}'::jsonb
);

-- ========================================
-- 5. TASKS - Various priorities and statuses
-- ========================================

-- Overdue High Priority Task
INSERT INTO public.tasks (
  user_id, contact_id, deal_id, title, description,
  priority, status, due_date, due_time
) VALUES (
  test_agent_id, contact_id_1, deal_id_1, 'Review Purchase Agreement',
  'Review and explain purchase agreement with client before signing',
  'high', 'pending', CURRENT_DATE - INTERVAL '2 days', '14:00:00'
);

-- Today High Priority Task
INSERT INTO public.tasks (
  user_id, contact_id, deal_id, title, description,
  priority, status, due_date, due_time
) VALUES (
  test_agent_id, contact_id_1, deal_id_1, 'Schedule Home Inspection',
  'Coordinate home inspection with inspector and client',
  'high', 'in_progress', CURRENT_DATE, '10:00:00'
);

-- Upcoming Medium Priority Task
INSERT INTO public.tasks (
  user_id, contact_id, title, description,
  priority, status, due_date, due_time
) VALUES (
  test_agent_id, contact_id_2, 'Follow-up Call',
  'Call to discuss new listings matching criteria',
  'medium', 'pending', CURRENT_DATE + INTERVAL '3 days', '11:00:00'
);

-- Low Priority Task
INSERT INTO public.tasks (
  user_id, title, description,
  priority, status, due_date
) VALUES (
  test_agent_id, 'Update MLS Listings',
  'Update property descriptions and photos on MLS',
  'low', 'pending', CURRENT_DATE + INTERVAL '7 days'
);

-- Completed Task
INSERT INTO public.tasks (
  user_id, contact_id, title, description,
  priority, status, due_date, completed_at
) VALUES (
  test_agent_id, contact_id_1, 'Send Pre-Approval Letter',
  'Obtain and send mortgage pre-approval letter',
  'high', 'completed', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days'
);

-- ========================================
-- 6. PROPERTY LISTINGS
-- ========================================

-- Active Listing
INSERT INTO public.property_listings (
  user_id, title, description, address, city, province, postal_code,
  property_type, listing_type, price,
  bedrooms, bathrooms, square_feet, lot_size, year_built,
  status, features, images
) VALUES (
  test_agent_id, 'Stunning 3-Bedroom Family Home', 
  'Beautiful single-family home in desirable neighbourhood. Recently renovated kitchen, hardwood floors throughout, large backyard. Close to schools and parks.',
  '456 Oak Street', 'Toronto', 'ON', 'M4B 1B1',
  'house', 'sale', 725000,
  3, 2.5, 1850, 0.15, 2010,
  'active',
  '["hardwood-floors", "renovated-kitchen", "finished-basement", "garage", "backyard"]'::jsonb,
  '[{"url": "https://example.com/img1.jpg", "caption": "Front view"}]'::jsonb
) RETURNING id INTO property_id_1;

-- Pending Listing
INSERT INTO public.property_listings (
  user_id, title, description, address, city, province, postal_code,
  property_type, listing_type, price,
  bedrooms, bathrooms, square_feet, year_built,
  status, features
) VALUES (
  test_agent_id, 'Modern Downtown Condo', 
  'Luxury 2-bedroom condo with stunning city views. Floor-to-ceiling windows, granite countertops, stainless steel appliances. Building amenities include gym, pool, concierge.',
  '789 Bay Street Unit 2501', 'Toronto', 'ON', 'M5G 2N7',
  'condo', 'sale', 550000,
  2, 2, 1200, 2018,
  'pending',
  '["city-views", "granite-counters", "stainless-appliances", "gym", "pool", "concierge"]'::jsonb
) RETURNING id INTO property_id_2;

-- Sold Listing
INSERT INTO public.property_listings (
  user_id, title, description, address, city, province, postal_code,
  property_type, listing_type, price,
  bedrooms, bathrooms, square_feet, year_built,
  status
) VALUES (
  test_agent_id, 'Charming Starter Home', 
  'Perfect for first-time buyers. 2-bedroom bungalow with updated bathroom, new roof, and large lot.',
  '123 Main Street', 'Mississauga', 'ON', 'L5A 1A1',
  'house', 'sale', 485000,
  2, 1, 900, 1965,
  'sold'
);

-- ========================================
-- 7. PROPERTY INTERESTS - Tracking client interest
-- ========================================

INSERT INTO public.property_interests (
  contact_id, user_id, address, property_type, price, interest_level,
  viewed_date, notes
) VALUES
  (contact_id_1, test_agent_id, '456 Oak Street, Toronto ON', 'house', 725000, 'high',
   CURRENT_DATE - INTERVAL '5 days', 'Viewed twice, very interested, matches budget'),
  (contact_id_2, test_agent_id, '789 Bay Street Unit 2501, Toronto ON', 'condo', 550000, 'medium',
   CURRENT_DATE - INTERVAL '10 days', 'Likes the area, concerned about condo fees'),
  (contact_id_1, test_agent_id, '321 Elm Avenue, Toronto ON', 'house', 680000, 'low',
   CURRENT_DATE - INTERVAL '15 days', 'Not interested, too far from work');

-- ========================================
-- 8. CONTACT ACTIVITIES - Timeline events
-- ========================================

INSERT INTO public.contact_activities (
  contact_id, user_id, activity_type, title, description,
  metadata
) VALUES
  (contact_id_1, test_agent_id, 'meeting', 'Property Showing - 456 Oak Street',
   'Showed property, client loved the kitchen and backyard',
   '{"duration": 45, "outcome": "positive", "next_steps": "prepare_offer"}'::jsonb),
  (contact_id_1, test_agent_id, 'call', 'Mortgage Pre-Approval Discussion',
   'Discussed financing options, client working with TD Bank',
   '{"duration": 30, "topics": ["mortgage", "down-payment"]}'::jsonb),
  (contact_id_2, test_agent_id, 'email', 'Sent New Listings',
   'Emailed 5 new condo listings matching criteria',
   '{"listings_sent": 5, "opened": true}'::jsonb),
  (contact_id_4, test_agent_id, 'meeting', 'Listing Consultation',
   'Initial consultation for selling property',
   '{"duration": 60, "cma_prepared": true, "listing_price_discussed": 650000}'::jsonb);

-- ========================================
-- 9. CONTACT NOTES
-- ========================================

INSERT INTO public.contact_notes (
  contact_id, user_id, content, is_pinned
) VALUES
  (contact_id_1, test_agent_id, 
   '**Very motivated buyer!** Pre-approved for $500K, looking to close within 30 days. Loves the Oak Street property. Need to submit offer this week.', 
   true),
  (contact_id_2, test_agent_id, 
   'Prefers condos in downtown core. Budget up to $750K but wants to see options in $500-600K range first. No rush to buy, wants perfect property.',
   false),
  (contact_id_4, test_agent_id, 
   'Relocation for work. Needs to sell quickly but wants top dollar. Property in excellent condition, should attract multiple offers.',
   true);

-- ========================================
-- 10. LEAD SCORES - Historical scoring
-- ========================================

INSERT INTO public.lead_scores (
  contact_id, score, quality,
  engagement_score, recency_score, property_match_score,
  demographics_score, communication_score
) VALUES
  (contact_id_1, 95, 'hot', 25, 25, 25, 10, 10),
  (contact_id_2, 70, 'warm', 18, 18, 18, 8, 8),
  (contact_id_3, 45, 'cold', 10, 10, 10, 8, 7),
  (contact_id_4, 85, 'hot', 22, 22, 20, 11, 10),
  (contact_id_5, 100, 'hot', 25, 25, 25, 15, 10);

-- ========================================
-- 11. AI INSIGHTS - Advanced lead scoring
-- ========================================

INSERT INTO public.ai_lead_scores (
  contact_id, score, factors, prediction_confidence,
  recommended_actions, optimal_contact_time, insights
) VALUES
  (contact_id_1, 95,
   '{"engagement": 0.95, "financial_readiness": 0.98, "urgency": 0.92, "property_match": 0.90}'::jsonb,
   0.94,
   ARRAY['Prepare offer immediately', 'Schedule final walkthrough', 'Connect with mortgage broker'],
   'weekday evenings 5-8pm',
   'Extremely high conversion probability. Strong financial position, high engagement, urgent timeline. Recommended action: Submit competitive offer on Oak Street property within 48 hours.'),
  (contact_id_2, 70,
   '{"engagement": 0.65, "financial_readiness": 0.80, "urgency": 0.40, "property_match": 0.75}'::jsonb,
   0.72,
   ARRAY['Send weekly property alerts', 'Schedule monthly check-ins', 'Invite to open houses'],
   'weekday mornings 9-11am',
   'Good potential but longer timeline. Patient buyer with strong finances. Focus on building relationship and providing market education.');

-- ========================================
-- 12. SCHEDULED EMAILS - Automated campaigns
-- ========================================

INSERT INTO public.scheduled_emails (
  contact_id, type, scheduled_for, status
) VALUES
  (contact_id_2, 'nurture', NOW() + INTERVAL '3 days', 'scheduled'),
  (contact_id_3, 'follow_up', NOW() + INTERVAL '7 days', 'scheduled');

-- ========================================
-- 13. EMAIL LOG - Sent communications
-- ========================================

INSERT INTO public.email_log (
  contact_id, type, status, sent_at
) VALUES
  (contact_id_1, 'property_alert', 'sent', NOW() - INTERVAL '2 days'),
  (contact_id_1, 'follow_up', 'sent', NOW() - INTERVAL '5 days'),
  (contact_id_2, 'welcome', 'sent', NOW() - INTERVAL '10 days'),
  (contact_id_5, 'property_alert', 'sent', NOW() - INTERVAL '30 days');

-- ========================================
-- Success Message
-- ========================================

RAISE NOTICE '✅ Test seed data created successfully!';
RAISE NOTICE '📊 Created:';
RAISE NOTICE '  - 5 Contacts (various lead types)';
RAISE NOTICE '  - 5 Engagement stat records';
RAISE NOTICE '  - 4 Deals (various stages)';
RAISE NOTICE '  - 5 Tasks (various priorities)';
RAISE NOTICE '  - 3 Property listings';
RAISE NOTICE '  - 3 Property interests';
RAISE NOTICE '  - 4 Activities';
RAISE NOTICE '  - 3 Notes';
RAISE NOTICE '  - 5 Lead scores';
RAISE NOTICE '  - 2 AI insights';
RAISE NOTICE '  - 2 Scheduled emails';
RAISE NOTICE '  - 4 Email logs';
RAISE NOTICE '';
RAISE NOTICE '⚠️  IMPORTANT: Update test_agent_id variable with actual user UUID';
RAISE NOTICE '   Get UUID from profiles table after user signup';

END $$;
