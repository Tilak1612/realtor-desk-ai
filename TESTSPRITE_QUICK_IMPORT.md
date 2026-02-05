# TestSprite Quick Import - RealtorDesk AI API

**Base URLs:**
- REST API: `https://pseqajrtcgiphfnworii.supabase.co/rest/v1`
- Edge Functions: `https://pseqajrtcgiphfnworii.supabase.co/functions/v1`

**Global Headers (Required for ALL requests):**
```
Authorization: Bearer {JWT_TOKEN}
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U
Content-Type: application/json
```

---

## API Endpoints Table (Copy to TestSprite)

| # | API Name | HTTP Method | Endpoint Path | Auth Required | Request Body Example | Status |
|---|----------|-------------|---------------|---------------|---------------------|--------|
| **CONTACTS API** |
| 1 | List Contacts | GET | `/rest/v1/contacts` | ✅ JWT + API Key | None | ✅ Ready |
| 2 | Get Contact | GET | `/rest/v1/contacts?id=eq.{uuid}` | ✅ JWT + API Key | None | ✅ Ready |
| 3 | Create Contact | POST | `/rest/v1/contacts` | ✅ JWT + API Key | `{"first_name":"John","email":"john@example.com"}` | ✅ Ready |
| 4 | Update Contact | PATCH | `/rest/v1/contacts?id=eq.{uuid}` | ✅ JWT + API Key | `{"status":"client","lead_score":85}` | ✅ Ready |
| 5 | Delete Contact | DELETE | `/rest/v1/contacts?id=eq.{uuid}` | ✅ JWT + API Key | None | ✅ Ready |
| **DEALS API** |
| 6 | List Deals | GET | `/rest/v1/deals` | ✅ JWT + API Key | None | ✅ Ready |
| 7 | Create Deal | POST | `/rest/v1/deals` | ✅ JWT + API Key | `{"title":"Property Deal","stage":"qualified","value":500000}` | ✅ Ready |
| 8 | Update Deal | PATCH | `/rest/v1/deals?id=eq.{uuid}` | ✅ JWT + API Key | `{"stage":"closed_won","status":"won"}` | ✅ Ready |
| 9 | Delete Deal | DELETE | `/rest/v1/deals?id=eq.{uuid}` | ✅ JWT + API Key | None | ✅ Ready |
| **TASKS API** |
| 10 | List Tasks | GET | `/rest/v1/tasks` | ✅ JWT + API Key | None | ✅ Ready |
| 11 | Create Task | POST | `/rest/v1/tasks` | ✅ JWT + API Key | `{"title":"Follow up","priority":"high","due_date":"2026-02-15"}` | ✅ Ready |
| 12 | Update Task | PATCH | `/rest/v1/tasks?id=eq.{uuid}` | ✅ JWT + API Key | `{"status":"completed"}` | ✅ Ready |
| 13 | Delete Task | DELETE | `/rest/v1/tasks?id=eq.{uuid}` | ✅ JWT + API Key | None | ✅ Ready |
| **PROPERTIES API** |
| 14 | List Properties | GET | `/rest/v1/property_listings` | ✅ JWT + API Key | None | ✅ Ready |
| 15 | Create Property | POST | `/rest/v1/property_listings` | ✅ JWT + API Key | `{"title":"3BR Condo","address":"123 King St","price":899000}` | ✅ Ready |
| 16 | Update Property | PATCH | `/rest/v1/property_listings?id=eq.{uuid}` | ✅ JWT + API Key | `{"status":"sold","price":920000}` | ✅ Ready |
| 17 | Delete Property | DELETE | `/rest/v1/property_listings?id=eq.{uuid}` | ✅ JWT + API Key | None | ✅ Ready |
| **AI & CHATBOT** |
| 18 | AI Chatbot | POST | `/functions/v1/ai-chatbot` | ✅ JWT + API Key | `{"messages":[{"role":"user","content":"Tell me about Toronto"}]}` | ✅ Ready |
| 19 | Claude Chat | POST | `/functions/v1/claude-chat` | ✅ JWT + API Key | `{"message":"Write listing description","context":"3BR condo"}` | ✅ Ready |
| 20 | Generate Call Summary | POST | `/functions/v1/generate-call-summary` | ✅ JWT + API Key | `{"notes":"Discussed condos","contactName":"John","currentStage":"lead"}` | ⚠️ Needs OPENAI_API_KEY |
| 21 | Calculate Lead Score | POST | `/functions/v1/calculate-lead-score` | ✅ JWT + API Key | `{"contactId":"uuid"}` | ✅ Ready |
| 22 | Lead Score Calculator | POST | `/functions/v1/lead-score-calculator` | ✅ JWT + API Key | `{"contactId":"uuid"}` | ✅ Ready |
| **PAYMENTS & SUBSCRIPTIONS** |
| 23 | Check Subscription | GET | `/functions/v1/check-subscription` | ✅ JWT + API Key | None | ⚠️ Needs STRIPE_SECRET_KEY |
| 24 | Create Checkout | POST | `/functions/v1/create-checkout` | ✅ JWT + API Key | `{"priceId":"price_123","tier":"team"}` | ⚠️ Needs STRIPE_SECRET_KEY |
| 25 | Customer Portal | GET | `/functions/v1/customer-portal` | ✅ JWT + API Key | None | ⚠️ Needs STRIPE_SECRET_KEY |
| **EMAIL & SMS** |
| 26 | Email Automation | POST | `/functions/v1/email-automation` | ✅ JWT + API Key | `{"contactId":"uuid","type":"welcome","delay":0}` | ⚠️ Needs HUBSPOT_API_KEY |
| 27 | Send Welcome Email | POST | `/functions/v1/send-welcome-email` | ✅ JWT + API Key | `{"userId":"uuid"}` | ✅ Ready |
| 28 | Send SMS | POST | `/functions/v1/send-sms` | ✅ JWT + API Key | `{"to":"+14165551234","message":"Hello"}` | ⚠️ Needs Twilio |
| 29 | Send Phone Verification | POST | `/functions/v1/send-phone-verification` | ✅ JWT + API Key | `{"phoneNumber":"+14165551234"}` | ⚠️ Needs Twilio |
| **INTEGRATIONS** |
| 30 | HubSpot Sync | POST | `/functions/v1/hubspot-sync` | ❌ Public | `{"contactId":"uuid","action":"sync"}` | ⚠️ Needs HUBSPOT_API_KEY |
| 31 | Encrypt Token | POST | `/functions/v1/encrypt-integration-token` | ✅ JWT + API Key | `{"token":"api_key","provider":"hubspot"}` | ✅ Ready |
| 32 | Apify Runner | POST | `/functions/v1/apify-runner` | ✅ JWT + API Key | `{"url":"https://realtor.ca/...","actorId":"..."}` | ⚠️ Needs APIFY_API_TOKEN |
| 33 | Run Automation | POST | `/functions/v1/run-automation` | ✅ JWT + API Key | `{"automationId":"uuid","trigger":"manual"}` | ✅ Ready |

