"""Contacts API resource."""

from typing import List, Optional, Dict, Any
from .base import BaseResource
from ..models import Contact


class ContactsAPI(BaseResource):
    """
    Contact management API.
    
    Example:
        >>> client.contacts.list(status="lead", limit=10)
        >>> client.contacts.get("contact-id")
        >>> client.contacts.create(first_name="John", email="john@example.com")
        >>> client.contacts.update("contact-id", status="client")
        >>> client.contacts.delete("contact-id")
    """
    
    def list(
        self,
        status: Optional[str] = None,
        email__contains: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        order: str = "created_at.desc",
        **filters
    ) -> List[Dict[str, Any]]:
        """
        List contacts with optional filtering.
        
        Args:
            status: Filter by status (lead, active, client, inactive)
            email__contains: Filter by email substring
            limit: Maximum number of records
            offset: Number of records to skip
            order: Sort order (e.g., "created_at.desc")
            **filters: Additional filters (e.g., lead_score__gte=70)
            
        Returns:
            List of contact dictionaries
        """
        params = self._extract_pagination({"limit": limit, "offset": offset, "order": order})
        
        filters.update({
            "status": status,
            "email__contains": email__contains,
        })
        params.update(self._build_filter(**filters))
        
        return self._client.request("GET", "contacts", params=params)
    
    def get(self, contact_id: str) -> Dict[str, Any]:
        """
        Get a single contact by ID.
        
        Args:
            contact_id: Contact UUID
            
        Returns:
            Contact dictionary
        """
        params = {"id": f"eq.{contact_id}"}
        result = self._client.request("GET", "contacts", params=params)
        
        if not result:
            from ..exceptions import NotFoundError
            raise NotFoundError(f"Contact {contact_id} not found")
        
        return result[0]
    
    def create(
        self,
        first_name: str,
        email: str,
        last_name: Optional[str] = None,
        phone: Optional[str] = None,
        source: Optional[str] = None,
        tags: Optional[List[str]] = None,
        status: str = "lead",
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create a new contact.
        
        Args:
            first_name: Contact's first name
            email: Contact's email address
            last_name: Contact's last name
            phone: Contact's phone number
            source: Lead source
            tags: List of tags
            status: Contact status (default: "lead")
            **kwargs: Additional fields
            
        Returns:
            Created contact dictionary
        """
        data = {
            "first_name": first_name,
            "email": email,
            "last_name": last_name,
            "phone": phone,
            "source": source,
            "tags": tags or [],
            "status": status,
            **kwargs
        }
        
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}
        
        result = self._client.request(
            "POST",
            "contacts",
            json=data,
            prefer="return=representation"
        )
        return result[0] if result else {}
    
    def update(self, contact_id: str, **kwargs) -> Dict[str, Any]:
        """
        Update a contact.
        
        Args:
            contact_id: Contact UUID
            **kwargs: Fields to update
            
        Returns:
            Updated contact dictionary
        """
        params = {"id": f"eq.{contact_id}"}
        result = self._client.request(
            "PATCH",
            "contacts",
            params=params,
            json=kwargs,
            prefer="return=representation"
        )
        return result[0] if result else {}
    
    def delete(self, contact_id: str) -> None:
        """
        Delete a contact.
        
        Args:
            contact_id: Contact UUID
        """
        params = {"id": f"eq.{contact_id}"}
        self._client.request("DELETE", "contacts", params=params)
    
    def search(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search contacts by name or email.
        
        Args:
            query: Search query
            limit: Maximum results
            
        Returns:
            List of matching contacts
        """
        params = {
            "or": f"(first_name.ilike.*{query}*,last_name.ilike.*{query}*,email.ilike.*{query}*)",
            "limit": limit
        }
        return self._client.request("GET", "contacts", params=params)
