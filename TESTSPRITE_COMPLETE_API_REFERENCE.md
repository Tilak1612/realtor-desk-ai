# RealtorDesk AI - Complete API Reference for TestSprite

**Generated:** February 5, 2026  
**Backend Type:** Supabase (PostgreSQL REST API + Edge Functions)  
**Base URL:** `https://pseqajrtcgiphfnworii.supabase.co`

---

## Table of Contents
1. [Authentication Overview](#authentication-overview)
2. [REST API Endpoints](#rest-api-endpoints)
3. [Edge Functions (Serverless)](#edge-functions-serverless)
4. [External API Dependencies](#external-api-dependencies)
5. [Environment Variables](#environment-variables)
6. [TestSprite Configuration](#testsprite-configuration)

---

## Authentication Overview

### Authentication Type
**Dual Authentication Required:**
1. **JWT Bearer Token** - User session token
2. **API Key (anon key)** - Supabase project key

### Required Headers for ALL Requests
```http
Authorization: Bearer {JWT_TOKEN}
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U
Content-Type: application/json
```

### Getting JWT Token (For Testing)

**Method 1: Via Signup/Login**
1. Create test account at: `https://realtor-desk-ai.lovable.app/signup`
2. Login and open DevTools (F12)
3. Navigate to: Application → Local Storage → `sb-pseqajrtcgiphfnworii-auth-token`
4. Copy the `access_token` value
5. Token expires after 1 hour (refresh by re-logging in)

**Method 2: Via Auth API**
```bash
# Login
POST https://pseqajrtcgiphfnworii.supabase.co/auth/v1/token?grant_type=password
Content-Type: application/json
apikey: {ANON_KEY}

{
  "email": "test.agent@testsprite.test",
  "password": "TestAgent123!"
}
```

### Test Accounts
| Email | Password | Role | Subscription |
|-------|----------|------|--------------|
| test.agent@testsprite.test | TestAgent123! | Agent | Free Tier |
| test.teamadmin@testsprite.test | TestTeam123! | Team Admin | Team Tier |
| test.broker@testsprite.test | TestBroker123! | Broker | Brokerage |

**Note:** Auto-confirm is enabled - no email verification required.

---

## REST API Endpoints

Base URL: `https://pseqajrtcgiphfnworii.supabase.co/rest/v1`

### 1. Contacts API

#### 1.1 List All Contacts
- **Method:** `GET`
- **Endpoint:** `/rest/v1/contacts`
- **Auth:** Required (Bearer Token + API Key)
- **Description:** Retrieve all contacts for authenticated user
- **Query Parameters:**
  - `limit` (int, default: 10, max: 1000) - Number of records
  - `offset` (int, default: 0) - Pagination offset
  - `order` (string) - Sort order (e.g., `created_at.desc`)
  - `status` (enum) - Filter by: `lead`, `active`, `client`, `inactive`
  - `email` (string) - Filter by email (supports `~` for partial match)
  - `lead_score` (int) - Filter by score (supports `gte`, `lte`, `eq`)
- **Response:** Array of contact objects
- **Example:**
  ```bash
  GET /rest/v1/contacts?status=eq.lead&limit=20&order=created_at.desc
  ```

#### 1.2 Get Single Contact
- **Method:** `GET`
- **Endpoint:** `/rest/v1/contacts?id=eq.{uuid}`
- **Auth:** Required
- **Description:** Retrieve specific contact by ID
- **Response:** Array with single contact object

#### 1.3 Create Contact
- **Method:** `POST`
- **Endpoint:** `/rest/v1/contacts`
- **Auth:** Required
- **Description:** Create new contact
- **Required Fields:**
  - `first_name` (string)
  - `email` (string, valid email format)
- **Optional Fields:**
  - `last_name` (string)
  - `phone` (string)
  - `source` (string)
  - `status` (enum: `lead`, `active`, `client`, `inactive`)
  - `lead_score` (int, 0-100)
  - `tags` (array of strings)
  - `best_contact_time` (string)
  - `metadata` (JSON object)
- **Response:** 201 Created with contact object
- **Example Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+14165551234",
    "status": "lead",
    "source": "website",
    "tags": ["buyer", "first-time"]
  }
  ```

#### 1.4 Update Contact
- **Method:** `PATCH`
- **Endpoint:** `/rest/v1/contacts?id=eq.{uuid}`
- **Auth:** Required
- **Description:** Update existing contact
- **Body:** Any contact fields to update
- **Response:** 200 OK with updated contact
- **Example:**
  ```json
  {
    "status": "client",
    "lead_score": 85,
    "tags": ["buyer", "hot-lead"]
  }
  ```

#### 1.5 Delete Contact
- **Method:** `DELETE`
- **Endpoint:** `/rest/v1/contacts?id=eq.{uuid}`
- **Auth:** Required
- **Description:** Delete contact (soft delete via RLS policies)
- **Response:** 204 No Content

---

### 2. Deals API

#### 2.1 List All Deals
- **Method:** `GET`
- **Endpoint:** `/rest/v1/deals`
- **Auth:** Required
- **Description:** Retrieve all deals with contact relationships
- **Query Parameters:**
  - `limit`, `offset`, `order` (same as contacts)
  - `stage` (enum) - Filter by: `lead`, `qualified`, `meeting`, `proposal`, `negotiation`, `closed_won`, `closed_lost`
  - `status` (enum) - Filter by: `active`, `won`, `lost`
  - `value` (decimal) - Filter by deal value (supports `gte`, `lte`, `eq`)
- **Response:** Array of deal objects

#### 2.2 Get Single Deal
- **Method:** `GET`
- **Endpoint:** `/rest/v1/deals?id=eq.{uuid}`
- **Auth:** Required

#### 2.3 Create Deal
- **Method:** `POST`
- **Endpoint:** `/rest/v1/deals`
- **Auth:** Required
- **Required Fields:**
  - `title` (string)
  - `stage` (enum: `lead`, `qualified`, `meeting`, `proposal`, `negotiation`, `closed_won`, `closed_lost`)
- **Optional Fields:**
  - `contact_id` (uuid)
  - `value` (decimal)
  - `probability` (int, 0-100, default: 50)
  - `expected_close_date` (date: YYYY-MM-DD)
  - `status` (enum: `active`, `won`, `lost`, default: `active`)
  - `notes` (text)
- **Response:** 201 Created
- **Example Body:**
  ```json
  {
    "title": "123 Main St Listing",
    "stage": "qualified",
    "contact_id": "550e8400-e29b-41d4-a716-446655440000",
    "value": 450000.00,
    "probability": 75,
    "expected_close_date": "2026-03-15"
  }
  ```

#### 2.4 Update Deal
- **Method:** `PATCH`
- **Endpoint:** `/rest/v1/deals?id=eq.{uuid}`
- **Auth:** Required

#### 2.5 Delete Deal
- **Method:** `DELETE`
- **Endpoint:** `/rest/v1/deals?id=eq.{uuid}`
- **Auth:** Required

---

### 3. Tasks API

#### 3.1 List All Tasks
- **Method:** `GET`
- **Endpoint:** `/rest/v1/tasks`
- **Auth:** Required
- **Query Parameters:**
  - `status` (enum) - Filter by: `pending`, `in_progress`, `completed`, `cancelled`
  - `priority` (enum) - Filter by: `low`, `medium`, `high`, `urgent`
  - `contact_id` (uuid) - Filter by contact
  - `deal_id` (uuid) - Filter by deal

#### 3.2 Create Task
- **Method:** `POST`
- **Endpoint:** `/rest/v1/tasks`
- **Auth:** Required
- **Required Fields:**
  - `title` (string)
- **Optional Fields:**
  - `description` (text)
  - `contact_id` (uuid)
  - `deal_id` (uuid)
  - `due_date` (date: YYYY-MM-DD)
  - `due_time` (time: HH:MM:SS)
  - `priority` (enum: `low`, `medium`, `high`, `urgent`, default: `medium`)
  - `status` (enum: `pending`, `in_progress`, `completed`, `cancelled`, default: `pending`)
- **Example Body:**
  ```json
  {
    "title": "Follow up with John Doe",
    "description": "Send property listings for condos downtown",
    "contact_id": "550e8400-e29b-41d4-a716-446655440000",
    "due_date": "2026-02-10",
    "due_time": "14:00:00",
    "priority": "high"
  }
  ```

#### 3.3 Update Task
- **Method:** `PATCH`
- **Endpoint:** `/rest/v1/tasks?id=eq.{uuid}`
- **Auth:** Required

#### 3.4 Delete Task
- **Method:** `DELETE`
- **Endpoint:** `/rest/v1/tasks?id=eq.{uuid}`
- **Auth:** Required

---

### 4. Property Listings API

#### 4.1 List All Properties
- **Method:** `GET`
- **Endpoint:** `/rest/v1/property_listings`
- **Auth:** Required
- **Query Parameters:**
  - `property_type` (enum) - Filter by: `house`, `condo`, `apartment`, `townhouse`, `land`
  - `listing_type` (enum) - Filter by: `sale`, `rent`
  - `status` (enum) - Filter by: `active`, `pending`, `sold`, `inactive`
  - `price` (decimal) - Filter by price (supports `gte`, `lte`)
  - `city` (string) - Filter by city

#### 4.2 Create Property
- **Method:** `POST`
- **Endpoint:** `/rest/v1/property_listings`
- **Auth:** Required
- **Required Fields:**
  - `title` (string)
  - `address` (string)
- **Optional Fields:**
  - `description` (text)
  - `city` (string)
  - `province` (string)
  - `postal_code` (string)
  - `property_type` (enum)
  - `listing_type` (enum: `sale`, `rent`, default: `sale`)
  - `price` (decimal)
  - `bedrooms` (int)
  - `bathrooms` (decimal)
  - `square_feet` (int)
  - `lot_size` (decimal)
  - `year_built` (int)
  - `status` (enum, default: `active`)
  - `features` (array of strings)
- **Example Body:**
  ```json
  {
    "title": "Beautiful 3BR Condo in Downtown Toronto",
    "address": "123 King St W",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "M5H 1A1",
    "property_type": "condo",
    "listing_type": "sale",
    "price": 899000.00,
    "bedrooms": 3,
    "bathrooms": 2.5,
    "square_feet": 1450,
    "features": ["parking", "balcony", "ensuite-laundry"]
  }
  ```

#### 4.3 Update Property
- **Method:** `PATCH`
- **Endpoint:** `/rest/v1/property_listings?id=eq.{uuid}`
- **Auth:** Required

#### 4.4 Delete Property
- **Method:** `DELETE`
- **Endpoint:** `/rest/v1/property_listings?id=eq.{uuid}`
- **Auth:** Required

---

### 5. User Profiles API

#### 5.1 Get Current User Profile
- **Method:** `GET`
- **Endpoint:** `/rest/v1/profiles?id=eq.{user_id}`
- **Auth:** Required
- **Description:** Get profile data for authenticated user

#### 5.2 Update Profile
- **Method:** `PATCH`
- **Endpoint:** `/rest/v1/profiles?id=eq.{user_id}`
- **Auth:** Required
- **Fields:**
  - `full_name` (string)
  - `phone` (string)
  - `company` (string)
  - `avatar_url` (string)
  - `subscription_tier` (enum: `agent`, `team`, `brokerage`)

---

## Edge Functions (Serverless)

Base URL: `https://pseqajrtcgiphfnworii.supabase.co/functions/v1`

All edge functions use the same authentication headers as REST API.

### 1. AI & Chatbot Functions

#### 1.1 AI Chatbot
- **Method:** `POST`
- **Endpoint:** `/functions/v1/ai-chatbot`
- **Auth:** Required
- **Description:** General-purpose AI assistant for real estate queries
- **Request Body:**
  ```json
  {
    "messages": [
      {"role": "user", "content": "What should I do for first-time buyers?"}
    ],
    "contactId": "optional-uuid"
  }
  ```
- **Response:**
  ```json
  {
    "response": "AI-generated response text",
    "usage": { "tokens": 150 }
  }
  ```
- **External API:** Lovable AI Gateway (Claude via proxy)

#### 1.2 Claude Chat
- **Method:** `POST`
- **Endpoint:** `/functions/v1/claude-chat`
- **Auth:** Required
- **Description:** Direct Claude AI integration for advanced conversations
- **Request Body:**
  ```json
  {
    "message": "Help me write a listing description",
    "context": "3BR condo, downtown Toronto"
  }
  ```
- **Response:**
  ```json
  {
    "reply": "AI-generated text",
    "conversationId": "uuid"
  }
  ```
- **External API:** Lovable AI Gateway

#### 1.3 Generate Call Summary
- **Method:** `POST`
- **Endpoint:** `/functions/v1/generate-call-summary`
- **Auth:** Required
- **Description:** Analyze call notes and generate summary with suggested next actions
- **Request Body:**
  ```json
  {
    "notes": "Talked about condos in downtown area...",
    "contactName": "John Doe",
    "currentStage": "lead"
  }
  ```
- **Response:**
  ```json
  {
    "summary": ["Key point 1", "Key point 2"],
    "intent": "ready to see properties",
    "tone": "positive",
    "suggestedAction": "Send listing recommendations within 24 hours"
  }
  ```
- **External API:** OpenAI GPT-4

---

### 2. Lead Scoring Functions

#### 2.1 Calculate Lead Score
- **Method:** `POST`
- **Endpoint:** `/functions/v1/calculate-lead-score`
- **Auth:** Required
- **Description:** Calculate lead score using AI analysis
- **Request Body:**
  ```json
  {
    "contactId": "uuid"
  }
  ```
- **Response:**
  ```json
  {
    "score": 85,
    "factors": {
      "engagement": 90,
      "fit": 80,
      "intent": 85
    }
  }
  ```

#### 2.2 Lead Score Calculator
- **Method:** `POST`
- **Endpoint:** `/functions/v1/lead-score-calculator`
- **Auth:** Required
- **Description:** Alternative lead scoring algorithm
- **Request Body:**
  ```json
  {
    "contactId": "uuid"
  }
  ```

---

### 3. Payment & Subscription Functions

#### 3.1 Check Subscription
- **Method:** `GET`
- **Endpoint:** `/functions/v1/check-subscription`
- **Auth:** Required
- **Description:** Check if user has active Stripe subscription
- **Response:**
  ```json
  {
    "subscribed": true,
    "tier": "team",
    "status": "active",
    "currentPeriodEnd": "2026-03-05"
  }
  ```
- **External API:** Stripe

#### 3.2 Create Checkout
- **Method:** `POST`
- **Endpoint:** `/functions/v1/create-checkout`
- **Auth:** Required
- **Description:** Create Stripe checkout session for subscription
- **Request Body:**
  ```json
  {
    "priceId": "price_1234567890",
    "tier": "team"
  }
  ```
- **Response:**
  ```json
  {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_..."
  }
  ```
- **External API:** Stripe

#### 3.3 Customer Portal
- **Method:** `GET`
- **Endpoint:** `/functions/v1/customer-portal`
- **Auth:** Required
- **Description:** Generate Stripe customer portal URL for managing subscriptions
- **Response:**
  ```json
  {
    "portalUrl": "https://billing.stripe.com/p/session/..."
  }
  ```
- **External API:** Stripe

---

### 4. Email & Communication Functions

#### 4.1 Email Automation
- **Method:** `POST`
- **Endpoint:** `/functions/v1/email-automation`
- **Auth:** Required
- **Description:** Trigger automated email campaigns
- **Request Body:**
  ```json
  {
    "contactId": "uuid",
    "type": "welcome",
    "delay": 0
  }
  ```
- **Valid Types:** `welcome`, `nurture`, `follow_up`, `property_alert`
- **External API:** HubSpot (requires `HUBSPOT_API_KEY`)

#### 4.2 Send Welcome Email
- **Method:** `POST`
- **Endpoint:** `/functions/v1/send-welcome-email`
- **Auth:** Required
- **Description:** Send welcome email to new user
- **Request Body:**
  ```json
  {
    "userId": "uuid"
  }
  ```

#### 4.3 Send SMS
- **Method:** `POST`
- **Endpoint:** `/functions/v1/send-sms`
- **Auth:** Required
- **Description:** Send SMS message via Twilio
- **Request Body:**
  ```json
  {
    "to": "+14165551234",
    "message": "Your appointment is confirmed for tomorrow at 2pm",
    "contactId": "optional-uuid"
  }
  ```
- **External API:** Twilio (requires credentials)

#### 4.4 Send Phone Verification
- **Method:** `POST`
- **Endpoint:** `/functions/v1/send-phone-verification`
- **Auth:** Required
- **Description:** Send verification code via SMS
- **Request Body:**
  ```json
  {
    "phoneNumber": "+14165551234"
  }
  ```
- **External API:** Twilio

---

### 5. Integration Functions

#### 5.1 HubSpot Sync
- **Method:** `POST`
- **Endpoint:** `/functions/v1/hubspot-sync`
- **Auth:** NOT Required (public endpoint)
- **Description:** Sync contact data with HubSpot CRM
- **Request Body:**
  ```json
  {
    "contactId": "uuid",
    "action": "sync"
  }
  ```
- **External API:** HubSpot

#### 5.2 Encrypt Integration Token
- **Method:** `POST`
- **Endpoint:** `/functions/v1/encrypt-integration-token`
- **Auth:** Required
- **Description:** Securely encrypt third-party API tokens
- **Request Body:**
  ```json
  {
    "token": "api_key_to_encrypt",
    "provider": "hubspot"
  }
  ```
- **Response:**
  ```json
  {
    "encrypted": "encrypted_string",
    "keyId": "uuid"
  }
  ```

---

### 6. Web Scraping & Data Enrichment

#### 6.1 Apify Runner
- **Method:** `POST`
- **Endpoint:** `/functions/v1/apify-runner`
- **Auth:** Required
- **Description:** Run Apify actor to scrape MLS listings from realtor.ca
- **Request Body:**
  ```json
  {
    "url": "https://www.realtor.ca/real-estate/12345678/property",
    "actorId": "apify-actor-id"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "title": "Property title",
      "price": 899000,
      "address": "123 Main St",
      "bedrooms": 3,
      "bathrooms": 2
    }
  }
  ```
- **External API:** Apify

---

### 7. Automation Functions

#### 7.1 Run Automation
- **Method:** `POST`
- **Endpoint:** `/functions/v1/run-automation`
- **Auth:** Required
- **Description:** Execute custom automation workflows
- **Request Body:**
  ```json
  {
    "automationId": "uuid",
    "trigger": "manual",
    "context": {}
  }
  ```

---

## External API Dependencies

These are the third-party APIs that the backend calls:

### 1. Supabase Services
- **Base URL:** `https://pseqajrtcgiphfnworii.supabase.co`
- **Services Used:**
  - PostgreSQL Database (via REST API `/rest/v1`)
  - Authentication (`/auth/v1`)
  - Storage (`/storage/v1`)
  - Edge Functions (`/functions/v1`)
- **Auth:** JWT + anon key
- **Required Env Vars:**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key)
  - `SUPABASE_SERVICE_ROLE_KEY` (backend only)

### 2. Stripe Payment Processing
- **Base URL:** `https://api.stripe.com/v1`
- **Features Used:**
  - Customer management
  - Subscription checkout
  - Customer portal
  - Webhook events
- **Auth:** Secret key (Authorization header)
- **Required Env Vars:**
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY` (frontend)
  - `STRIPE_WEBHOOK_SECRET`
- **SDK:** `stripe@18.5.0`

### 3. AI Services

#### 3a. Lovable AI Gateway (Claude Proxy)
- **Base URL:** `https://ai.gateway.lovable.dev/v1`
- **Endpoints:**
  - `/chat/completions` - Chat completion
- **Auth:** Via Lovable infrastructure
- **Used In:** `ai-chatbot`, `claude-chat`
- **Model:** Claude 3 (Sonnet/Opus)

#### 3b. OpenAI API
- **Base URL:** `https://api.openai.com/v1`
- **Endpoints:**
  - `/chat/completions` - GPT-4 chat
- **Auth:** Bearer token
- **Required Env Vars:**
  - `OPENAI_API_KEY`
- **Used In:** `generate-call-summary`
- **Model:** `gpt-4-turbo-preview`

### 4. Twilio (SMS & Phone)
- **Base URL:** `https://api.twilio.com/2010-04-01`
- **Endpoints:**
  - `/Accounts/{AccountSid}/Messages.json` - Send SMS
- **Auth:** Basic Auth (Account SID + Auth Token)
- **Required Env Vars:**
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
- **Used In:** `send-sms`, `send-phone-verification`, `run-automation`
- **Status:** ⚠️ Code ready, needs credentials

### 5. HubSpot CRM
- **Base URL:** `https://api.hubapi.com`
- **Endpoints:**
  - `/marketing/v3/transactional/single-email/send` - Send email
  - `/crm/v3/objects/contacts` - Contact sync
- **Auth:** API Key (Authorization header)
- **Required Env Vars:**
  - `HUBSPOT_API_KEY`
- **Used In:** `email-automation`, `hubspot-sync`
- **Status:** ⚠️ Code ready, needs API key

### 6. Apify (Web Scraping)
- **Base URL:** `https://api.apify.com/v2`
- **Endpoints:**
  - `/acts/{actorId}/runs` - Run actor
  - `/actor-runs/{runId}` - Get results
- **Auth:** API Token (query param or header)
- **Required Env Vars:**
  - `APIFY_API_TOKEN`
- **Used In:** `apify-runner`
- **Status:** ⚠️ Code ready, needs subscription

---

## Environment Variables

### Required for Testing

#### Frontend (.env)
```bash
VITE_SUPABASE_PROJECT_ID="pseqajrtcgiphfnworii"
VITE_SUPABASE_URL="https://pseqajrtcgiphfnworii.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"
```

#### Backend (Supabase Secrets)
```bash
# Core APIs (Required for basic functionality)
SUPABASE_URL="https://pseqajrtcgiphfnworii.supabase.co"
SUPABASE_ANON_KEY="eyJ..." # Same as publishable key
SUPABASE_SERVICE_ROLE_KEY="eyJ..." # Admin key (secret)

# Payment Processing (Required for subscriptions)
STRIPE_SECRET_KEY="sk_live_..." # or sk_test_...
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI Services (Required for chatbot & summaries)
OPENAI_API_KEY="sk-..." # Required for call summaries

# Communication Services (Optional - not required for core functionality)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

# CRM Integration (Optional)
HUBSPOT_API_KEY="..."

# Web Scraping (Optional - for MLS scraping)
APIFY_API_TOKEN="..."
```

### Setting Secrets in Supabase
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref pseqajrtcgiphfnworii

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set TWILIO_ACCOUNT_SID=AC...
supabase secrets set TWILIO_AUTH_TOKEN=...
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
supabase secrets set HUBSPOT_API_KEY=...
supabase secrets set APIFY_API_TOKEN=...
```

---

## TestSprite Configuration

### API Endpoint Summary Table

Copy this into TestSprite:

| API Name | Endpoint | Method | Auth Type | Special Headers | Status |
|----------|----------|--------|-----------|-----------------|--------|
| **REST API - Contacts** |
| List Contacts | `/rest/v1/contacts` | GET | Bearer Token + API Key | None | ✅ Active |
| Get Contact | `/rest/v1/contacts?id=eq.{uuid}` | GET | Bearer Token + API Key | None | ✅ Active |
| Create Contact | `/rest/v1/contacts` | POST | Bearer Token + API Key | None | ✅ Active |
| Update Contact | `/rest/v1/contacts?id=eq.{uuid}` | PATCH | Bearer Token + API Key | None | ✅ Active |
| Delete Contact | `/rest/v1/contacts?id=eq.{uuid}` | DELETE | Bearer Token + API Key | None | ✅ Active |
| **REST API - Deals** |
| List Deals | `/rest/v1/deals` | GET | Bearer Token + API Key | None | ✅ Active |
| Create Deal | `/rest/v1/deals` | POST | Bearer Token + API Key | None | ✅ Active |
| Update Deal | `/rest/v1/deals?id=eq.{uuid}` | PATCH | Bearer Token + API Key | None | ✅ Active |
| Delete Deal | `/rest/v1/deals?id=eq.{uuid}` | DELETE | Bearer Token + API Key | None | ✅ Active |
| **REST API - Tasks** |
| List Tasks | `/rest/v1/tasks` | GET | Bearer Token + API Key | None | ✅ Active |
| Create Task | `/rest/v1/tasks` | POST | Bearer Token + API Key | None | ✅ Active |
| Update Task | `/rest/v1/tasks?id=eq.{uuid}` | PATCH | Bearer Token + API Key | None | ✅ Active |
| Delete Task | `/rest/v1/tasks?id=eq.{uuid}` | DELETE | Bearer Token + API Key | None | ✅ Active |
| **REST API - Properties** |
| List Properties | `/rest/v1/property_listings` | GET | Bearer Token + API Key | None | ✅ Active |
| Create Property | `/rest/v1/property_listings` | POST | Bearer Token + API Key | None | ✅ Active |
| Update Property | `/rest/v1/property_listings?id=eq.{uuid}` | PATCH | Bearer Token + API Key | None | ✅ Active |
| Delete Property | `/rest/v1/property_listings?id=eq.{uuid}` | DELETE | Bearer Token + API Key | None | ✅ Active |
| **Edge Functions - AI** |
| AI Chatbot | `/functions/v1/ai-chatbot` | POST | Bearer Token + API Key | None | ✅ Active |
| Claude Chat | `/functions/v1/claude-chat` | POST | Bearer Token + API Key | None | ✅ Active |
| Generate Call Summary | `/functions/v1/generate-call-summary` | POST | Bearer Token + API Key | Requires `OPENAI_API_KEY` | ⚠️ Needs API key |
| Calculate Lead Score | `/functions/v1/calculate-lead-score` | POST | Bearer Token + API Key | None | ✅ Active |
| Lead Score Calculator | `/functions/v1/lead-score-calculator` | POST | Bearer Token + API Key | None | ✅ Active |
| **Edge Functions - Payments** |
| Check Subscription | `/functions/v1/check-subscription` | GET | Bearer Token + API Key | Requires `STRIPE_SECRET_KEY` | ⚠️ Needs API key |
| Create Checkout | `/functions/v1/create-checkout` | POST | Bearer Token + API Key | Requires `STRIPE_SECRET_KEY` | ⚠️ Needs API key |
| Customer Portal | `/functions/v1/customer-portal` | GET | Bearer Token + API Key | Requires `STRIPE_SECRET_KEY` | ⚠️ Needs API key |
| **Edge Functions - Email/SMS** |
| Email Automation | `/functions/v1/email-automation` | POST | Bearer Token + API Key | Requires `HUBSPOT_API_KEY` | ⚠️ Optional |
| Send Welcome Email | `/functions/v1/send-welcome-email` | POST | Bearer Token + API Key | None | ✅ Active |
| Send SMS | `/functions/v1/send-sms` | POST | Bearer Token + API Key | Requires Twilio credentials | ⚠️ Optional |
| Send Phone Verification | `/functions/v1/send-phone-verification` | POST | Bearer Token + API Key | Requires Twilio credentials | ⚠️ Optional |
| **Edge Functions - Integrations** |
| HubSpot Sync | `/functions/v1/hubspot-sync` | POST | None (Public) | Requires `HUBSPOT_API_KEY` | ⚠️ Optional |
| Encrypt Token | `/functions/v1/encrypt-integration-token` | POST | Bearer Token + API Key | None | ✅ Active |
| Apify Runner | `/functions/v1/apify-runner` | POST | Bearer Token + API Key | Requires `APIFY_API_TOKEN` | ⚠️ Optional |
| Run Automation | `/functions/v1/run-automation` | POST | Bearer Token + API Key | May require Twilio | ✅ Active |

---

### Required Environment Variables for Full Testing

**✅ Available Now (No setup needed):**
- REST API (Contacts, Deals, Tasks, Properties)
- AI Chatbot (via Lovable gateway)
- Claude Chat (via Lovable gateway)
- Encryption functions
- Basic auth flows

**⚠️ Requires Configuration:**

| Service | Environment Variable(s) | Priority | Purpose |
|---------|-------------------------|----------|---------|
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | 🔴 HIGH | Subscription payments |
| OpenAI | `OPENAI_API_KEY` | 🟡 MEDIUM | Call summaries |
| Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | 🟢 LOW | SMS campaigns |
| HubSpot | `HUBSPOT_API_KEY` | 🟢 LOW | Email automation |
| Apify | `APIFY_API_TOKEN` | 🟢 LOW | MLS scraping |

---

### TestSprite Test Configuration

#### Global Headers (Apply to all requests)
```
Authorization: Bearer {JWT_TOKEN}
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U
Content-Type: application/json
```

#### Base URLs
- **REST API:** `https://pseqajrtcgiphfnworii.supabase.co/rest/v1`
- **Edge Functions:** `https://pseqajrtcgiphfnworii.supabase.co/functions/v1`
- **Auth API:** `https://pseqajrtcgiphfnworii.supabase.co/auth/v1`

#### Test Data Templates

**Create Contact:**
```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test.{{$timestamp}}@example.com",
  "phone": "+14165551234",
  "status": "lead",
  "source": "testsprite"
}
```

**Create Deal:**
```json
{
  "title": "Test Deal {{$timestamp}}",
  "stage": "qualified",
  "value": 500000.00,
  "probability": 75
}
```

**Create Task:**
```json
{
  "title": "Test Task {{$timestamp}}",
  "priority": "high",
  "due_date": "2026-02-15"
}
```

**AI Chatbot:**
```json
{
  "messages": [
    {"role": "user", "content": "What are the best neighborhoods in Toronto for first-time buyers?"}
  ]
}
```

---

### Expected Response Codes

| Operation | Success Code | Error Codes |
|-----------|--------------|-------------|
| GET (list) | 200 OK | 401 Unauthorized, 403 Forbidden |
| GET (single) | 200 OK | 401, 404 Not Found |
| POST (create) | 201 Created | 400 Bad Request, 401, 422 Unprocessable |
| PATCH (update) | 200 OK | 400, 401, 404 |
| DELETE | 204 No Content | 401, 404 |
| Edge Functions | 200 OK | 400, 401, 500 Internal Server Error |

---

### Row Level Security (RLS) Notes

All database tables have RLS policies that automatically:
- Scope all queries to the authenticated user's `user_id`
- Prevent users from reading/modifying other users' data
- Return empty results (not 403) if accessing unauthorized data

This means:
- You can only see your own contacts, deals, tasks, properties
- Test with separate accounts to verify isolation
- Use the test accounts provided above

---

## Quick Test Commands (cURL)

### Get JWT Token
```bash
curl -X POST \
  'https://pseqajrtcgiphfnworii.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test.agent@testsprite.test",
    "password": "TestAgent123!"
  }'
```

### List Contacts
```bash
curl -X GET \
  'https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts?limit=10' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U'
```

### Create Contact
```bash
curl -X POST \
  'https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U' \
  -H 'Content-Type: application/json' \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "status": "lead"
  }'
```

### AI Chatbot
```bash
curl -X POST \
  'https://pseqajrtcgiphfnworii.supabase.co/functions/v1/ai-chatbot' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U' \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [
      {"role": "user", "content": "What should I know about Toronto real estate?"}
    ]
  }'
```

---

## Summary

**Total Endpoints:** 35+
- **REST API:** 20 endpoints (4 resources × 5 CRUD operations)
- **Edge Functions:** 16 serverless functions
- **Authentication:** Dual (JWT Bearer Token + API Key)
- **External APIs:** 6 services (Stripe, OpenAI, Lovable AI, Twilio, HubSpot, Apify)

**Ready to Test Now:**
- ✅ All REST API endpoints (Contacts, Deals, Tasks, Properties)
- ✅ AI chatbot functions (via Lovable gateway)
- ✅ Basic edge functions (lead scoring, encryption)

**Requires API Keys:**
- ⚠️ Stripe functions (subscriptions, checkout)
- ⚠️ OpenAI (call summaries)
- ⚠️ Twilio (SMS)
- ⚠️ HubSpot (email automation)
- ⚠️ Apify (MLS scraping)

**Next Steps for TestSprite:**
1. Import this API collection
2. Configure global headers (JWT token + apikey)
3. Start with REST API tests (no additional setup needed)
4. Progressively add external API credentials for advanced features

---

**Document Version:** 1.0  
**Last Updated:** February 5, 2026  
**Maintained By:** Backend Engineering Team
