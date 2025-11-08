# TestSprite End-to-End Testing Documentation
## Realtor Desk AI - Complete Testing Guide

---

## 🌐 URLs

### Frontend URLs
- **Production:** `https://realtor-desk-ai.lovable.app`
- **Preview/Staging:** `https://9b94f14f-9eff-4f86-a849-5078de07f6bc.lovableproject.com`

### Backend API Base URL
- **Supabase Functions:** `https://pseqajrtcgiphfnworii.supabase.co/functions/v1/`

### Edge Functions Endpoints
All endpoints require the base URL + function name:

1. `/check-subscription` - Check user subscription status
2. `/create-checkout` - Create Stripe checkout session
3. `/customer-portal` - Access Stripe customer portal
4. `/email-automation` - Send automated emails via HubSpot
5. `/ai-chatbot` - AI assistant interactions
6. `/claude-chat` - Claude AI chat functionality
7. `/calculate-lead-score` - Calculate lead scoring
8. `/lead-score-calculator` - Alternative lead scoring
9. `/hubspot-sync` - Sync data with HubSpot
10. `/encrypt-integration-token` - Encrypt third-party tokens
11. `/send-welcome-email` - Send welcome emails

---

## ✅ Backend Setup Status (Updated 2025-11-08)

**COMPLETED IMPLEMENTATIONS:**
1. ✅ **Property Listings Table** - Full CRUD operations enabled with RLS policies
2. ✅ **Auto-Confirm Email** - Email verification disabled for faster testing
3. ✅ **Contact Fields** - Added `status` and `lead_score` for API compatibility
4. ✅ **Public Lead Submission** - Contact forms work without authentication
5. ✅ **All Core Tables** - contacts, deals, tasks, property_listings, profiles configured

**AUTHENTICATION STATUS:**
- ✅ Email/password signup and login fully functional
- ✅ OAuth (Google, Microsoft) configured
- ✅ Auto-confirm enabled - NO email verification required
- ✅ Session management and redirects working

**API ENDPOINTS:**
- ✅ Supabase REST API for all CRUD operations
- ✅ Edge functions for email automation, lead scoring, subscription checks
- ✅ HubSpot integration for email campaigns

**TESTING NOTES:**
- Test users must be registered via `/signup` endpoint
- Auto-confirm is enabled, so registration completes immediately
- All authenticated endpoints require valid JWT token + anon key

---

## 🔐 Test Authentication Credentials

### Create Test Users
**IMPORTANT:** Do NOT use production credentials. Create dedicated test accounts:

#### Test Account Setup
1. Go to `/signup`
2. Create test users with these profiles:

**Test User 1 - Free Tier Agent:**
- Email: `test.agent@testsprite.test`
- Password: `TestAgent123!`
- Full Name: `Test Agent`
- Phone: `555-0101`
- Company: `Test Realty`
- Subscription: Free (Agent tier)

**Test User 2 - Team Admin:**
- Email: `test.teamadmin@testsprite.test`
- Password: `TestTeam123!`
- Full Name: `Test Team Admin`
- Phone: `555-0102`
- Company: `Test Team Realty`
- Subscription: Team tier

**Test User 3 - Brokerage Owner:**
- Email: `test.broker@testsprite.test`
- Password: `TestBroker123!`
- Full Name: `Test Broker`
- Phone: `555-0103`
- Company: `Test Brokerage`
- Subscription: Brokerage tier

### Authentication Headers
For API testing, include these headers:
```
Authorization: Bearer {JWT_TOKEN}
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U
Content-Type: application/json
```

---

## 🗺️ Key User Journeys & Workflows

### Journey 1: New User Registration & Onboarding
**Path:** `/` → `/signup` → `/onboarding` → `/dashboard`

**Steps:**
1. **Landing Page** (`/`)
   - View hero section
   - Click "Start Free Trial" or "Book Demo"
   
