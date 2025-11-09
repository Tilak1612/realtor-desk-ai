## RealtorDesk AI Python SDK - Usage Guide

Professional Pythonic SDK for the RealtorDesk AI CRM API.

---

## Installation

```bash
# Install from source
cd api-tests
pip install -e ./realtordesk_sdk

# Or install required dependencies
pip install requests
```

---

## Quick Start

```python
from realtordesk_sdk import RealtorDeskClient

# Initialize client
client = RealtorDeskClient(
    jwt_token="your_jwt_token_here",
    anon_key="your_anon_key"  # Optional, default provided
)

# Use as context manager (auto-closes)
with RealtorDeskClient(jwt_token="token") as client:
    contacts = client.contacts.list()
```

---

## Contacts API

### List Contacts

```python
# List all contacts
contacts = client.contacts.list()

# With filtering
leads = client.contacts.list(
    status="lead",
    limit=20,
    order="created_at.desc"
)

# Advanced filtering
high_value_leads = client.contacts.list(
    status="lead",
    lead_score__gte=70,
    email__contains="gmail.com"
)
```

### Get Single Contact

```python
contact = client.contacts.get("contact-uuid")
print(f"Name: {contact['first_name']} {contact['last_name']}")
print(f"Score: {contact['lead_score']}")
```

### Create Contact

```python
contact = client.contacts.create(
    first_name="John",
    last_name="Doe",
    email="john.doe@example.com",
    phone="+1234567890",
    source="website",
    tags=["buyer", "first-time"],
    status="lead"
)

print(f"Created contact: {contact['id']}")
```

### Update Contact

```python
updated = client.contacts.update(
    "contact-uuid",
    status="client",
    lead_score=85,
    tags=["buyer", "hot-lead"]
)
```

### Delete Contact

```python
client.contacts.delete("contact-uuid")
```

### Search Contacts

```python
# Search by name or email
results = client.contacts.search("john", limit=10)
```

---

## Deals API

### List Deals

```python
# All deals
deals = client.deals.list()

# Filter by stage and value
deals = client.deals.list(
    stage="negotiation",
    value__gte=500000,
    value__lte=1000000,
    order="value.desc"
)
```

### Create Deal

```python
from datetime import date

deal = client.deals.create(
    title="Downtown Condo Sale",
    stage="qualified",
    contact_id="contact-uuid",
    value=850000,
    probability=75,
    expected_close_date=date(2025, 12, 31),
    notes="High-priority client referral"
)
```

### Update Deal

```python
# Update stage
client.deals.update("deal-uuid", stage="closed", probability=90)

# Mark as won
client.deals.mark_won("deal-uuid")

# Mark as lost
client.deals.mark_lost("deal-uuid", reason="Client chose competitor")
```

---

## Tasks API

### List Tasks

```python
# All tasks
tasks = client.tasks.list()

# Filter by status and priority
urgent_tasks = client.tasks.list(
    status="pending",
    priority="high",
    order="due_date.asc"
)

# Get overdue tasks
overdue = client.tasks.get_overdue(limit=10)
```

### Create Task

```python
from datetime import date

task = client.tasks.create(
    title="Follow up with client",
    description="Discuss property viewing schedule",
    contact_id="contact-uuid",
    deal_id="deal-uuid",
    due_date=date(2025, 11, 15),
    due_time="14:30:00",
    priority="high"
)
```

### Update Task

```python
# Update task
client.tasks.update(
    "task-uuid",
    priority="urgent",
    due_date=date(2025, 11, 12)
)

# Mark as completed
client.tasks.complete("task-uuid")
```

---

## Properties API

### List Properties

```python
# All properties
properties = client.properties.list()

# Filter by type and location
condos = client.properties.list(
    property_type="condo",
    city="Toronto",
    price__gte=500000,
    bedrooms__gte=2,
    status="active"
)
```

### Create Property

```python
property_listing = client.properties.create(
    title="Luxury Downtown Condo",
    description="Stunning 2BR with panoramic city views",
    address="123 Main St, Unit 1502",
    city="Toronto",
    province="ON",
    postal_code="M5H 2N2",
    property_type="condo",
    listing_type="sale",
    price=850000,
    bedrooms=2,
    bathrooms=2,
    square_feet=1200,
    features=["parking", "gym", "concierge", "rooftop_terrace"]
)
```

### Update Property

```python
# Update price and status
client.properties.update(
    "property-uuid",
    price=825000,
    status="pending"
)

# Mark as sold
client.properties.mark_sold("property-uuid")
```

---

## Edge Functions

### Check Subscription

```python
status = client.edge_functions.check_subscription()
print(f"Subscribed: {status['subscribed']}")
```

### Calculate Lead Score

```python
score_data = client.edge_functions.calculate_lead_score("contact-uuid")
print(f"Score: {score_data['score']}")
print(f"Factors: {score_data['factors']}")
print(f"Confidence: {score_data['confidence']}")
```

### AI Chat

```python
# Claude AI
response = client.edge_functions.claude_chat(
    "How can I improve my lead conversion rate?"
)
print(response['response'])

# Chatbot
response = client.edge_functions.ai_chatbot(
    message="What services do you offer?",
    context="real estate"
)
```

