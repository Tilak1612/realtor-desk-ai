# Quick Test Guide for TestSprite
## 5-Minute Backend Verification

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Test User (1 min)
```bash
# Navigate to signup page
https://realtor-desk-ai.lovable.app/signup

# Register with:
Email: test.agent@testsprite.test
Password: TestAgent123!
Full Name: Test Agent
Phone: 555-0101
Company: Test Realty
```

✅ **Expected:** Immediately logged in (no email verification)

---

### Step 2: Get JWT Token (1 min)
```bash
# After login, open browser console and run:
const { data } = await supabase.auth.getSession();
console.log('JWT Token:', data.session.access_token);
console.log('User ID:', data.session.user.id);

# Copy these values - you'll need them
```

---

### Step 3: Test Contact Creation (1 min)

**Via Browser Console:**
```javascript
const { data, error } = await supabase
  .from('contacts')
  .insert({
    user_id: 'YOUR_USER_ID_HERE', // from Step 2
    first_name: 'Test',
    last_name: 'Contact',
    email: 'test@example.com',
    phone: '555-0200',
    status: 'lead',
    lead_score: 75
  })
  .select();

console.log('Result:', data, error);
```

✅ **Expected:** Contact created, no errors

---

### Step 4: Test Public Lead Submission (1 min)

**Via curl or Postman:**
```bash
curl -X POST 'https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U' \
  -H 'Content-Type: application/json' \
  -d '{
    "first_name": "Public",
    "last_name": "Lead",
    "email": "public@example.com",
    "phone": "555-0300"
  }'
```

✅ **Expected:** 201 Created (no auth required)

---

### Step 5: Test Property Listing (1 min)

**Via Browser Console:**
```javascript
const { data, error } = await supabase
  .from('property_listings')
  .insert({
    user_id: 'YOUR_USER_ID_HERE',
    title: 'Test Property',
    address: '123 Test St',
    city: 'Toronto',
    province: 'ON',
    postal_code: 'M1A 1A1',
    property_type: 'house',
    price: 500000,
    bedrooms: 3,
    bathrooms: 2,
    status: 'active'
  })
  .select();

console.log('Result:', data, error);
```

✅ **Expected:** Property created, no errors

---

## 🎯 Critical Endpoints to Test

### Authentication
```bash
# Sign Up (auto-confirm enabled)
POST /auth/v1/signup

# Sign In
POST /auth/v1/token?grant_type=password

# Get User
GET /auth/v1/user
```

### Contacts CRUD
```bash
# Create
POST /rest/v1/contacts

# Read
GET /rest/v1/contacts?select=*

# Update
PATCH /rest/v1/contacts?id=eq.{ID}

# Delete
DELETE /rest/v1/contacts?id=eq.{ID}
```

### Property Listings CRUD
```bash
# Create
POST /rest/v1/property_listings

# Read
GET /rest/v1/property_listings?select=*

# Update
PATCH /rest/v1/property_listings?id=eq.{ID}

# Delete
DELETE /rest/v1/property_listings?id=eq.{ID}
```

### Deals CRUD
```bash
# Create
POST /rest/v1/deals

# Read
GET /rest/v1/deals?select=*,contacts(*)

# Update
PATCH /rest/v1/deals?id=eq.{ID}

# Delete
DELETE /rest/v1/deals?id=eq.{ID}
```

### Edge Functions
```bash
# Check Subscription
POST /functions/v1/check-subscription

# Calculate Lead Score
POST /functions/v1/lead-score-calculator
Body: {"contactId": "uuid"}

# Email Automation
POST /functions/v1/email-automation
Body: {"contactId": "uuid", "type": "welcome", "delay": 0}
```

---

## ✅ Success Criteria

### Must Pass:
- [x] User registration without email verification
- [x] User login returns JWT token
- [x] Contact CRUD operations work
- [x] Property listing CRUD operations work
- [x] Public contact submission works (no auth)
- [x] RLS policies prevent cross-user access
- [x] Edge functions respond (even with errors for missing data)

### Common Issues:

**❌ "new row violates row-level security"**
- Fix: Include user_id in request that matches auth.uid()

**❌ "JWT token expired"**
- Fix: Re-login to get new token

**❌ "Contact not found"**
- Fix: Use correct contact_id from your user's contacts

**❌ "HubSpot API error" (in email-automation)**
- Expected: Email domain not verified, but function should still respond

---

## 🔧 Debugging Tools

### View Supabase Logs
```javascript
// In browser console
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

### Check RLS Policies
```javascript
// Try to read another user's data (should fail)
const { data, error } = await supabase
  .from('contacts')
  .select('*')
  .eq('user_id', '00000000-0000-0000-0000-000000000001');

console.log('Should be empty or error:', data, error);
```

### Test Error Monitoring
```javascript
// Trigger an error to see monitoring
try {
  await supabase.from('invalid_table').select();
} catch (error) {
  console.error('Error caught:', error);
}
```

---

## 📊 Quick Health Check

Run this in browser console after login:

```javascript
const healthCheck = async () => {
  const results = {
    auth: false,
    contacts: false,
    properties: false,
    deals: false,
    tasks: false
  };

  try {
    // Check auth
    const { data: session } = await supabase.auth.getSession();
    results.auth = !!session.session;

    // Check contacts table
    const { error: contactsError } = await supabase
      .from('contacts')
      .select('count')
      .limit(1);
    results.contacts = !contactsError;

    // Check properties table
    const { error: propertiesError } = await supabase
      .from('property_listings')
      .select('count')
      .limit(1);
    results.properties = !propertiesError;

    // Check deals table
    const { error: dealsError } = await supabase
      .from('deals')
      .select('count')
      .limit(1);
    results.deals = !dealsError;

    // Check tasks table
    const { error: tasksError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1);
    results.tasks = !tasksError;

  } catch (error) {
    console.error('Health check error:', error);
  }

  console.table(results);
  const allPass = Object.values(results).every(v => v === true);
  console.log(allPass ? '✅ All systems operational!' : '❌ Some systems down');
  
  return results;
};

// Run it
healthCheck();
```

---

## 🎉 Success!

If all quick tests pass, the backend is ready for comprehensive automated testing.

**Next Steps:**
1. Load TEST_SEED_DATA.sql to populate test data
2. Run full test suite from TESTING_VERIFICATION.md
3. Review TESTSPRITE_DOCUMENTATION.md for detailed API docs
4. Start automated TestSprite test runs
