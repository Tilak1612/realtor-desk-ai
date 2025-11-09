"""Properties API resource."""

from typing import List, Optional, Dict, Any
from .base import BaseResource


class PropertiesAPI(BaseResource):
    """
    Property listing management API.
    
    Example:
        >>> client.properties.list(property_type="condo", city="Toronto")
        >>> client.properties.create(title="Luxury Condo", address="123 Main St")
        >>> client.properties.update("property-id", price=850000, status="sold")
    """
    
    def list(
        self,
        property_type: Optional[str] = None,
        listing_type: Optional[str] = None,
        status: Optional[str] = None,
        city: Optional[str] = None,
        province: Optional[str] = None,
        price__gte: Optional[float] = None,
        price__lte: Optional[float] = None,
        bedrooms__gte: Optional[int] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        order: str = "created_at.desc",
        **filters
    ) -> List[Dict[str, Any]]:
        """
        List property listings with optional filtering.
        
        Args:
            property_type: Filter by type (house, condo, apartment, townhouse, land)
            listing_type: Filter by listing type (sale, rent)
            status: Filter by status (active, pending, sold, inactive)
            city: Filter by city
            province: Filter by province
            price__gte: Minimum price
            price__lte: Maximum price
            bedrooms__gte: Minimum bedrooms
            limit: Maximum number of records
            offset: Number of records to skip
            order: Sort order
            **filters: Additional filters
            
        Returns:
            List of property dictionaries
        """
        params = self._extract_pagination({"limit": limit, "offset": offset, "order": order})
        
        filters.update({
            "property_type": property_type,
            "listing_type": listing_type,
            "status": status,
            "city": city,
            "province": province,
            "price__gte": price__gte,
            "price__lte": price__lte,
            "bedrooms__gte": bedrooms__gte,
        })
        params.update(self._build_filter(**filters))
        
        return self._client.request("GET", "property_listings", params=params)
    
    def get(self, property_id: str) -> Dict[str, Any]:
        """Get a single property by ID."""
        params = {"id": f"eq.{property_id}"}
        result = self._client.request("GET", "property_listings", params=params)
        
        if not result:
            from ..exceptions import NotFoundError
            raise NotFoundError(f"Property {property_id} not found")
        
        return result[0]
    
    def create(
        self,
        title: str,
        address: str,
        description: Optional[str] = None,
        city: Optional[str] = None,
        province: Optional[str] = None,
        postal_code: Optional[str] = None,
        property_type: Optional[str] = None,
        listing_type: str = "sale",
        price: Optional[float] = None,
        bedrooms: Optional[int] = None,
        bathrooms: Optional[float] = None,
        square_feet: Optional[int] = None,
        features: Optional[List[str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create a new property listing.
        
        Args:
            title: Property title
            address: Street address
            description: Property description
            city: City
            province: Province/State
            postal_code: Postal/ZIP code
            property_type: Type (house, condo, apartment, townhouse, land)
            listing_type: Listing type (sale, rent)
            price: Listing price
            bedrooms: Number of bedrooms
            bathrooms: Number of bathrooms
            square_feet: Property size in square feet
            features: List of features
            **kwargs: Additional fields
            
        Returns:
            Created property dictionary
        """
        data = {
            "title": title,
            "address": address,
            "description": description,
            "city": city,
            "province": province,
            "postal_code": postal_code,
            "property_type": property_type,
            "listing_type": listing_type,
            "price": price,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "square_feet": square_feet,
            "features": features or [],
            **kwargs
        }
        
        data = {k: v for k, v in data.items() if v is not None}
        
        result = self._client.request(
            "POST",
            "property_listings",
            json=data,
            prefer="return=representation"
        )
        return result[0] if result else {}
    
    def update(self, property_id: str, **kwargs) -> Dict[str, Any]:
        """Update a property listing."""
        params = {"id": f"eq.{property_id}"}
        result = self._client.request(
            "PATCH",
            "property_listings",
            params=params,
            json=kwargs,
            prefer="return=representation"
        )
        return result[0] if result else {}
    
    def delete(self, property_id: str) -> None:
        """Delete a property listing."""
        params = {"id": f"eq.{property_id}"}
        self._client.request("DELETE", "property_listings", params=params)
    
    def mark_sold(self, property_id: str) -> Dict[str, Any]:
        """Mark a property as sold."""
        return self.update(property_id, status="sold")
    
    def mark_pending(self, property_id: str) -> Dict[str, Any]:
        """Mark a property as pending."""
        return self.update(property_id, status="pending")
