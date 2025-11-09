"""Main client for RealtorDesk AI API."""

from typing import Optional
from .resources.contacts import ContactsAPI
from .resources.deals import DealsAPI
from .resources.tasks import TasksAPI
from .resources.properties import PropertiesAPI
from .resources.edge_functions import EdgeFunctionsAPI
from .http_client import HTTPClient


class RealtorDeskClient:
    """
    Main client for interacting with the RealtorDesk AI API.
    
    Example:
        >>> client = RealtorDeskClient(
        ...     jwt_token="your_jwt_token",
        ...     anon_key="your_anon_key"
        ... )
        >>> 
        >>> # Use resource managers
        >>> contacts = client.contacts.list()
        >>> deals = client.deals.list(stage="negotiation")
        >>> tasks = client.tasks.list(status="pending")
    
    Attributes:
        contacts: Contact management API
        deals: Deal pipeline management API
        tasks: Task management API
        properties: Property listing management API
        edge_functions: Edge functions API
    """
    
    def __init__(
        self,
        jwt_token: str,
        anon_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U",
        base_url: str = "https://pseqajrtcgiphfnworii.supabase.co",
        timeout: int = 30,
        max_retries: int = 3,
    ):
        """
        Initialize the RealtorDesk AI client.
        
        Args:
            jwt_token: JWT authentication token from login
            anon_key: Supabase anonymous key (default provided)
            base_url: API base URL (default: production)
            timeout: Request timeout in seconds (default: 30)
            max_retries: Maximum retry attempts (default: 3)
        """
        self._http_client = HTTPClient(
            jwt_token=jwt_token,
            anon_key=anon_key,
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
        )
        
        # Initialize resource managers
        self.contacts = ContactsAPI(self._http_client)
        self.deals = DealsAPI(self._http_client)
        self.tasks = TasksAPI(self._http_client)
        self.properties = PropertiesAPI(self._http_client)
        self.edge_functions = EdgeFunctionsAPI(self._http_client)
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
    
    def close(self):
        """Close the HTTP client session."""
        self._http_client.close()
    
    def __repr__(self) -> str:
        return f"<RealtorDeskClient base_url={self._http_client.base_url}>"
