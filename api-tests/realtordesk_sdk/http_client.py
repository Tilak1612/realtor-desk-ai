"""HTTP client with retry logic and error handling."""

import time
import requests
from typing import Any, Dict, Optional, Union
from .exceptions import (
    AuthenticationError,
    ValidationError,
    NotFoundError,
    RateLimitError,
    APIError
)


class HTTPClient:
    """HTTP client with automatic retry and error handling."""
    
    def __init__(
        self,
        jwt_token: str,
        anon_key: str,
        base_url: str,
        timeout: int = 30,
        max_retries: int = 3,
    ):
        self.base_url = base_url.rstrip("/")
        self.rest_url = f"{self.base_url}/rest/v1"
        self.functions_url = f"{self.base_url}/functions/v1"
        self.timeout = timeout
        self.max_retries = max_retries
        
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {jwt_token}",
            "apikey": anon_key,
            "Content-Type": "application/json",
        })
    
    def request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
        prefer: Optional[str] = None,
        is_function: bool = False,
    ) -> Union[Dict, list, None]:
        """
        Make an HTTP request with automatic retry logic.
        
        Args:
            method: HTTP method (GET, POST, PATCH, DELETE)
            endpoint: API endpoint path
            params: Query parameters
            json: JSON request body
            prefer: Prefer header value (e.g., "return=representation")
            is_function: Whether this is an edge function call
            
        Returns:
            Response data as dict/list or None for 204 responses
            
        Raises:
            AuthenticationError: 401 authentication failed
            ValidationError: 400 validation error
            NotFoundError: 404 resource not found
            RateLimitError: 429 rate limit exceeded
            APIError: Other API errors
        """
        base = self.functions_url if is_function else self.rest_url
        url = f"{base}/{endpoint.lstrip('/')}"
        
        headers = {}
        if prefer:
            headers["Prefer"] = prefer
        
        for attempt in range(self.max_retries):
            try:
                response = self.session.request(
                    method=method,
                    url=url,
                    params=params,
                    json=json,
                    headers=headers,
                    timeout=self.timeout,
                )
                
                # Handle successful responses
                if response.status_code == 204:
                    return None
                
                if 200 <= response.status_code < 300:
                    if response.content:
                        return response.json()
                    return None
                
                # Handle errors
                self._handle_error(response, attempt)
                
            except requests.exceptions.Timeout:
                if attempt == self.max_retries - 1:
                    raise APIError(f"Request timeout after {self.timeout}s")
                time.sleep(self._backoff_delay(attempt))
                
            except requests.exceptions.ConnectionError:
                if attempt == self.max_retries - 1:
                    raise APIError("Connection error")
                time.sleep(self._backoff_delay(attempt))
    
    def _handle_error(self, response: requests.Response, attempt: int):
        """Handle HTTP error responses."""
        status = response.status_code
        
        try:
            error_data = response.json()
            message = error_data.get("message", response.text)
        except:
            message = response.text
        
        # Authentication error
        if status == 401:
            raise AuthenticationError("Invalid or expired JWT token")
        
        # Validation error
        if status == 400:
            raise ValidationError(message)
        
        # Not found
        if status == 404:
            raise NotFoundError(message)
        
        # Rate limit - retry with backoff
        if status == 429:
            if attempt < self.max_retries - 1:
                delay = self._backoff_delay(attempt)
                time.sleep(delay)
                return
            raise RateLimitError("Rate limit exceeded. Try again later.")
        
        # Server errors - retry
        if 500 <= status < 600:
            if attempt < self.max_retries - 1:
                time.sleep(self._backoff_delay(attempt))
                return
            raise APIError(f"Server error: {message}")
        
        # Other errors
        raise APIError(f"API error ({status}): {message}")
    
    def _backoff_delay(self, attempt: int) -> float:
        """Calculate exponential backoff delay."""
        return min(2 ** attempt, 10)  # Max 10 seconds
    
    def close(self):
        """Close the session."""
        self.session.close()