2. **Sign Up** (`/signup`)
   - Enter email, password, full name, phone, company
   - Submit form
   - Verify email confirmation
   
3. **Onboarding** (`/onboarding`)
   - Step 1: Profile Setup (business info)
   - Step 2: Business Goals (target GCI, deals, property types)
   - Step 3: Import Contacts (optional)
   - Step 4: Calendar Integration (optional)
   - Step 5: Chatbot Setup (optional)
   - Step 6: Onboarding Complete
   
4. **Dashboard** (`/dashboard`)
   - View welcome message
   - See stats cards (contacts, deals, tasks)
   - Access widgets (hot leads, tasks, deals, market data)

**Expected Outcomes:**
- User account created
- Profile completed
- Redirected to dashboard
- Welcome email sent (via HubSpot)

---

### Journey 2: Contact Management
**Path:** `/dashboard` → `/contacts` → `/contacts/:id`

**Steps:**
1. **View Contacts** (`/contacts`)
   - List view or card view toggle
   - Search contacts
   - Filter by status, lead score, tags
   - Sort by various fields
   
2. **Add New Contact**
   - Click "Add Contact" button
   - Fill form: name, email, phone, status, source, lead score
   - Add tags (optional)
   - Add notes (optional)
   - Submit
   
3. **Import Contacts**
   - Click "Import" button
   - Upload CSV file
   - Map fields
   - Confirm import
   
4. **View Contact Detail** (`/contacts/:id`)
   - View contact card with photo
   - See engagement stats
   - View activity timeline
   - Check AI insights
   - View property interests
   - Access documents tab
   - View notes tab
   - Check deal history
   - See similar contacts
   - Log new activity
   - Edit contact information

**Expected Outcomes:**
- Contacts created/imported successfully
- Lead scores calculated automatically
- Activities logged
- AI insights generated

---

### Journey 3: Deal Pipeline Management
**Path:** `/dashboard` → `/deals`

**Steps:**
1. **View Deals** (`/deals`)
   - Toggle between Kanban and List view
   - View deal stats (total value, count by stage)
   
2. **Create New Deal**
   - Click "Add Deal" button
   - Enter deal name, value, stage
   - Select associated contact
   - Set expected close date
   - Add notes
   - Submit
   
3. **Manage Deal in Kanban**
   - Drag and drop between stages:
     - Lead
     - Qualified
     - Meeting
     - Proposal
     - Negotiation
     - Closed Won
     - Closed Lost
   - Click deal card to view details
   
4. **Deal Detail Sidebar**
   - View deal information
   - Edit deal details
   - Change stage
   - Mark as won/lost (with reason)
   - View activities
   - Add notes

**Expected Outcomes:**
- Deals created and tracked
- Pipeline stages updated
- Deal values calculated
- Notifications sent for stage changes

---

### Journey 4: Task Management
**Path:** `/dashboard` → `/tasks`

**Steps:**
1. **View Tasks** (`/tasks`)
   - Toggle between List and Calendar view
   - View task stats (due today, overdue, completed, due this week)
   
2. **Filter & Search Tasks**
   - Use quick filters (Today, Overdue, Completed, This Week, All)
   - Filter by priority (Low, Medium, High)
   - Filter by type (Call, Email, Meeting, Follow-up, Showing, Other)
   - Search by title
   
3. **Create New Task**
   - Click "Add Task" button
   - Enter title, description
   - Select type and priority
   - Set due date
   - Link to contact/deal (optional)
   - Submit
   
4. **Manage Tasks**
   - Mark tasks as complete
   - Edit task details
   - Delete tasks
   - Bulk actions (select multiple, mark complete, delete)
   - View tasks in calendar view

**Expected Outcomes:**
- Tasks created and organized
- Due date reminders
- Task completion tracking
- Calendar integration

---

### Journey 5: AI Assistant Interaction
**Path:** `/dashboard` → `/ai-assistant`

