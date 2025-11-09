"""
RealtorDesk AI Python SDK

A Pythonic client library for the RealtorDesk AI CRM API.

Example:
    >>> from realtordesk_sdk import RealtorDeskClient
    >>> 
    >>> client = RealtorDeskClient(
    ...     jwt_token="your_jwt_token",
    ...     anon_key="your_anon_key"
    ... )
    >>> 
    >>> # List contacts
    >>> contacts = client.contacts.list(status="lead", limit=10)
    >>> 
    >>> # Create a new contact
    >>> contact = client.contacts.create(
    ...     first_name="John",
    ...     last_name="Doe",
    ...     email="john@example.com"
    ... )
    >>> 
    >>> # Update contact
    >>> client.contacts.update(contact.id, status="client", lead_score=85)
    >>> 
    >>> # Delete contact
    >>> client.contacts.delete(contact.id)
"""

from .client import RealtorDeskClient
from .exceptions import (
    RealtorDeskError,
    AuthenticationError,
    ValidationError,
    NotFoundError,
    RateLimitError,
    APIError
)
from .models import Contact, Deal, Task, Property

__version__ = "1.0.0"
__author__ = "RealtorDesk AI"

__all__ = [
    "RealtorDeskClient",
    "RealtorDeskError",
    "AuthenticationError",
    "ValidationError",
    "NotFoundError",
    "RateLimitError",
    "APIError",
    "Contact",
    "Deal",
    "Task",
    "Property",
]
