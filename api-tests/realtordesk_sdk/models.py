"""Data models for API responses."""

from typing import Optional, List, Dict, Any
from datetime import datetime, date
from dataclasses import dataclass, field


@dataclass
class Contact:
    """Contact model."""
    id: str
    user_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    status: str = "lead"
    lead_score: int = 0
    best_contact_time: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @property
    def full_name(self) -> str:
        """Get full name."""
        parts = [self.first_name, self.last_name]
        return " ".join(p for p in parts if p)


@dataclass
class Deal:
    """Deal model."""
    id: str
    user_id: str
    title: str
    stage: str
    contact_id: Optional[str] = None
    value: Optional[float] = None
    probability: int = 50
    expected_close_date: Optional[date] = None
    status: str = "active"
    notes: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @property
    def weighted_value(self) -> float:
        """Calculate weighted value based on probability."""
        if self.value is None:
            return 0.0
        return self.value * (self.probability / 100)


@dataclass
class Task:
    """Task model."""
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    contact_id: Optional[str] = None
    deal_id: Optional[str] = None
    due_date: Optional[date] = None
    due_time: Optional[str] = None
    priority: str = "medium"
    status: str = "pending"
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @property
    def is_completed(self) -> bool:
        """Check if task is completed."""
        return self.status == "completed"
    
    @property
    def is_overdue(self) -> bool:
        """Check if task is overdue."""
        if self.due_date and not self.is_completed:
            return self.due_date < date.today()
        return False


@dataclass
class Property:
    """Property listing model."""
    id: str
    user_id: str
    title: str
    address: str
    description: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    property_type: Optional[str] = None
    listing_type: str = "sale"
    price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None
    status: str = "active"
    features: List[str] = field(default_factory=list)
    images: List[str] = field(default_factory=list)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @property
    def price_per_sqft(self) -> Optional[float]:
        """Calculate price per square foot."""
        if self.price and self.square_feet:
            return self.price / self.square_feet
        return None
    
    @property
    def full_address(self) -> str:
        """Get full formatted address."""
        parts = [self.address, self.city, self.province, self.postal_code]
        return ", ".join(p for p in parts if p)
