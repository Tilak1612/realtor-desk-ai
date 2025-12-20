# Apify Scraper Test Cases & Rollback Plan

## Test Cases

### 1. URL Validation Tests

| Test ID | Description | Input | Expected Output |
|---------|-------------|-------|-----------------|
| URL-01 | Valid map URL | `https://www.realtor.ca/map#...` | `{ valid: true, type: 'map' }` |
| URL-02 | Valid search URL | `https://www.realtor.ca/edmonton/real-estate` | `{ valid: true, type: 'search' }` |
| URL-03 | Single listing URL (blocked) | `https://www.realtor.ca/real-estate/12345/...` | `{ valid: false, type: 'listing', error: '...' }` |
| URL-04 | Non-Realtor.ca URL | `https://example.com` | `{ valid: false, error: 'Please enter a valid Realtor.ca URL' }` |
| URL-05 | Empty URL | `` | `{ valid: false, error: 'URL is required' }` |
| URL-06 | Agent search URL | `https://www.realtor.ca/agent/...` | `{ valid: true, type: 'search' }` |

### 2. Rate Limiting Tests

| Test ID | Description | Precondition | Expected Behavior |
|---------|-------------|--------------|-------------------|
| RL-01 | Under rate limit | User has 5 imports today | Import allowed |
| RL-02 | At rate limit | User has 10 imports today | Import blocked with message |
| RL-03 | QA account bypass | User is_qa_account = true, 15 imports | Import allowed |
| RL-04 | Rate limit resets | After midnight | Import allowed |

### 3. Concurrent Import Tests

| Test ID | Description | Precondition | Expected Behavior |
|---------|-------------|--------------|-------------------|
| CI-01 | No running import | No imports with status 'running' | Import allowed |
| CI-02 | Import in progress | One import with status 'running' | Import blocked |
| CI-03 | Previous import completed | Import status changed to 'completed' | New import allowed |

### 4. Duplicate Detection Tests

| Test ID | Description | Input | Expected Behavior |
|---------|-------------|-------|-------------------|
| DD-01 | Duplicate MLS number | Listing with existing MLS# | Marked as duplicate, not saved |
| DD-02 | Duplicate address | Listing with existing address | Marked as duplicate, not saved |
| DD-03 | Duplicate agent name | Agent with same first/last name | Marked as duplicate, not saved |
| DD-04 | Duplicate agent email | Agent with same email | Marked as duplicate, not saved |
| DD-05 | New listing | Unique MLS# and address | Saved successfully |

### 5. Import History Tracking Tests

| Test ID | Description | Expected Behavior |
|---------|-------------|-------------------|
| IH-01 | Import started | import_history record created with status 'running' |
| IH-02 | Import completed | Status updated to 'completed', raw_payload stored |
| IH-03 | Import failed | Status updated to 'failed', error_message stored |
| IH-04 | Save counts updated | saved_records and duplicate_records updated after bulk save |

### 6. Edge Function Tests

| Test ID | Description | Expected Behavior |
|---------|-------------|-------------------|
| EF-01 | Valid request | Returns scraped data |
| EF-02 | Missing APIFY_TOKEN | Returns 500 with 'Apify not configured' |
| EF-03 | Missing actorId | Returns 400 with 'actorId is required' |
| EF-04 | Actor not rented | Returns 402 with subscription message |
| EF-05 | Rate limited by Apify | Returns 429 with rate limit message |
| EF-06 | Request timeout | Retries 2 times, then returns timeout error |
| EF-07 | Network error | Retries 2 times, then returns network error |

### 7. UI State Tests

| Test ID | Description | Expected Behavior |
|---------|-------------|-------------------|
| UI-01 | Loading state | Shows spinner, disables button during import |
| UI-02 | Empty results | Shows empty state message |
| UI-03 | Results displayed | Shows table with data |
| UI-04 | Success notification | Shows toast on successful save |
| UI-05 | Error notification | Shows toast on error |
| UI-06 | Cooldown active | Button disabled for 5 seconds after import |
| UI-07 | Rate limit reached | Shows limit message, disables import button |

---

## Rollback Plan

### Scenario 1: Apify Actors Become Unavailable

**Impact:** Scrapers stop working, users see 402/403 errors

**Rollback Steps:**
1. Hide Apify widgets from dashboard by adding feature flag
2. Display maintenance notice to users
3. Enable demo mode with sample data

**Implementation:**
```typescript
// Add to Dashboard.tsx
const APIFY_ENABLED = false; // Set to false to disable

{APIFY_ENABLED && <ImportListingsWidget />}
```

### Scenario 2: Database Corruption from Bad Import

**Impact:** Properties/contacts table has invalid data

**Rollback Steps:**
1. Identify affected records by `data_source = 'realtor.ca'` and `created_at > [incident_time]`
2. Delete affected records
3. Review import_history for raw_payload to verify data

**SQL to identify affected records:**
```sql
SELECT * FROM properties 
WHERE data_source = 'realtor.ca' 
AND created_at > '[INCIDENT_TIMESTAMP]';

SELECT * FROM contacts 
WHERE source = 'realtor.ca' 
AND created_at > '[INCIDENT_TIMESTAMP]';
```

### Scenario 3: Rate Limit Bypass Detected

**Impact:** Users abuse API, Apify credits depleted

**Rollback Steps:**
1. Reduce rate limit in database function
2. Review apify_usage table for abuse
3. Temporarily disable scrapers if needed

**SQL to update rate limit:**
```sql
CREATE OR REPLACE FUNCTION public.check_apify_rate_limit(checking_user_id UUID, max_daily_imports INTEGER DEFAULT 5) -- Reduced from 10
-- ... rest of function
```

### Scenario 4: Parser Returns Corrupt Data

**Impact:** Data mapping is incorrect

**Rollback Steps:**
1. Increment PARSER_VERSION in apify.ts
2. Review raw_payload in import_history to debug
3. Update parsing logic
4. Re-run affected imports from stored raw_payload

**Finding affected imports:**
```sql
SELECT id, source_url, raw_payload, parser_version 
FROM import_history 
WHERE parser_version = '1.0.0' 
AND status = 'completed';
```

---

## Monitoring Checklist

- [ ] Check edge function logs daily for errors
- [ ] Monitor apify_usage table for unusual activity
- [ ] Review import_history for failed imports
- [ ] Check Apify dashboard for credit usage
- [ ] Verify rate limiting is working

---

## Emergency Contacts

- **Apify Support:** support@apify.com
- **Lovable Cloud:** Check Cloud dashboard for function logs

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-20 | Initial parser version |
