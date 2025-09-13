import hashlib
import hmac
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import os

os.environ["STORYBLOK_WEBHOOK_SECRET"] = "test_secret_123"

from main import app

client = TestClient(app)

class TestWebhookEndpoint:
    """Test suite for Storyblok webhook endpoint validation."""
    
    @staticmethod
    def generate_valid_signature(payload: bytes, secret: str = "test_secret_123") -> str:
        """Generate a valid HMAC-SHA256 signature for testing."""
        return hmac.new(
            secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
    
    def test_valid_webhook_passes(self):
        """Test that a valid webhook request (correct signature) is accepted with 200 OK."""
        payload = b'{"action": "published", "story_id": 123}'
        signature = self.generate_valid_signature(payload)
        
        response = client.post(
            "/webhooks/storyblok",
            content=payload,
            headers={"webhook-signature": signature}
        )
        
        assert response.status_code == 200
        assert response.json() == {"ok": True}
    
    def test_invalid_signature_fails(self):
        """Test that a request with mismatched signature fails with 400 Bad Request."""
        payload = b'{"action": "published", "story_id": 123}'
        invalid_signature = "invalid_signature_123"
        
        response = client.post(
            "/webhooks/storyblok",
            content=payload,
            headers={"webhook-signature": invalid_signature}
        )
        
        assert response.status_code == 400
        assert response.json() == {"error": "Invalid signature"}
    
    def test_missing_signature_fails(self):
        """Test that a request with missing webhook-signature header fails with 400 Bad Request."""
        payload = b'{"action": "published", "story_id": 123}'
        
        response = client.post(
            "/webhooks/storyblok",
            content=payload,
            headers={}  # No webhook-signature header
        )
        
        assert response.status_code == 400
        assert response.json() == {"error": "Invalid signature"}
    
    def test_empty_signature_fails(self):
        """Test that a request with empty signature fails."""
        payload = b'{"action": "published", "story_id": 123}'
        
        response = client.post(
            "/webhooks/storyblok",
            content=payload,
            headers={"webhook-signature": ""}
        )
        
        assert response.status_code == 400
        assert response.json() == {"error": "Invalid signature"}
    
    def test_different_payload_same_signature_fails(self):
        """Test that changing payload but keeping same signature fails."""
        original_payload = b'{"action": "published", "story_id": 123}'
        modified_payload = b'{"action": "published", "story_id": 456}'
        signature = self.generate_valid_signature(original_payload)
        
        response = client.post(
            "/webhooks/storyblok",
            content=modified_payload,
            headers={"webhook-signature": signature}
        )
        
        assert response.status_code == 400
        assert response.json() == {"error": "Invalid signature"}


class TestWebhookValidator:
    """Test the WebhookValidator class directly."""
    
    def test_validator_initialization(self):
        """Test that validator initializes correctly with secret."""
        from webhook_validator import WebhookValidator
        
        validator = WebhookValidator("test_secret")
        assert validator.secret == "test_secret"
    
    def test_validator_empty_secret_raises_error(self):
        """Test that validator raises error with empty secret."""
        from webhook_validator import WebhookValidator
        
        with pytest.raises(ValueError, match="Webhook secret cannot be empty"):
            WebhookValidator("")
    
    def test_direct_signature_verification(self):
        """Test signature verification method directly."""
        from webhook_validator import WebhookValidator
        
        validator = WebhookValidator("test_secret")
        payload = b'{"test": "data"}'
        
        # Generate valid signature
        valid_signature = hmac.new(
            "test_secret".encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        assert validator.verify_signature(payload, valid_signature) is True
        assert validator.verify_signature(payload, "invalid") is False
        assert validator.verify_signature(payload, "") is False