---

## Test Account Credentials

| Email | Password | Role |
|-------|----------|------|
| test.agent@testsprite.test | TestAgent123! | Agent (Free) |
| test.teamadmin@testsprite.test | TestTeam123! | Team Admin |
| test.broker@testsprite.test | TestBroker123! | Broker |

**How to get JWT Token:**
1. Login at: https://realtor-desk-ai.lovable.app/login
2. Open DevTools (F12) → Application → Local Storage
3. Find: `sb-pseqajrtcgiphfnworii-auth-token`
4. Copy `access_token` value
5. Token expires in 1 hour

---

## Required Environment Variables

### ✅ Ready Now (No Setup Needed)
- All REST APIs (Contacts, Deals, Tasks, Properties)
- AI Chatbot & Claude Chat
- Lead Scoring
- Token Encryption
- Automation Runner

### ⚠️ Requires API Keys (Optional)

| Service | Variables | Used In | Priority |
|---------|-----------|---------|----------|
| **Stripe** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Subscriptions, Checkout, Customer Portal | 🔴 HIGH |
| **OpenAI** | `OPENAI_API_KEY` | Call Summary Generation | 🟡 MEDIUM |
| **Twilio** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | SMS & Phone Verification | 🟢 LOW |
| **HubSpot** | `HUBSPOT_API_KEY` | Email Automation, CRM Sync | 🟢 LOW |
| **Apify** | `APIFY_API_TOKEN` | MLS Scraping | 🟢 LOW |

