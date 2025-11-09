"""Edge Functions API resource."""

from typing import Dict, Any, Optional
from .base import BaseResource


class EdgeFunctionsAPI(BaseResource):
    """
    Edge Functions API for serverless backend operations.
    
    Example:
        >>> client.edge_functions.check_subscription()
        >>> client.edge_functions.calculate_lead_score("contact-id")
        >>> client.edge_functions.send_welcome_email("user-id")
    """
    
    def check_subscription(self) -> Dict[str, Any]:
        """Check user's subscription status."""
        return self._client.request(
            "POST",
            "check-subscription",
            json={},
            is_function=True
        )
    
    def calculate_lead_score(self, contact_id: str) -> Dict[str, Any]:
        """
        Calculate AI-powered lead score for a contact.
        
        Args:
            contact_id: Contact UUID
            
        Returns:
            Lead score data with factors and confidence
        """
        return self._client.request(
            "POST",
            "lead-score-calculator",
            json={"contactId": contact_id},
            is_function=True
        )
    
    def claude_chat(self, message: str) -> Dict[str, Any]:
        """
        Get AI response from Claude.
        
        Args:
            message: User message
            
        Returns:
            AI response
        """
        return self._client.request(
            "POST",
            "claude-chat",
            json={"message": message},
            is_function=True
        )
    
    def ai_chatbot(self, message: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Get chatbot response.
        
        Args:
            message: User message
            context: Optional context
            
        Returns:
            Chatbot response
        """
        data = {"message": message}
        if context:
            data["context"] = context
        
        return self._client.request(
            "POST",
            "ai-chatbot",
            json=data,
            is_function=True
        )
    
    def encrypt_token(self, token: str, provider: str) -> Dict[str, Any]:
        """
        Encrypt an integration token.
        
        Args:
            token: API token to encrypt
            provider: Provider name (e.g., "hubspot")
            
        Returns:
            Encrypted token data
        """
        return self._client.request(
            "POST",
            "encrypt-integration-token",
            json={"token": token, "provider": provider},
            is_function=True
        )
    
    def trigger_email_automation(
        self,
        contact_id: str,
        automation_type: str
    ) -> Dict[str, Any]:
        """
        Trigger email automation for a contact.
        
        Args:
            contact_id: Contact UUID
            automation_type: Type of automation (e.g., "follow_up")
            
        Returns:
            Automation status
        """
        return self._client.request(
            "POST",
            "email-automation",
            json={"contactId": contact_id, "type": automation_type},
            is_function=True
        )
    
    def sync_hubspot(self, contact_id: str, action: str = "sync") -> Dict[str, Any]:
        """
        Sync contact with HubSpot.
        
        Args:
            contact_id: Contact UUID
            action: Sync action
            
        Returns:
            Sync status
        """
        return self._client.request(
            "POST",
            "hubspot-sync",
            json={"contactId": contact_id, "action": action},
            is_function=True
        )
    
    def send_welcome_email(self, user_id: str) -> Dict[str, Any]:
        """
        Send welcome email to new user.
        
        Args:
            user_id: User UUID
            
        Returns:
            Email send status
        """
        return self._client.request(
            "POST",
            "send-welcome-email",
            json={"userId": user_id},
            is_function=True
        )
    
    def create_checkout(self, price_id: str, tier: str) -> Dict[str, Any]:
        """
        Create Stripe checkout session.
        
        Args:
            price_id: Stripe price ID
            tier: Subscription tier
            
        Returns:
            Checkout session data
        """
        return self._client.request(
            "POST",
            "create-checkout",
            json={"priceId": price_id, "tier": tier},
            is_function=True
        )
    
    def get_customer_portal(self) -> Dict[str, Any]:
        """
        Get Stripe customer portal URL.
        
        Returns:
            Portal URL data
        """
        return self._client.request(
            "POST",
            "customer-portal",
            json={},
            is_function=True
        )
