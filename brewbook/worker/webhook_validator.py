import hashlib
import hmac
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class WebhookValidator:
    """Handles Storyblok webhook signature validation using HMAC-SHA256."""
    
    def __init__(self, secret: str):
        """
        Initialize the validator with a webhook secret.
        
        Args:
            secret: The webhook secret configured in Storyblok
        """
        if not secret:
            raise ValueError("Webhook secret cannot be empty")
        self.secret = secret
    
    def verify_signature(self, payload: bytes, signature: str) -> bool:
        """
        Verify the HMAC-SHA256 signature from Storyblok webhook.
        
        Args:
            payload: The raw request body as bytes
            signature: The signature from the webhook-signature header
            
        Returns:
            bool: True if signature is valid, False otherwise
        """
        if not signature:
            logger.warning("Missing webhook signature")
            return False
        
        # Create HMAC-SHA256 hash
        expected_signature = hmac.new(
            self.secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        # Use secure comparison to avoid timing attacks
        is_valid = hmac.compare_digest(signature, expected_signature)
        
        if is_valid:
            logger.info("Webhook signature verified successfully")
        else:
            logger.warning(f"Invalid webhook signature. Expected: {expected_signature[:8]}..., Got: {signature[:8]}...")
        
        return is_valid


class WebhookLogger:
    """Handles logging for webhook requests with IP tracking."""
    
    @staticmethod
    def log_verification_success(client_ip: str, event_type: Optional[str] = None):
        """Log successful webhook verification."""
        logger.info(f"Webhook verified from IP {client_ip}, event: {event_type or 'unknown'}")
    
    @staticmethod
    def log_verification_failure(client_ip: str, reason: str):
        """Log failed webhook verification."""
        logger.warning(f"Invalid signature attempt from IP {client_ip}: {reason}")
    
    @staticmethod
    def log_missing_signature(client_ip: str):
        """Log missing signature header."""
        logger.warning(f"Missing signature attempt from IP {client_ip}")
