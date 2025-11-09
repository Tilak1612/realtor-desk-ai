"""Custom exceptions for RealtorDesk SDK."""


class RealtorDeskError(Exception):
    """Base exception for all RealtorDesk SDK errors."""
    pass


class AuthenticationError(RealtorDeskError):
    """Raised when authentication fails (401)."""
    pass


class ValidationError(RealtorDeskError):
    """Raised when request validation fails (400)."""
    pass


class NotFoundError(RealtorDeskError):
    """Raised when a resource is not found (404)."""
    pass


class RateLimitError(RealtorDeskError):
    """Raised when rate limit is exceeded (429)."""
    pass


class APIError(RealtorDeskError):
    """Raised for general API errors."""
    pass