**Steps:**
1. **Access AI Assistant** (`/ai-assistant`)
   - View AI chat interface
   
2. **Interact with AI**
   - Ask questions about contacts
   - Request lead insights
   - Get task suggestions
   - Ask for market data
   - Request email drafts
   
3. **AI Chat Widget** (Available on all pages)
   - Click chat widget (bottom right)
   - Type question
   - Receive AI response
   - Continue conversation

**Expected Outcomes:**
- AI responses within 2-3 seconds
- Relevant insights provided
- Context-aware suggestions
- Conversation history maintained

---

### Journey 6: Integrations Setup
**Path:** `/dashboard` → `/integrations`

**Steps:**
1. **View Integrations** (`/integrations`)
   - See available integrations (HubSpot, Google Calendar, Stripe)
   
2. **Connect HubSpot**
   - Click "Connect" button
   - Enter HubSpot API key
   - Test connection
   - Enable sync options (contacts, deals)
   - Save settings
   
3. **Connect Google Calendar**
   - Click "Connect" button
   - Authorize Google OAuth
   - Select calendars to sync
   - Set sync preferences
   - Save settings
   
4. **Connect Stripe** (Admin only)
   - Enter Stripe API keys
   - Configure webhook
   - Test connection
   - Save settings

**Expected Outcomes:**
- Integrations connected successfully
- Data syncing in background
- Real-time updates
- Error handling for failed connections

---

### Journey 7: Billing & Subscription Management
**Path:** `/dashboard` → `/billing`

**Steps:**
1. **View Billing** (`/billing`)
   - See current plan details
   - View usage statistics
   - Check subscription status
   
2. **Upgrade Subscription**
   - Click "Upgrade" button
   - Select new plan (Team or Brokerage)
   - Enter payment details (Stripe)
   - Confirm upgrade
   - Redirect to success page
   
3. **Manage Subscription**
   - Update payment method
   - View billing history
   - Download invoices
   - Cancel subscription (with confirmation)

**Expected Outcomes:**
- Subscription upgraded successfully
- Payment processed via Stripe
- Invoice generated
- Access level updated immediately

---

### Journey 8: Settings & Profile Management
**Path:** `/dashboard` → `/settings`

**Steps:**
1. **View Settings** (`/settings`)
   - Navigate through tabs:
     - Profile
     - Security
     - Notifications
     - Preferences
     - Integrations
   
2. **Update Profile**
   - Edit personal information
   - Upload profile photo
   - Update company details
   - Change phone number
   - Save changes
   
3. **Security Settings**
   - Change password
   - Enable 2FA (if available)
   - View login history
   - Manage sessions
   
4. **Notification Preferences**
   - Toggle email notifications
   - Toggle push notifications
   - Set notification frequency
   - Select notification types

**Expected Outcomes:**
- Profile updated successfully
- Settings saved
- Preferences applied immediately
- Confirmation messages displayed

---

## 📚 API Documentation

### Authentication API

#### Sign Up
```http
POST https://pseqajrtcgiphfnworii.supabase.co/auth/v1/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "options": {
    "data": {
      "full_name": "Test User",
      "phone": "555-0100",
      "company_name": "Test Company",
      "subscription_tier": "agent"
    }
  }
}
```

