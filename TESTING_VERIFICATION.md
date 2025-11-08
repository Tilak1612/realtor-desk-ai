# Testing Verification Checklist
## RealtorDesk AI - Complete System Verification

---

## ✅ Pre-Test Setup Checklist

### 1. Database Configuration
- [x] All tables created with proper schema
- [x] RLS policies configured on all tables
- [x] Indexes created for performance
- [x] Triggers configured for timestamps
- [x] Foreign keys properly set up
- [x] user_id nullable for public submissions

### 2. Authentication Setup
- [x] Email/password authentication enabled
- [x] OAuth (Google, Microsoft) configured
- [x] Auto-confirm email enabled
- [x] Profile auto-creation trigger active
- [x] Session management working
- [x] Password reset flow configured

### 3. Edge Functions
- [x] All 11 edge functions deployed
- [x] CORS headers configured
- [x] JWT authentication where required
- [x] Public endpoints configured
- [x] Error handling implemented
- [x] Logging added for debugging

### 4. Frontend Configuration
- [x] Supabase client initialized
- [x] Environment variables configured
- [x] Error monitoring setup
- [x] Toast notifications working
- [x] Form validation implemented
- [x] Loading states added

---

## 🧪 Critical Path Testing

### Test Suite 1: Authentication Flow

#### 1.1 User Registration
**Endpoint:** POST `/auth/v1/signup`

**Test Case 1: Valid Registration**
```json
{
  "email": "test.agent@testsprite.test",
  "password": "TestAgent123!",
  "options": {
    "data": {
      "full_name": "Test Agent",
      "phone": "555-0101",
      "company_name": "Test Realty"
    }
  }
}
```
- [ ] Returns 200 status
- [ ] User created in auth.users
- [ ] Profile created in profiles table
- [ ] No email verification required (auto-confirm)
- [ ] Can immediately login

**Test Case 2: Duplicate Email**
```json
{
  "email": "test.agent@testsprite.test",
  "password": "TestAgent123!"
}
```
- [ ] Returns 400 status
- [ ] Error message indicates email already registered

**Test Case 3: Invalid Email**
```json
{
  "email": "invalid-email",
  "password": "TestAgent123!"
}
```
- [ ] Returns 400 status
- [ ] Error message indicates invalid email format

**Test Case 4: Weak Password**
```json
{
  "email": "test@example.com",
  "password": "weak"
}
```
- [ ] Returns 400 status
- [ ] Error message indicates password requirements

#### 1.2 User Login
**Endpoint:** POST `/auth/v1/token?grant_type=password`

**Test Case 1: Valid Credentials**
```json
{
  "email": "test.agent@testsprite.test",
  "password": "TestAgent123!"
}
```
- [ ] Returns 200 status
- [ ] Returns JWT access_token
- [ ] Returns refresh_token
- [ ] Returns user object
- [ ] Session created

**Test Case 2: Invalid Password**
```json
{
  "email": "test.agent@testsprite.test",
  "password": "WrongPassword123!"
}
```
- [ ] Returns 400/401 status
- [ ] Error message indicates invalid credentials

**Test Case 3: Non-existent User**
```json
{
  "email": "nonexistent@example.com",
  "password": "TestAgent123!"
}
```
- [ ] Returns 400/401 status
- [ ] Error message indicates invalid credentials

---

### Test Suite 2: Contact Management

#### 2.1 Create Contact (Authenticated)
**Endpoint:** POST `/rest/v1/contacts`
**Headers:** Authorization: Bearer {JWT}, apikey: {ANON_KEY}

**Test Case 1: Valid Contact**
```json
{
  "user_id": "{USER_ID}",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "555-0100",
  "status": "lead",
  "source": "website",
  "lead_score": 75
}
```
- [ ] Returns 201 status
- [ ] Contact created with correct data
- [ ] user_id matches authenticated user
- [ ] Can retrieve contact immediately

