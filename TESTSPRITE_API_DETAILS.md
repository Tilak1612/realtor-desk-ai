# RealtorDesk AI - TestSprite API Testing Information

## API Name
**RealtorDesk AI Backend API**

## API Endpoint / URL
**Base URL:** `https://pseqajrtcgiphfnworii.supabase.co`

### Primary Endpoints:
- **REST API:** `https://pseqajrtcgiphfnworii.supabase.co/rest/v1`
- **Edge Functions:** `https://pseqajrtcgiphfnworii.supabase.co/functions/v1`
- **Auth API:** `https://pseqajrtcgiphfnworii.supabase.co/auth/v1`

## Authentication Type
**JWT Bearer Token + API Key (Dual Authentication)**

### Required Headers:
```
Authorization: Bearer {JWT_TOKEN}
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U
Content-Type: application/json
```

### Getting JWT Token:
1. Sign up at: `https://realtor-desk-ai.lovable.app/signup`
2. Login and open browser DevTools (F12)
3. Go to: Application > Local Storage > `sb-pseqajrtcgiphfnworii-auth-token`
4. Copy the `access_token` value
5. Token expires after 1 hour

### Test Account Credentials:
- **Email:** `test.agent@testsprite.test`
- **Password:** `TestAgent123!`
- **Note:** Auto-confirm is enabled - no email verification needed

---

## Extra Testing Information

### 📋 Core API Resources

#### 1. Contacts API (`/rest/v1/contacts`)
**CRUD Operations:**
- `GET /contacts` - List all contacts (supports filtering, sorting, pagination)
- `POST /contacts` - Create new contact
- `PATCH /contacts?id=eq.{uuid}` - Update contact
- `DELETE /contacts?id=eq.{uuid}` - Delete contact

**Required Fields:**
- `first_name` (string)
- `last_name` (string)
- `email` (string, validated format)

**Optional Fields:**
- `phone`, `status`, `source`, `lead_score`, `tags[]`, `metadata`

**Row Level Security:** All operations scoped to authenticated user's `user_id`

---

#### 2. Deals API (`/rest/v1/deals`)
**CRUD Operations:**
- `GET /deals` - List all deals with contact relationships
- `POST /deals` - Create new deal
- `PATCH /deals?id=eq.{uuid}` - Update deal stage/status
- `DELETE /deals?id=eq.{uuid}` - Delete deal

**Deal Stages:**
- `lead`, `qualified`, `meeting`, `proposal`, `negotiation`, `closed_won`, `closed_lost`

**Required Fields:**
- `title` (string)
- `stage` (enum)

**Optional Fields:**
- `contact_id`, `value`, `probability`, `expected_close_date`, `notes`

---

#### 3. Tasks API (`/rest/v1/tasks`)
**CRUD Operations:**
- `GET /tasks` - List all tasks
- `POST /tasks` - Create new task
- `PATCH /tasks?id=eq.{uuid}` - Update/complete task
- `DELETE /tasks?id=eq.{uuid}` - Delete task

**Task Priorities:** `low`, `medium`, `high`
**Task Statuses:** `pending`, `completed`, `cancelled`

**Required Fields:**
- `title` (string)

**Optional Fields:**
- `description`, `contact_id`, `deal_id`, `due_date`, `due_time`, `priority`

---

#### 4. Property Listings API (`/rest/v1/property_listings`)
**CRUD Operations:**
- `GET /property_listings` - List properties
- `POST /property_listings` - Create property listing
- `PATCH /property_listings?id=eq.{uuid}` - Update property
- `DELETE /property_listings?id=eq.{uuid}` - Delete property

**Required Fields:**
- `title`, `address`

**Optional Fields:**
- `city`, `province`, `postal_code`, `price`, `bedrooms`, `bathrooms`, `square_feet`, `property_type`, `listing_type`, `features[]`

---

### 🔌 Edge Functions (Serverless)

#### 1. `/functions/v1/check-subscription`
**Purpose:** Check user subscription status
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{}`
**Response:** `{"subscribed": boolean, "tier": string}`

---

#### 2. `/functions/v1/lead-score-calculator`
**Purpose:** Calculate AI-powered lead score
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{"contactId": "uuid"}`
**Response:** `{"score": number, "factors": {}, "confidence": number}`

---

#### 3. `/functions/v1/ai-chatbot`
**Purpose:** AI assistant chatbot responses
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{"message": "string", "context": "string"}`
**Response:** `{"response": "string"}`

---

#### 4. `/functions/v1/claude-chat`
**Purpose:** Claude AI chat interface
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{"message": "string"}`
**Response:** `{"response": "string"}`

---

