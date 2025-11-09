"""Deals API resource."""

from typing import List, Optional, Dict, Any
from datetime import date
from .base import BaseResource


class DealsAPI(BaseResource):
    """
    Deal pipeline management API.
    
    Example:
        >>> client.deals.list(stage="negotiation")
        >>> client.deals.create(title="New Deal", stage="lead", value=500000)
        >>> client.deals.update("deal-id", stage="closed", status="won")
    """
    
    def list(
        self,
        stage: Optional[str] = None,
        status: Optional[str] = None,
        value__gte: Optional[float] = None,
        value__lte: Optional[float] = None,
        contact_id: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        order: str = "created_at.desc",
        **filters
    ) -> List[Dict[str, Any]]:
        """
        List deals with optional filtering.
        
        Args:
            stage: Filter by stage (lead, qualified, negotiation, closed)
            status: Filter by status (active, won, lost)
            value__gte: Minimum deal value
            value__lte: Maximum deal value
            contact_id: Filter by contact ID
            limit: Maximum number of records
            offset: Number of records to skip
            order: Sort order
            **filters: Additional filters
            
        Returns:
            List of deal dictionaries
        """
        params = self._extract_pagination({"limit": limit, "offset": offset, "order": order})
        
        filters.update({
            "stage": stage,
            "status": status,
            "value__gte": value__gte,
            "value__lte": value__lte,
            "contact_id": contact_id,
        })
        params.update(self._build_filter(**filters))
        
        return self._client.request("GET", "deals", params=params)
    
    def get(self, deal_id: str) -> Dict[str, Any]:
        """Get a single deal by ID."""
        params = {"id": f"eq.{deal_id}"}
        result = self._client.request("GET", "deals", params=params)
        
        if not result:
            from ..exceptions import NotFoundError
            raise NotFoundError(f"Deal {deal_id} not found")
        
        return result[0]
    
    def create(
        self,
        title: str,
        stage: str,
        contact_id: Optional[str] = None,
        value: Optional[float] = None,
        probability: int = 50,
        expected_close_date: Optional[date] = None,
        notes: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create a new deal.
        
        Args:
            title: Deal title
            stage: Deal stage (lead, qualified, negotiation, closed)
            contact_id: Associated contact UUID
            value: Deal value
            probability: Win probability (0-100)
            expected_close_date: Expected close date
            notes: Additional notes
            **kwargs: Additional fields
            
        Returns:
            Created deal dictionary
        """
        data = {
            "title": title,
            "stage": stage,
            "contact_id": contact_id,
            "value": value,
            "probability": probability,
            "expected_close_date": expected_close_date.isoformat() if expected_close_date else None,
            "notes": notes,
            **kwargs
        }
        
        data = {k: v for k, v in data.items() if v is not None}
        
        result = self._client.request(
            "POST",
            "deals",
            json=data,
            prefer="return=representation"
        )
        return result[0] if result else {}
    
    def update(self, deal_id: str, **kwargs) -> Dict[str, Any]:
        """Update a deal."""
        if "expected_close_date" in kwargs and isinstance(kwargs["expected_close_date"], date):
            kwargs["expected_close_date"] = kwargs["expected_close_date"].isoformat()
        
        params = {"id": f"eq.{deal_id}"}
        result = self._client.request(
            "PATCH",
            "deals",
            params=params,
            json=kwargs,
            prefer="return=representation"
        )
        return result[0] if result else {}
    
    def delete(self, deal_id: str) -> None:
        """Delete a deal."""
        params = {"id": f"eq.{deal_id}"}
        self._client.request("DELETE", "deals", params=params)
    
    def mark_won(self, deal_id: str) -> Dict[str, Any]:
        """Mark a deal as won."""
        return self.update(deal_id, stage="closed", status="won", probability=100)
    
    def mark_lost(self, deal_id: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """Mark a deal as lost."""
        updates = {"stage": "closed", "status": "lost", "probability": 0}
        if reason:
            updates["notes"] = reason
        return self.update(deal_id, **updates)
