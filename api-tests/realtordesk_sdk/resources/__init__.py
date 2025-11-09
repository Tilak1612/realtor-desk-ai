"""Resource managers for API endpoints."""

from .contacts import ContactsAPI
from .deals import DealsAPI
from .tasks import TasksAPI
from .properties import PropertiesAPI
from .edge_functions import EdgeFunctionsAPI

__all__ = [
    "ContactsAPI",
    "DealsAPI",
    "TasksAPI",
    "PropertiesAPI",
    "EdgeFunctionsAPI",
]
