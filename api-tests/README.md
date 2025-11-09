# Realtor Desk API Test Suite

Complete Python test suite for the Realtor Desk Contacts REST API.

## Setup

1. Install required packages:
```bash
pip install requests
```

2. Get your JWT token:
   - Login to the app as `smtc.poonam@gmail.com`
   - Open browser DevTools (F12)
   - Go to Application/Storage > Local Storage
   - Find `sb-pseqajrtcgiphfnworii-auth-token`
   - Copy the `access_token` value

3. Update the JWT token in each test file:
```python
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"
```

## Test Files

### Contacts API Tests
**test_contacts_create.py** - Creating new contacts
- ✅ Create contact with all fields
- ✅ Create contact with minimal fields

**test_contacts_read.py** - Reading/querying contacts
- ✅ Get all contacts
- ✅ Get single contact by ID
- ✅ Filter contacts by status
- ✅ Search contacts by email domain

**test_contacts_update.py** - Updating contacts
- ✅ Update multiple fields
- ✅ Update single field (lead score)
- ✅ Update contact status

**test_contacts_delete.py** - Deleting contacts
- ✅ Delete existing contact
- ✅ Verify deletion
- ✅ Delete non-existent contact

### Deals API Tests
**test_deals_create.py** - Creating new deals
- ✅ Create deal with all fields
- ✅ Create deal with minimal fields
- ✅ Create deal linked to contact

**test_deals_read.py** - Reading/querying deals
- ✅ Get all deals
- ✅ Get single deal by ID
- ✅ Filter deals by stage
- ✅ Filter deals by value range
- ✅ Sort deals by value

**test_deals_update.py** - Updating deals
- ✅ Update deal stage
- ✅ Update deal value & probability
- ✅ Update expected close date
- ✅ Update deal notes

**test_deals_delete.py** - Deleting deals
- ✅ Delete existing deal
- ✅ Verify deletion
- ✅ Delete non-existent deal

### Tasks API Tests
**test_tasks_create.py** - Creating new tasks
- ✅ Create task with all fields
- ✅ Create task with minimal fields
- ✅ Create task linked to contact
- ✅ Create task linked to deal

**test_tasks_read.py** - Reading/querying tasks
- ✅ Get all tasks
- ✅ Get single task by ID
- ✅ Filter tasks by status
- ✅ Filter tasks by priority
- ✅ Sort tasks by due date
- ✅ Filter overdue tasks

**test_tasks_update.py** - Updating tasks
- ✅ Complete task
- ✅ Update task priority
- ✅ Reschedule task
- ✅ Update task description

**test_tasks_delete.py** - Deleting tasks
- ✅ Delete existing task
- ✅ Verify deletion
- ✅ Delete non-existent task

### Property Listings API Tests
**test_properties_create.py** - Creating new property listings
- ✅ Create property with all fields
- ✅ Create property with minimal fields
- ✅ Create rental property
- ✅ Create house listing

**test_properties_read.py** - Reading/querying property listings
- ✅ Get all property listings
- ✅ Get single property by ID
- ✅ Filter by property type
- ✅ Filter by price range
- ✅ Filter by bedrooms
- ✅ Filter by city
- ✅ Filter active listings

**test_properties_update.py** - Updating property listings
- ✅ Update property price
- ✅ Update property status
- ✅ Update property description
- ✅ Update property features

**test_properties_delete.py** - Deleting property listings
- ✅ Delete existing property
- ✅ Verify deletion
- ✅ Delete non-existent property

## Running Tests

Run individual test files:
```bash
python api-tests/test_contacts_create.py
python api-tests/test_contacts_read.py
python api-tests/test_contacts_update.py
python api-tests/test_contacts_delete.py
```

## API Endpoints

**Base URL:** `https://pseqajrtcgiphfnworii.supabase.co/rest/v1`

### Required Headers
```python
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Authorization": "Bearer YOUR_JWT_TOKEN",
    "Content-Type": "application/json"
}
```

### Contacts Schema
```json
{
  "id": "uuid (auto-generated)",
  "user_id": "uuid (auto-set)",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "source": "string",
  "tags": ["array"],
  "status": "lead|active|client|inactive",
  "lead_score": "integer",
  "best_contact_time": "string",
  "metadata": "jsonb",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## TestSprite Configuration

To import these tests into TestSprite:

1. **API Name:** Realtor Desk Contacts API
2. **Base URL:** `https://pseqajrtcgiphfnworii.supabase.co/rest/v1`
3. **Auth Type:** Bearer Token
4. **Headers:**
   - `apikey`: Use the anon key
   - `Authorization`: Bearer {JWT_TOKEN}
   - `Content-Type`: application/json

## Notes

- All endpoints require authentication
- JWT tokens expire after 1 hour
- RLS policies ensure users only see their own contacts
- The `user_id` is automatically set from the JWT token
- Use `Prefer: return=representation` header to get created/updated records back
