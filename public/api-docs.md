# RealtorDesk AI Public API Documentation

## Overview
RealtorDesk AI provides a RESTful API for Canadian real estate professionals to integrate CRM functionality into their existing workflows.

## Base URL
```
https://api.realtordesk.ai/v1
```

## Authentication
All API requests require an API key passed in the header:
```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Contacts
- `GET /contacts` - List all contacts
- `POST /contacts` - Create new contact
- `GET /contacts/:id` - Get specific contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

### Leads
- `GET /leads` - List all leads
- `POST /leads` - Create new lead
- `PUT /leads/:id` - Update lead status

### Properties
- `GET /properties` - List properties (CREA DDF)
- `GET /properties/:id` - Get property details

### AI Assistant
- `POST /ai/chat` - Send message to AI assistant
- `GET /ai/conversations` - List AI conversations

## Rate Limits
- 1000 requests per hour per API key
- Contact support for higher limits

## SDKs
- Node.js: `npm install @realtordesk/api`
- Python: `pip install realtordesk-api`
- PHP: Coming soon

## Support
- Documentation: https://docs.realtordesk.ai
- Support: support@realtordesk.ai
