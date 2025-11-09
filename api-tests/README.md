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

### test_contacts_create.py
Tests for creating new contacts:
- ✅ Create contact with all fields
- ✅ Create contact with minimal fields

### test_contacts_read.py
Tests for reading/querying contacts:
- ✅ Get all contacts
- ✅ Get single contact by ID
- ✅ Filter contacts by status
- ✅ Search contacts by email domain

### test_contacts_update.py
Tests for updating contacts:
- ✅ Update multiple fields
- ✅ Update single field (lead score)
- ✅ Update contact status

### test_contacts_delete.py
Tests for deleting contacts:
- ✅ Delete existing contact
- ✅ Verify deletion
- ✅ Delete non-existent contact

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
