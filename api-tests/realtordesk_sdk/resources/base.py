"""Base resource class."""

from typing import Dict, Any, Optional, List


class BaseResource:
    """Base class for all API resources."""
    
    def __init__(self, http_client):
        self._client = http_client
    
    def _build_filter(self, **kwargs) -> Dict[str, str]:
        """
        Build query filter parameters.
        
        Example:
            >>> _build_filter(status="lead", email__contains="gmail")
            {'status': 'eq.lead', 'email': '~gmail'}
        """
        params = {}
        
        for key, value in kwargs.items():
            if value is None:
                continue
            
            # Handle special operators
            if "__" in key:
                field, operator = key.rsplit("__", 1)
                operator_map = {
                    "eq": "eq",
                    "neq": "neq",
                    "gt": "gt",
                    "gte": "gte",
                    "lt": "lt",
                    "lte": "lte",
                    "contains": "~",
                    "like": "like",
                    "ilike": "ilike",
                    "in": "in",
                }
                op = operator_map.get(operator, "eq")
                
                if op == "in" and isinstance(value, (list, tuple)):
                    value = f"({','.join(str(v) for v in value)})"
                
                params[field] = f"{op}.{value}"
            else:
                # Default to equality
                params[key] = f"eq.{value}"
        
        return params
    
    def _extract_pagination(self, kwargs: Dict) -> tuple:
        """Extract pagination parameters."""
        limit = kwargs.pop("limit", None)
        offset = kwargs.pop("offset", None)
        order = kwargs.pop("order", None)
        
        params = {}
        if limit:
            params["limit"] = limit
        if offset:
            params["offset"] = offset
        if order:
            params["order"] = order
        
        return params