---

## Quick Test Commands

### 1. Get JWT Token
```bash
curl -X POST 'https://pseqajrtcgiphfnworii.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test.agent@testsprite.test","password":"TestAgent123!"}'
```

### 2. Create Contact
```bash
curl -X POST 'https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U' \
  -H 'Content-Type: application/json' \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","status":"lead"}'
```

### 3. List Contacts
```bash
curl -X GET 'https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts?limit=10' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U'
```

### 4. AI Chatbot
```bash
curl -X POST 'https://pseqajrtcgiphfnworii.supabase.co/functions/v1/ai-chatbot' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U' \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"What are the best neighborhoods in Toronto?"}]}'
```

---

## External APIs Called by Backend

| Service | Purpose | Base URL | SDK/Library |
|---------|---------|----------|-------------|
| **Supabase** | Database, Auth, Functions | `https://pseqajrtcgiphfnworii.supabase.co` | `@supabase/supabase-js@2` |
| **Stripe** | Payment Processing | `https://api.stripe.com/v1` | `stripe@18.5.0` |
| **Lovable AI** | Claude AI Proxy | `https://ai.gateway.lovable.dev/v1` | Native fetch |
| **OpenAI** | GPT-4 Summaries | `https://api.openai.com/v1` | Native fetch |
| **Twilio** | SMS & Phone | `https://api.twilio.com/2010-04-01` | Native fetch |
| **HubSpot** | Email & CRM Sync | `https://api.hubapi.com` | Native fetch |
| **Apify** | Web Scraping | `https://api.apify.com/v2` | Native fetch |

---

## Success Criteria for TestSprite

### ✅ Test These First (No Setup Required)
1. **Authentication Flow**
   - Get JWT token via login API
   - Verify token works with REST endpoints
   - Test token expiration (1 hour)

2. **CRUD Operations on All Resources**
   - Create → Read → Update → Delete flow for:
     - Contacts
     - Deals
     - Tasks
     - Properties

3. **AI Functions**
   - AI Chatbot with various queries
   - Claude Chat for content generation
   - Lead Score calculation

### ⚠️ Test After API Key Configuration
4. **Payment Functions** (requires Stripe keys)
   - Check subscription status
   - Create checkout session
   - Generate customer portal URL

5. **Communication Functions** (requires Twilio/HubSpot keys)
   - Email automation
   - SMS sending
   - Phone verification

6. **Integration Functions** (requires external API keys)
   - HubSpot sync
   - Apify scraping

---

## Expected HTTP Response Codes

| Operation | Success | Errors |
|-----------|---------|--------|
| **GET (list)** | 200 OK | 401 Unauthorized, 403 Forbidden |
| **GET (single)** | 200 OK | 401, 404 Not Found |
| **POST (create)** | 201 Created | 400 Bad Request, 401, 422 Unprocessable |
| **PATCH (update)** | 200 OK | 400, 401, 404 |
| **DELETE** | 204 No Content | 401, 404 |
| **Edge Functions** | 200 OK | 400, 401, 500 Server Error |

---

## Postman/TestSprite Collection Variables

```json
{
  "baseUrl": "https://pseqajrtcgiphfnworii.supabase.co",
  "restApiUrl": "{{baseUrl}}/rest/v1",
  "functionsUrl": "{{baseUrl}}/functions/v1",
  "authUrl": "{{baseUrl}}/auth/v1",
  "anonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U",
  "jwtToken": "{{GET_FROM_LOGIN}}",
  "testEmail": "test.agent@testsprite.test",
  "testPassword": "TestAgent123!"
}
```

---

## Summary

- **Total Endpoints:** 33
- **Ready to Test Now:** 24 endpoints (73%)
- **Requires API Keys:** 9 endpoints (27%)
- **Authentication:** JWT Bearer Token + API Key (dual auth)
- **Test Accounts:** 3 pre-configured accounts
- **External Dependencies:** 7 third-party APIs

**Start Testing:**
1. Copy table above into TestSprite
2. Set global headers (JWT + apikey)
3. Test REST APIs first (no setup needed)
4. Progressively add API keys for advanced features

---

**Last Updated:** February 5, 2026
