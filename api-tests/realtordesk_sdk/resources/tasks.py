"""Tasks API resource."""

from typing import List, Optional, Dict, Any
from datetime import date, datetime
from .base import BaseResource


class TasksAPI(BaseResource):
    """
    Task management API.
    
    Example:
        >>> client.tasks.list(status="pending", priority="high")
        >>> client.tasks.create(title="Follow up", due_date="2025-11-15")
        >>> client.tasks.complete("task-id")
    """
    
    def list(
        self,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        contact_id: Optional[str] = None,
        deal_id: Optional[str] = None,
        due_date__lt: Optional[date] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        order: str = "due_date.asc",
        **filters
    ) -> List[Dict[str, Any]]:
        """
        List tasks with optional filtering.
        
        Args:
            status: Filter by status (pending, in_progress, completed, cancelled)
            priority: Filter by priority (low, medium, high, urgent)
            contact_id: Filter by contact ID
            deal_id: Filter by deal ID
            due_date__lt: Tasks due before this date
            limit: Maximum number of records
            offset: Number of records to skip
            order: Sort order
            **filters: Additional filters
            
        Returns:
            List of task dictionaries
        """
        params = self._extract_pagination({"limit": limit, "offset": offset, "order": order})
        
        filters.update({
            "status": status,
            "priority": priority,
            "contact_id": contact_id,
            "deal_id": deal_id,
            "due_date__lt": due_date__lt.isoformat() if due_date__lt else None,
        })
        params.update(self._build_filter(**filters))
        
        return self._client.request("GET", "tasks", params=params)
    
    def get(self, task_id: str) -> Dict[str, Any]:
        """Get a single task by ID."""
        params = {"id": f"eq.{task_id}"}
        result = self._client.request("GET", "tasks", params=params)
        
        if not result:
            from ..exceptions import NotFoundError
            raise NotFoundError(f"Task {task_id} not found")
        
        return result[0]
    
    def create(
        self,
        title: str,
        description: Optional[str] = None,
        contact_id: Optional[str] = None,
        deal_id: Optional[str] = None,
        due_date: Optional[date] = None,
        due_time: Optional[str] = None,
        priority: str = "medium",
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create a new task.
        
        Args:
            title: Task title
            description: Task description
            contact_id: Associated contact UUID
            deal_id: Associated deal UUID
            due_date: Due date
            due_time: Due time (HH:MM:SS format)
            priority: Priority level (low, medium, high, urgent)
            **kwargs: Additional fields
            
        Returns:
            Created task dictionary
        """
        data = {
            "title": title,
            "description": description,
            "contact_id": contact_id,
            "deal_id": deal_id,
            "due_date": due_date.isoformat() if due_date else None,
            "due_time": due_time,
            "priority": priority,
            **kwargs
        }
        
        data = {k: v for k, v in data.items() if v is not None}
        
        result = self._client.request(
            "POST",
            "tasks",
            json=data,
            prefer="return=representation"
        )
        return result[0] if result else {}
    
    def update(self, task_id: str, **kwargs) -> Dict[str, Any]:
        """Update a task."""
        if "due_date" in kwargs and isinstance(kwargs["due_date"], date):
            kwargs["due_date"] = kwargs["due_date"].isoformat()
        
        params = {"id": f"eq.{task_id}"}
        result = self._client.request(
            "PATCH",
            "tasks",
            params=params,
            json=kwargs,
            prefer="return=representation"
        )
        return result[0] if result else {}
    
    def delete(self, task_id: str) -> None:
        """Delete a task."""
        params = {"id": f"eq.{task_id}"}
        self._client.request("DELETE", "tasks", params=params)
    
    def complete(self, task_id: str) -> Dict[str, Any]:
        """Mark a task as completed."""
        return self.update(
            task_id,
            status="completed",
            completed_at=datetime.utcnow().isoformat()
        )
    
    def get_overdue(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get overdue pending tasks."""
        today = date.today().isoformat()
        return self.list(
            status="pending",
            due_date__lt=date.today(),
            order="due_date.asc",
            limit=limit
        )