### Email Automation

```python
client.edge_functions.trigger_email_automation(
    contact_id="contact-uuid",
    automation_type="follow_up"
)
```

### HubSpot Sync

```python
result = client.edge_functions.sync_hubspot(
    contact_id="contact-uuid",
    action="sync"
)
```

### Stripe Integration

```python
# Create checkout
checkout = client.edge_functions.create_checkout(
    price_id="price_xxx",
    tier="pro"
)
print(f"Checkout URL: {checkout['url']}")

# Get customer portal
portal = client.edge_functions.get_customer_portal()
print(f"Portal URL: {portal['url']}")
```

---

## Error Handling

```python
from realtordesk_sdk import (
    AuthenticationError,
    ValidationError,
    NotFoundError,
    RateLimitError,
    APIError
)

try:
    contact = client.contacts.create(
        first_name="John",
        email="invalid-email"  # Invalid format
    )
except ValidationError as e:
    print(f"Validation error: {e}")
except AuthenticationError as e:
    print(f"Auth error: {e}")
except RateLimitError as e:
    print(f"Rate limit exceeded: {e}")
    # Wait and retry
except NotFoundError as e:
    print(f"Not found: {e}")
except APIError as e:
    print(f"API error: {e}")
```

---

## Advanced Filtering

The SDK supports PostgREST query operators:

```python
# Operators
contacts = client.contacts.list(
    lead_score__gte=70,           # Greater than or equal
    lead_score__lt=90,            # Less than
    email__contains="gmail",      # Substring match
    status__in=["lead", "active"] # In list
)

# Combining filters
high_value = client.deals.list(
    stage="negotiation",
    value__gte=500000,
    probability__gte=70,
    order="value.desc"
)

# Date filtering
from datetime import date
overdue = client.tasks.list(
    status="pending",
    due_date__lt=date.today()
)
```

---

## Pagination

```python
# First page
page1 = client.contacts.list(limit=20, offset=0)

# Second page
page2 = client.contacts.list(limit=20, offset=20)

# Iterator pattern
def iter_contacts(client, limit=20):
    """Iterate through all contacts."""
    offset = 0
    while True:
        batch = client.contacts.list(limit=limit, offset=offset)
        if not batch:
            break
        for contact in batch:
            yield contact
        offset += limit

for contact in iter_contacts(client):
    print(contact['email'])
```

---

## Automatic Retry

The SDK automatically retries failed requests with exponential backoff:

```python
# Automatic retry on:
# - Network errors
# - 429 Rate limit (with backoff)
# - 500+ Server errors

client = RealtorDeskClient(
    jwt_token="token",
    max_retries=5  # Increase retry attempts
)
```

---

## Context Manager

```python
# Automatically closes connection
with RealtorDeskClient(jwt_token="token") as client:
    contacts = client.contacts.list()
    # Connection closed after block
```

---

## Complete Workflow Example

```python
from datetime import date
from realtordesk_sdk import RealtorDeskClient

# Initialize
client = RealtorDeskClient(jwt_token="your_jwt_token")

# 1. Create contact
contact = client.contacts.create(
    first_name="Jane",
    last_name="Smith",
    email="jane.smith@example.com",
    phone="+19876543210",
    source="referral",
    status="lead"
)
contact_id = contact['id']

# 2. Calculate AI lead score
score = client.edge_functions.calculate_lead_score(contact_id)
print(f"Lead score: {score['score']}")

# 3. Update contact with score
client.contacts.update(contact_id, lead_score=score['score'])

# 4. Create deal
deal = client.deals.create(
    title="Luxury Home Purchase",
    stage="qualified",
    contact_id=contact_id,
    value=1200000,
    probability=60,
    expected_close_date=date(2025, 12, 31)
)
deal_id = deal['id']

# 5. Create follow-up task
task = client.tasks.create(
    title="Schedule property viewing",
    contact_id=contact_id,
    deal_id=deal_id,
    due_date=date(2025, 11, 15),
    priority="high"
)

# 6. Trigger email automation
client.edge_functions.trigger_email_automation(
    contact_id=contact_id,
    automation_type="follow_up"
)

print("Workflow complete!")
```

---

## Testing

```python
# Use the SDK in your tests
import unittest
from realtordesk_sdk import RealtorDeskClient

class TestContactAPI(unittest.TestCase):
    def setUp(self):
        self.client = RealtorDeskClient(jwt_token="test_token")
    
    def tearDown(self):
        self.client.close()
    
    def test_create_contact(self):
        contact = self.client.contacts.create(
            first_name="Test",
            email="test@example.com"
        )
        self.assertIsNotNone(contact['id'])
```

---

## Best Practices

1. **Use context managers** for automatic cleanup
2. **Handle exceptions** appropriately
3. **Set reasonable timeouts** for your use case
4. **Use pagination** for large datasets
5. **Cache JWT tokens** (they last 1 hour)
6. **Log errors** for debugging
7. **Test with mock data** first

---

## Support

- **Documentation:** See `API_DOCUMENTATION.md`
- **OpenAPI Spec:** See `openapi.yaml`
- **Test Suite:** See `test_*.py` files