**Test Case 2: Missing user_id**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com"
}
```
- [ ] Returns 400/403 status (if authenticated)
- [ ] Error indicates RLS policy violation

**Test Case 3: Wrong user_id**
```json
{
  "user_id": "00000000-0000-0000-0000-000000000001",
  "first_name": "Test",
  "email": "test@example.com"
}
```
- [ ] Returns 400/403 status
- [ ] Error indicates user_id doesn't match auth.uid()

#### 2.2 Create Contact (Public/Unauthenticated)
**Endpoint:** POST `/rest/v1/contacts`
**Headers:** apikey: {ANON_KEY} (NO Authorization header)

**Test Case 1: Public Lead Submission**
```json
{
  "first_name": "Public",
  "last_name": "Lead",
  "email": "public.lead@example.com",
  "phone": "555-0300",
  "source": "website"
}
```
- [ ] Returns 201 status
- [ ] Contact created with user_id = NULL
- [ ] Can retrieve via admin/system query

#### 2.3 Get Contacts
**Endpoint:** GET `/rest/v1/contacts?select=*`
**Headers:** Authorization: Bearer {JWT}, apikey: {ANON_KEY}

**Test Case 1: Get All User's Contacts**
- [ ] Returns 200 status
- [ ] Returns only contacts where user_id = auth.uid()
- [ ] Does not return other users' contacts
- [ ] Sorted by created_at desc

#### 2.4 Update Contact
**Endpoint:** PATCH `/rest/v1/contacts?id=eq.{CONTACT_ID}`
**Headers:** Authorization: Bearer {JWT}, apikey: {ANON_KEY}

**Test Case 1: Update Own Contact**
```json
{
  "status": "qualified",
  "lead_score": 90
}
```
- [ ] Returns 200/204 status
- [ ] Contact updated successfully
- [ ] updated_at timestamp changed

**Test Case 2: Update Another User's Contact**
- [ ] Returns 404 or 0 rows affected
- [ ] RLS policy prevents update

#### 2.5 Delete Contact
**Endpoint:** DELETE `/rest/v1/contacts?id=eq.{CONTACT_ID}`
**Headers:** Authorization: Bearer {JWT}, apikey: {ANON_KEY}

**Test Case 1: Delete Own Contact**
- [ ] Returns 200/204 status
- [ ] Contact deleted successfully
- [ ] Cannot retrieve after deletion

---

### Test Suite 3: Property Listings

#### 3.1 Create Property
**Endpoint:** POST `/rest/v1/property_listings`
**Headers:** Authorization: Bearer {JWT}, apikey: {ANON_KEY}

**Test Case 1: Valid Property**
```json
{
  "user_id": "{USER_ID}",
  "title": "Beautiful 3BR Home",
  "address": "123 Main St",
  "city": "Toronto",
  "province": "ON",
  "postal_code": "M1A 1A1",
  "property_type": "house",
  "listing_type": "sale",
  "price": 750000,
  "bedrooms": 3,
  "bathrooms": 2,
  "square_feet": 2000,
  "status": "active"
}
```
- [ ] Returns 201 status
- [ ] Property created successfully
- [ ] Can retrieve immediately

**Test Case 2: Missing Required Fields**
```json
{
  "user_id": "{USER_ID}",
  "title": "Test Property"
}
```
- [ ] Returns 400 status
- [ ] Error indicates missing required fields

#### 3.2 Update Property
**Endpoint:** PATCH `/rest/v1/property_listings?id=eq.{PROPERTY_ID}`

**Test Case 1: Update Price and Status**
```json
{
  "price": 725000,
  "status": "sold"
}
```
- [ ] Returns 200/204 status
- [ ] Property updated successfully
- [ ] updated_at changed

#### 3.3 Delete Property
**Endpoint:** DELETE `/rest/v1/property_listings?id=eq.{PROPERTY_ID}`

**Test Case 1: Delete Own Property**
- [ ] Returns 200/204 status
- [ ] Property deleted
- [ ] Cannot retrieve after deletion

---

### Test Suite 4: Deal Management

#### 4.1 Create Deal
**Endpoint:** POST `/rest/v1/deals`

**Test Case 1: Valid Deal**
```json
{
  "user_id": "{USER_ID}",
  "title": "123 Main St Sale",
  "value": 750000,
  "stage": "qualified",
  "status": "active",
  "contact_id": "{CONTACT_ID}",
  "expected_close_date": "2025-12-31"
}
```
- [ ] Returns 201 status
- [ ] Deal created successfully
- [ ] Linked to contact

#### 4.2 Update Deal Stage
**Endpoint:** PATCH `/rest/v1/deals?id=eq.{DEAL_ID}`

**Test Case 1: Move to Negotiation**
```json
{
  "stage": "negotiation",
  "probability": 75
}
```
- [ ] Returns 200/204 status
- [ ] Stage updated
- [ ] Probability updated

---

### Test Suite 5: Task Management

#### 5.1 Create Task
**Endpoint:** POST `/rest/v1/tasks`

**Test Case 1: Valid Task**
```json
{
  "user_id": "{USER_ID}",
  "title": "Follow up with client",
  "description": "Call to discuss offer",
  "priority": "high",
  "status": "pending",
  "due_date": "2025-11-15",
  "contact_id": "{CONTACT_ID}"
}
```
- [ ] Returns 201 status
- [ ] Task created
- [ ] Linked to contact

#### 5.2 Complete Task
**Endpoint:** PATCH `/rest/v1/tasks?id=eq.{TASK_ID}`

**Test Case 1: Mark Complete**
```json
{
  "status": "completed",
  "completed_at": "2025-11-08T15:30:00Z"
}
```
- [ ] Returns 200/204 status
- [ ] Task marked complete
- [ ] completed_at timestamp set

---

### Test Suite 6: Edge Functions

#### 6.1 Check Subscription
**Endpoint:** POST `/functions/v1/check-subscription`
**Headers:** Authorization: Bearer {JWT}, apikey: {ANON_KEY}

**Test Case 1: User Without Subscription**
```json
{}
```
- [ ] Returns 200 status
- [ ] Returns {"subscribed": false}

#### 6.2 Calculate Lead Score
**Endpoint:** POST `/functions/v1/lead-score-calculator`
**Headers:** Authorization: Bearer {JWT}, apikey: {ANON_KEY}

**Test Case 1: Valid Contact ID**
```json
{
  "contactId": "{CONTACT_ID}"
}
```
- [ ] Returns 200 status
- [ ] Returns score object with factors
- [ ] Score between 0-100

**Test Case 2: Invalid Contact ID**
```json
{
  "contactId": "invalid-uuid"
}
```
- [ ] Returns 400/500 status
- [ ] Error message returned

#### 6.3 Email Automation
**Endpoint:** POST `/functions/v1/email-automation`
**Headers:** Authorization: Bearer {JWT}, apikey: {ANON_KEY}

**Test Case 1: Send Welcome Email**
```json
{
  "contactId": "{CONTACT_ID}",
  "type": "welcome",
  "delay": 0
}
```
- [ ] Returns 200 status
- [ ] Email sent via HubSpot
- [ ] Logged in email_log table

---

## 🔒 Security Testing

### RLS Policy Tests

#### Test 1: User Isolation
- [ ] User A cannot read User B's contacts
- [ ] User A cannot update User B's properties
- [ ] User A cannot delete User B's deals
- [ ] User A cannot access User B's tasks

#### Test 2: Public Access
- [ ] Public can insert contacts (user_id = NULL)
- [ ] Public cannot read any contacts
- [ ] Public cannot update any records
- [ ] Public cannot delete any records

#### Test 3: Authentication Required
- [ ] Unauthenticated requests to protected endpoints fail
- [ ] JWT token validation working
- [ ] Expired tokens rejected
- [ ] Invalid tokens rejected

---

## 📊 Performance Testing

### Response Time Benchmarks
- [ ] User login < 500ms
- [ ] Contact list load < 1000ms
- [ ] Create contact < 300ms
- [ ] Update contact < 200ms
- [ ] Delete contact < 200ms
- [ ] Edge function calls < 2000ms

### Concurrent User Testing
- [ ] 10 simultaneous users - no errors
- [ ] 50 simultaneous users - acceptable degradation
- [ ] 100 simultaneous users - system stable

---

## 🐛 Error Handling

### Frontend Error Handling
- [ ] Network errors show user-friendly messages
- [ ] API errors displayed with context
- [ ] Validation errors highlighted on forms
- [ ] Toast notifications working
- [ ] Loading states prevent multiple submissions

### Backend Error Handling
- [ ] Invalid input rejected with clear errors
- [ ] Database errors caught and logged
- [ ] Edge function errors returned properly
- [ ] CORS errors handled
- [ ] Authentication errors clear

---

## 📱 Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile responsive design works

---

## ✅ Final Verification

### System Health
- [ ] No console errors on page load
- [ ] No 404s or failed network requests
- [ ] All images loading
- [ ] All fonts loading
- [ ] No JavaScript errors

### Data Integrity
- [ ] All CRUD operations working
- [ ] RLS policies enforcing security
- [ ] Timestamps updating correctly
- [ ] Foreign keys working
- [ ] Cascade deletes working properly

### Documentation
- [ ] API endpoints documented
- [ ] Test credentials provided
- [ ] Setup instructions clear
- [ ] Known issues documented
- [ ] Troubleshooting guide available

---

## 🚀 Production Readiness

### Required Before Production Launch
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Error monitoring configured
- [ ] Backup strategy in place
- [ ] SSL/TLS configured
- [ ] CDN configured
- [ ] Database optimized with indexes
- [ ] Rate limiting configured
- [ ] Monitoring alerts set up

### Post-Launch Monitoring
- [ ] Error rates tracked
- [ ] API response times monitored
- [ ] User signup funnel tracked
- [ ] Database performance monitored
- [ ] Edge function logs reviewed
- [ ] User feedback collected

---

## 📞 Support Contacts

**Development Team:**
- Technical Lead: [contact info]
- Backend Engineer: [contact info]
- QA Lead: [contact info]

**Emergency Contacts:**
- On-call engineer: [contact info]
- Database admin: [contact info]

---

## 📝 Test Results Log

| Date | Tester | Tests Run | Passed | Failed | Notes |
|------|--------|-----------|--------|--------|-------|
| 2025-11-08 | Initial Setup | All | TBD | TBD | Backend configured |
| | | | | | |

---

**Next Steps:**
1. Run all authentication tests
2. Verify CRUD operations
3. Test edge functions
4. Perform security audit
5. Complete performance testing
6. Document any issues found
7. Retest after fixes
8. Sign off for production
