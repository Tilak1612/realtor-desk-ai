# RealtorDesk AI - Complete API Documentation

**Version:** 1.0.0  
**Last Updated:** November 9, 2025

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URLs](#base-urls)
4. [REST API Endpoints](#rest-api-endpoints)
5. [Edge Functions](#edge-functions)
6. [Query Operators](#query-operators)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [Examples](#examples)

---

## Overview

RealtorDesk AI provides a comprehensive REST API and serverless Edge Functions for managing contacts, deals, tasks, and property listings. The API follows REST principles and uses JSON for request/response payloads.

### Key Features

- ✅ Full CRUD operations on all resources
- ✅ JWT-based authentication with Row-Level Security (RLS)
- ✅ Advanced filtering and sorting capabilities
- ✅ Serverless edge functions for AI and integrations
- ✅ Automatic user_id injection via database triggers
- ✅ Real-time data validation and constraints

---

## Authentication

All API endpoints require authentication using two headers:

```http
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

### Getting Your JWT Token

1. Login to RealtorDesk AI
2. Open browser DevTools (F12)
3. Go to Application > Local Storage
4. Find `sb-pseqajrtcgiphfnworii-auth-token`
5. Copy the `access_token` value

### Token Expiration

- JWT tokens expire after **1 hour**
- Refresh tokens automatically before expiration
- Returns `401 Unauthorized` if token is invalid/expired

---

## Base URLs

| Service | URL |
|---------|-----|
| REST API | `https://pseqajrtcgiphfnworii.supabase.co/rest/v1` |
| Edge Functions | `https://pseqajrtcgiphfnworii.supabase.co/functions/v1` |

---

## REST API Endpoints

### Contacts

**Endpoint:** `/contacts`

#### List Contacts
```http
GET /contacts
GET /contacts?limit=20&offset=0
GET /contacts?status=eq.lead
GET /contacts?email~gmail.com
GET /contacts?order=created_at.desc
```

#### Create Contact
```http
POST /contacts
Content-Type: application/json
Prefer: return=representation

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "source": "website",
  "tags": ["buyer", "first-time"],
  "status": "lead"
}
```

#### Update Contact
```http
PATCH /contacts?id=eq.{uuid}
Content-Type: application/json
Prefer: return=representation

{
  "status": "client",
  "lead_score": 85,
  "tags": ["buyer", "hot-lead"]
}
```

#### Delete Contact
```http
DELETE /contacts?id=eq.{uuid}
```

---

### Deals

**Endpoint:** `/deals`

#### List Deals
```http
GET /deals
GET /deals?stage=eq.negotiation
GET /deals?value=gte.500000&value=lte.1000000
GET /deals?order=value.desc
```

#### Create Deal
```http
POST /deals
Content-Type: application/json
Prefer: return=representation

{
  "title": "Downtown Condo Sale",
  "stage": "qualified",
  "contact_id": "uuid",
  "value": 850000,
  "probability": 75,
  "expected_close_date": "2025-12-31",
  "notes": "High-priority client"
}
```

#### Update Deal
```http
PATCH /deals?id=eq.{uuid}
Content-Type: application/json
Prefer: return=representation

{
  "stage": "closed",
  "status": "won",
  "probability": 100
}
```

---

### Tasks

**Endpoint:** `/tasks`

#### List Tasks
```http
GET /tasks
GET /tasks?status=eq.pending
GET /tasks?priority=eq.high
GET /tasks?due_date=lt.2025-11-15
```

#### Create Task
```http
POST /tasks
Content-Type: application/json
Prefer: return=representation

{
  "title": "Follow up with client",
  "description": "Discuss property viewing options",
  "contact_id": "uuid",
  "due_date": "2025-11-12",
  "due_time": "14:30:00",
  "priority": "high"
}
```

#### Complete Task
```http
PATCH /tasks?id=eq.{uuid}
Content-Type: application/json

{
  "status": "completed",
  "completed_at": "2025-11-09T15:30:00Z"
}
```

---

### Property Listings

**Endpoint:** `/property_listings`

#### List Properties
```http
GET /property_listings
GET /property_listings?property_type=eq.condo
GET /property_listings?city=eq.Toronto
GET /property_listings?price=gte.500000&bedrooms=gte.2
```

#### Create Property
```http
POST /property_listings
Content-Type: application/json
Prefer: return=representation

{
  "title": "Luxury Downtown Condo",
  "description": "Stunning 2BR with city views",
  "address": "123 Main St, Unit 1502",
  "city": "Toronto",
  "province": "ON",
  "postal_code": "M5H 2N2",
  "property_type": "condo",
  "listing_type": "sale",
  "price": 850000,
  "bedrooms": 2,
  "bathrooms": 2,
  "square_feet": 1200,
  "features": ["parking", "gym", "concierge"]
}
```

#### Update Property
```http
PATCH /property_listings?id=eq.{uuid}
Content-Type: application/json

{
  "price": 825000,
  "status": "pending"
}
```

---

## Edge Functions

### 1. check-subscription

Check user's subscription status.

```http
POST /functions/v1/check-subscription
Content-Type: application/json

{}
```

**Response:**
```json
{
  "subscribed": false
}
```

---

### 2. lead-score-calculator

Calculate AI-powered lead score for a contact.

```http
POST /functions/v1/lead-score-calculator
Content-Type: application/json

{
  "contactId": "uuid"
}
```

**Response:**
```json
{
  "score": 85,
  "factors": {
    "engagement": 90,
    "recency": 85,
    "property_match": 80
  },
  "confidence": 0.92
}
```

---

### 3. claude-chat

AI-powered chat using Claude.

```http
POST /functions/v1/claude-chat
Content-Type: application/json

{
  "message": "How do I improve my lead conversion rate?"
}
```

**Response:**
```json
{
  "response": "Here are 5 proven strategies to improve lead conversion..."
}
```

---

### 4. email-automation

Trigger automated email workflows.

```http
POST /functions/v1/email-automation
Content-Type: application/json

{
  "contactId": "uuid",
  "type": "follow_up"
}
```

---

### 5. ai-chatbot

Website chatbot responses.

```http
POST /functions/v1/ai-chatbot
Content-Type: application/json

{
  "message": "What services do you offer?",
  "context": "real estate"
}
```

---

### 6. hubspot-sync

Sync contacts with HubSpot CRM.

```http
POST /functions/v1/hubspot-sync
Content-Type: application/json

{
  "contactId": "uuid",
  "action": "sync"
}
```

---

### 7. encrypt-integration-token

Encrypt integration API tokens.

```http
POST /functions/v1/encrypt-integration-token
Content-Type: application/json

{
  "token": "api_key_12345",
  "provider": "hubspot"
}
```

---

### 8. create-checkout (Stripe)

Create Stripe checkout session.

```http
POST /functions/v1/create-checkout
Content-Type: application/json

{
  "priceId": "price_xxx",
  "tier": "pro"
}
```

---

### 9. customer-portal (Stripe)

Generate Stripe customer portal URL.

```http
POST /functions/v1/customer-portal
Content-Type: application/json

{}
```

---

## Query Operators

PostgREST supports advanced query operators:

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equals | `?status=eq.active` |
| `neq` | Not equals | `?status=neq.inactive` |
| `gt` | Greater than | `?value=gt.100000` |
| `gte` | Greater than or equal | `?value=gte.100000` |
| `lt` | Less than | `?lead_score=lt.50` |
| `lte` | Less than or equal | `?lead_score=lte.50` |
| `like` | Pattern match (case-sensitive) | `?name=like.*John*` |
| `ilike` | Pattern match (case-insensitive) | `?email=ilike.*@gmail.com` |
| `~` | Contains substring | `?email~gmail.com` |
| `in` | In list | `?status=in.(lead,active)` |
| `is` | Is null | `?phone=is.null` |
| `not.is` | Is not null | `?phone=not.is.null` |

### Combining Filters

```http
GET /contacts?status=eq.lead&lead_score=gte.70&email~gmail.com
```

### Ordering

```http
GET /contacts?order=created_at.desc
GET /deals?order=value.desc,created_at.desc
```

### Pagination

```http
GET /contacts?limit=20&offset=40
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (delete success) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "code": "23505",
  "message": "duplicate key value violates unique constraint",
  "details": "Key (user_id, email)=(uuid, email) already exists",
  "hint": null
}
```

---

## Rate Limiting

- Default: 100 requests/minute per user
- Burst: 200 requests/minute
- Edge Functions: 60 requests/minute

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699564800
```

**429 Response:**
```json
{
  "message": "Rate limit exceeded. Retry after 60 seconds."
}
```

---

## Examples

### Complete Contact Workflow

```python
import requests

BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
HEADERS = {
    "apikey": "YOUR_ANON_KEY",
    "Authorization": "Bearer YOUR_JWT_TOKEN",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# 1. Create contact
response = requests.post(
    f"{BASE_URL}/contacts",
    headers=HEADERS,
    json={
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "phone": "+19876543210",
        "status": "lead"
    }
)
contact = response.json()[0]
contact_id = contact['id']

# 2. Calculate lead score
response = requests.post(
    "https://pseqajrtcgiphfnworii.supabase.co/functions/v1/lead-score-calculator",
    headers=HEADERS,
    json={"contactId": contact_id}
)
lead_score = response.json()

# 3. Update contact with score
response = requests.patch(
    f"{BASE_URL}/contacts?id=eq.{contact_id}",
    headers=HEADERS,
    json={"lead_score": lead_score['score']}
)

# 4. Create task
response = requests.post(
    f"{BASE_URL}/tasks",
    headers=HEADERS,
    json={
        "title": "Follow up with Jane",
        "contact_id": contact_id,
        "due_date": "2025-11-12",
        "priority": "high"
    }
)
```

---

## OpenAPI Specification

Full OpenAPI 3.0 specification available at: `openapi.yaml`

Import into tools like:
- **Postman** - Generate API collection
- **Swagger UI** - Interactive documentation
- **TestSprite** - Automated API testing

---

## Support

For API support or questions:
- **Email:** support@realtordeskai.com
- **Documentation:** https://docs.realtordeskai.com
- **Status Page:** https://status.realtordeskai.com