#### Sign In
```http
POST https://pseqajrtcgiphfnworii.supabase.co/auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

#### Sign Out
```http
POST https://pseqajrtcgiphfnworii.supabase.co/auth/v1/logout
Authorization: Bearer {JWT_TOKEN}
```

---

### Contacts API (Supabase REST)

#### Get All Contacts
```http
GET https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts?select=*
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
```

#### Create Contact
```http
POST https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "555-0100",
  "status": "lead",
  "source": "website",
  "lead_score": 75
}
```

**Note:** `user_id` is automatically set to `auth.uid()` via database trigger. Email format is validated server-side.

#### Update Contact
```http
PATCH https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts?id=eq.{CONTACT_ID}
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "status": "client",
  "lead_score": 90
}
```

#### Delete Contact
```http
DELETE https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts?id=eq.{CONTACT_ID}
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
```

---

### Deals API

#### Get All Deals
```http
GET https://pseqajrtcgiphfnworii.supabase.co/rest/v1/deals?select=*,contacts(*)
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
```

#### Create Deal
```http
POST https://pseqajrtcgiphfnworii.supabase.co/rest/v1/deals
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "title": "123 Main St Sale",
  "value": 450000,
  "stage": "qualified",
  "probability": 75,
  "contact_id": "{CONTACT_ID}",
  "expected_close_date": "2025-12-31",
  "notes": "Hot lead, ready to buy"
}
```

**Note:** Field is `title` (not `name`). `user_id` is automatically set via database trigger.

#### Update Deal Stage
```http
PATCH https://pseqajrtcgiphfnworii.supabase.co/rest/v1/deals?id=eq.{DEAL_ID}
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "stage": "negotiation"
}
```

---

### Tasks API

#### Get All Tasks
```http
GET https://pseqajrtcgiphfnworii.supabase.co/rest/v1/tasks?select=*
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
```

#### Create Task
```http
POST https://pseqajrtcgiphfnworii.supabase.co/rest/v1/tasks
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "title": "Call John Doe",
  "description": "Follow up on property viewing",
  "priority": "high",
  "status": "pending",
  "due_date": "2025-11-10",
  "due_time": "10:00:00",
  "contact_id": "{CONTACT_ID}"
}
```

**Note:** Use `status` field (not `completed` boolean). `user_id` is automatically set via database trigger.

#### Mark Task Complete
```http
PATCH https://pseqajrtcgiphfnworii.supabase.co/rest/v1/tasks?id=eq.{TASK_ID}
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "status": "completed",
  "completed_at": "2025-11-09T15:30:00Z"
}
```

---

### Edge Functions

#### Check Subscription Status
```http
POST https://pseqajrtcgiphfnworii.supabase.co/functions/v1/check-subscription
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{}
```

**Response:**
```json
{
  "subscribed": true,
  "productId": "prod_abc123",
  "priceId": "price_xyz789",
  "currentPeriodEnd": "2025-12-31T23:59:59Z"
}
```

#### Calculate Lead Score
```http
POST https://pseqajrtcgiphfnworii.supabase.co/functions/v1/calculate-lead-score
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "contactId": "{CONTACT_ID}"
}
```

**Response:**
```json
{
  "score": 85,
  "factors": {
    "engagement": 30,
    "budget": 25,
    "timeline": 20,
    "interest": 10
  }
}
```

#### Send Email via HubSpot
```http
POST https://pseqajrtcgiphfnworii.supabase.co/functions/v1/email-automation
Authorization: Bearer {JWT_TOKEN}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "contactId": "{CONTACT_ID}",
  "type": "welcome",
  "delay": 0
}
```

**Response:**
```json
{
  "success": true,
  "action": "sent",
  "emailId": "msg_abc123"
}
```

---

## 🧪 Test Scenarios

### Critical Path Tests

1. **User Registration Flow**
   - ✅ Valid registration
   - ❌ Duplicate email
   - ❌ Invalid email format
   - ❌ Weak password
   - ❌ Missing required fields

2. **Authentication Flow**
   - ✅ Valid login
   - ❌ Invalid credentials
   - ❌ Locked account
   - ✅ Password reset
   - ✅ Session persistence

3. **Contact CRUD Operations**
   - ✅ Create contact with all fields
   - ✅ Create contact with minimum fields
   - ✅ Update contact
   - ✅ Delete contact
   - ✅ Import contacts from CSV
   - ❌ Invalid data validation

4. **Deal Pipeline Management**
   - ✅ Create deal
   - ✅ Move deal between stages
   - ✅ Update deal value
   - ✅ Close deal (won/lost)
   - ✅ Link deal to contact

5. **Task Management**
   - ✅ Create task
   - ✅ Mark task complete
   - ✅ Edit task
   - ✅ Delete task
   - ✅ Filter tasks by status
   - ✅ Bulk operations

6. **AI Assistant**
   - ✅ Send message
   - ✅ Receive response
   - ✅ Context awareness
   - ❌ Rate limiting (429 error)
   - ❌ No credits (402 error)

7. **Integrations**
   - ✅ Connect HubSpot
   - ✅ Sync contacts
   - ✅ Disconnect integration
   - ❌ Invalid API key

8. **Billing & Subscriptions**
   - ✅ View current plan
   - ✅ Upgrade subscription
   - ✅ Downgrade subscription
   - ✅ Cancel subscription
   - ✅ Update payment method

---

## 🔧 Technical Specifications

### Technology Stack
- **Frontend:** React 18, TypeScript, Vite
- **UI Framework:** Tailwind CSS, shadcn/ui
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router v6
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Authentication:** Supabase Auth (JWT)
- **Payments:** Stripe
- **Email:** HubSpot API
- **AI:** Lovable AI (Gemini/GPT models)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Responsive design (320px - 2560px)

### Performance Targets
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Largest Contentful Paint (LCP): < 2.5s

---

## 📊 Test Data Recommendations

### Contacts
Create at least 20 test contacts with varied:
- Lead scores (0-100)
- Statuses (lead, prospect, client, past_client)
- Sources (website, referral, social, advertising)
- Tags (hot_lead, first_time_buyer, investor, etc.)

### Deals
Create 10-15 deals across all stages:
- 2-3 in "lead"
- 2-3 in "qualified"
- 2-3 in "meeting"
- 2 in "proposal"
- 2 in "negotiation"
- 1-2 in "closed_won"
- 1-2 in "closed_lost"

### Tasks
Create 30-40 tasks with:
- Various due dates (past, today, this week, next week, next month)
- Different priorities (low, medium, high)
- Different types (call, email, meeting, follow-up, showing)
- Mix of completed and incomplete

---

## 🚨 Known Issues & Edge Cases

1. **Email Verification:**
   - Auto-confirm is enabled for testing
   - Production requires email verification

2. **Rate Limiting:**
   - AI endpoints may return 429 if too many requests
   - Implement retry logic with exponential backoff

3. **Session Management:**
   - Sessions expire after 1 hour of inactivity
   - Refresh token automatically handled

4. **File Uploads:**
   - Max file size: 10MB
   - Supported formats: PDF, DOCX, XLSX, PNG, JPG

5. **Timezone Handling:**
   - All dates stored in UTC
   - Display in user's local timezone

---

## 📞 Support & Contact

For testing support or questions:
- **Developer:** Contact via project repository
- **Documentation:** This file + inline code comments
- **API Status:** Check Supabase dashboard for edge function logs

---

## ✅ Test Checklist Summary

### Pre-Testing Setup
- [ ] Create test user accounts (3 minimum)
- [ ] Set up test data (contacts, deals, tasks)
- [ ] Verify all URLs are accessible
- [ ] Confirm authentication headers

### Core Functionality
- [ ] User registration & login
- [ ] Complete onboarding flow
- [ ] Contact management (CRUD)
- [ ] Deal pipeline operations
- [ ] Task management
- [ ] AI assistant interaction
- [ ] Integration setup

### Edge Cases
- [ ] Invalid input handling
- [ ] Network error scenarios
- [ ] Rate limiting responses
- [ ] Session expiration
- [ ] Concurrent user operations

### Performance
- [ ] Page load times
- [ ] API response times
- [ ] Real-time updates
- [ ] Large dataset handling

### Security
- [ ] Authentication required on protected routes
- [ ] Unauthorized access blocked
- [ ] CORS properly configured
- [ ] SQL injection prevention

---

**Last Updated:** 2025-11-08
**Version:** 1.0.0