#### 5. `/functions/v1/email-automation`
**Purpose:** Trigger automated email workflows via HubSpot
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{"contactId": "uuid", "type": "follow_up"}`
**Response:** `{"success": boolean, "messageId": "string"}`

---

#### 6. `/functions/v1/hubspot-sync`
**Purpose:** Sync contacts with HubSpot CRM
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{"contactId": "uuid", "action": "sync"}`
**Response:** `{"success": boolean, "hubspotId": "string"}`

---

#### 7. `/functions/v1/create-checkout`
**Purpose:** Create Stripe checkout session for subscriptions
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{"priceId": "string", "tier": "agent|team|brokerage"}`
**Response:** `{"sessionId": "string", "url": "string"}`

---

#### 8. `/functions/v1/customer-portal`
**Purpose:** Generate Stripe customer portal URL
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{}`
**Response:** `{"url": "string"}`

---

#### 9. `/functions/v1/send-welcome-email`
**Purpose:** Send welcome email to new users
**Method:** POST
**Auth:** Required (JWT)
**Payload:** `{"userId": "uuid"}`
**Response:** `{"success": boolean}`

---

### 🔍 Query Operators (PostgREST)

**Filtering:**
- `?status=eq.lead` - Equals
- `?value=gte.100000` - Greater than or equal
- `?email~gmail.com` - Contains substring
- `?tags=cs.{buyer}` - Contains in array

**Sorting:**
- `?order=created_at.desc` - Sort by date descending
- `?order=value.desc,created_at.asc` - Multi-column sort

**Pagination:**
- `?limit=20&offset=0` - Paginate results

**Relationships:**
- `?select=*,contacts(*)` - Include related contacts

---

### ⚠️ Important Testing Notes

#### Authentication
- JWT tokens expire after **1 hour** - refresh before testing
- All endpoints require both `Authorization` header AND `apikey` header
- Row Level Security (RLS) ensures users only see their own data
- Auto-confirm is enabled - no email verification needed for test accounts

#### Database Triggers
- `user_id` is automatically set from JWT token - DO NOT include in POST requests
- `created_at` and `updated_at` are automatically managed
- Email format validation enforced server-side
- Duplicate email detection per user

#### Rate Limits
- REST API: 100 requests/minute
- Edge Functions: 60 requests/minute
- Returns 429 status code when exceeded

#### Error Responses
- **400:** Bad Request (validation errors)
- **401:** Unauthorized (invalid/expired JWT)
- **404:** Not Found
- **409:** Conflict (duplicate data)
- **500:** Internal Server Error

#### CORS
- All endpoints support CORS
- Preflight requests handled automatically

---

### 🎯 Recommended Test Scenarios

#### Critical Path Tests
1. **User Registration & Authentication**
   - Sign up new user
   - Login and retrieve JWT token
   - Access protected endpoints

2. **Contact Management**
   - Create contact (POST)
   - List contacts (GET)
   - Update contact status (PATCH)
   - Delete contact (DELETE)

3. **Deal Pipeline**
   - Create deal linked to contact
   - Update deal stage (drag-and-drop simulation)
   - Mark deal as won/lost
   - View deal statistics

4. **Task Management**
   - Create task with due date
   - Complete task
   - Filter tasks by priority
   - Bulk delete tasks

5. **AI Features**
   - Calculate lead score for contact
   - Chat with AI assistant
   - Get property recommendations

6. **Integrations**
   - Sync contact to HubSpot
   - Send automated email
   - Create Stripe checkout session

---

### 📊 Expected Performance Metrics

- **REST API Response Time:** < 200ms (p95)
- **Edge Function Response:** < 500ms (p95)
- **AI Functions Response:** < 3 seconds
- **Database Queries:** < 100ms
- **Authentication:** < 150ms

---

### 🔗 Additional Resources

**Frontend URLs:**
- Production: `https://realtor-desk-ai.lovable.app`
- Preview: `https://9b94f14f-9eff-4f86-a849-5078de07f6bc.lovableproject.com`

**Documentation:**
- Full API Docs: See `API_DOCUMENTATION.md`
- Backend Test Report: See `BACKEND_TEST_REPORT.md`
- Quick Test Guide: See `QUICK_TEST_GUIDE.md`

**Support:**
- Technical issues: Check Supabase logs
- Error monitoring: Built-in error tracking
- Real-time updates: WebSocket connections available

---

### ✅ Verification Checklist

- [ ] JWT token obtained and valid
- [ ] All required headers included
- [ ] Test accounts created
- [ ] CRUD operations tested for all resources
- [ ] Edge functions responding correctly
- [ ] Error handling validated
- [ ] Rate limits respected
- [ ] RLS policies verified (users see only their data)
- [ ] Database triggers working (auto user_id injection)
- [ ] Integrations tested (HubSpot, Stripe)

---

**Last Updated:** November 26, 2025  
**API Version:** 1.0.0  
**Status:** ✅ Production Ready
