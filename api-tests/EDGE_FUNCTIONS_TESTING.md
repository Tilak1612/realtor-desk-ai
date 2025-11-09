# Edge Functions Testing Guide

Complete test suite for all 11 RealtorDesk AI Edge Functions.

## Prerequisites

1. **Python 3.x** installed
2. **requests** library: `pip install requests`
3. **Authenticated JWT Token** from the app

## Getting Your JWT Token

1. Login to RealtorDesk AI as `smtc.poonam@gmail.com`
2. Open browser DevTools (F12)
3. Go to Application/Storage > Local Storage
4. Find `sb-pseqajrtcgiphfnworii-auth-token`
5. Copy the `access_token` value
6. Update `JWT_TOKEN` in `test_edge_functions.py`

## Edge Functions Overview

### 1. **check-subscription**
- **Purpose**: Check user's subscription status
- **Authentication**: Required (JWT)
- **Input**: None
- **Output**: `{ "subscribed": boolean }`

### 2. **lead-score-calculator**
- **Purpose**: Calculate lead score for a contact
- **Authentication**: Required (JWT)
- **Input**: `{ "contactId": "uuid" }`
- **Output**: Lead score data with factors

### 3. **claude-chat**
- **Purpose**: AI-powered chat using Claude
- **Authentication**: Required (JWT)
- **Input**: `{ "message": "string" }`
- **Output**: AI response text

### 4. **encrypt-integration-token**
- **Purpose**: Encrypt integration API tokens
- **Authentication**: Required (JWT)
- **Input**: `{ "token": "string", "provider": "string" }`
- **Output**: `{ "encrypted_token": "string" }`

### 5. **email-automation**
- **Purpose**: Trigger automated email workflows
- **Authentication**: Required (JWT)
- **Input**: `{ "contactId": "uuid", "type": "string" }`
- **Output**: Email scheduling confirmation

### 6. **ai-chatbot**
- **Purpose**: Website chatbot AI responses
- **Authentication**: Required (JWT)
- **Input**: `{ "message": "string", "context": "string" }`
- **Output**: Chatbot response

### 7. **hubspot-sync**
- **Purpose**: Sync contacts with HubSpot CRM
- **Authentication**: Required (JWT)
- **Input**: `{ "contactId": "uuid", "action": "sync" }`
- **Output**: Sync status

### 8. **calculate-lead-score**
- **Purpose**: Alternative lead scoring function
- **Authentication**: Required (JWT)
- **Input**: `{ "contactId": "uuid" }`
- **Output**: Calculated lead score

### 9. **send-welcome-email**
- **Purpose**: Send welcome email to new users
- **Authentication**: Required (JWT)
- **Input**: `{ "userId": "uuid" }`
- **Output**: Email sent confirmation

### 10. **create-checkout**
- **Purpose**: Create Stripe checkout session
- **Authentication**: Required (JWT)
- **Input**: `{ "priceId": "string", "tier": "string" }`
- **Output**: Stripe checkout URL

### 11. **customer-portal**
- **Purpose**: Generate Stripe customer portal URL
- **Authentication**: Required (JWT)
- **Input**: None
- **Output**: Portal URL

## Running Tests

### Run All Edge Function Tests
```bash
python api-tests/test_edge_functions.py
```

## Test Configuration

```python
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/functions/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"  # Update this!
```

## Expected Results

### Successful Test Output
```
🚀 Starting Edge Functions Tests
============================================================
Testing 11 Edge Functions
============================================================

============================================================
TEST: check-subscription
============================================================
Status Code: 200
Response: {"subscribed":false}
✅ Test PASSED - Returns subscription status

[... additional tests ...]

============================================================
TEST SUMMARY
============================================================
Total: 11 edge functions
✅ Passed: 11
❌ Failed: 0
⚠️  Skipped: 0
```

## Common Issues

### 1. **401 Unauthorized**
- JWT token expired or invalid
- Get a fresh token from the browser

### 2. **404 Not Found**
- Edge function may not be deployed
- Check function name spelling

### 3. **500 Internal Server Error**
- Function may require additional configuration (API keys)
- Check edge function logs in Cloud dashboard

### 4. **Missing Contact Data**
- Some tests require existing contacts
- Create test contacts first using contact creation tests

## Integration Requirements

### Stripe Functions
- `create-checkout` and `customer-portal` require Stripe configuration
- May return errors if Stripe secret key not configured

### HubSpot Functions
- `hubspot-sync` requires HubSpot API key
- May return 400 if integration not configured

### Email Functions
- `email-automation` and `send-welcome-email` require Resend API key
- Check logs for email delivery status

## Security Notes

- **Never commit JWT tokens** to version control
- JWT tokens expire after 1 hour
- All edge functions require authentication except public endpoints
- API keys are stored securely in Supabase Secrets

## CORS Headers

All edge functions include CORS headers:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

## Rate Limiting

- Edge functions have rate limits
- Add delays between tests (1 second recommended)
- Check Cloud usage dashboard for metrics

## Logging

Edge function logs available at:
1. Cloud dashboard → Functions
2. Select function → View logs
3. Filter by time range and search terms

## Next Steps

After edge function testing:
1. ✅ Create API documentation (OpenAPI/Swagger)
2. ✅ Build Python SDK client library
3. ✅ Run integration tests
4. ✅ Performance benchmarking
