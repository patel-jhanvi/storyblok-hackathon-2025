import logging
import os
from typing import Dict, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from webhook_validator import WebhookValidator, WebhookLogger

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Load environment variables
load_dotenv()

app = FastAPI(title="Brewbook Webhook Service", version="1.0.0")
STORYBLOK_WEBHOOK_SECRET = os.getenv("STORYBLOK_WEBHOOK_SECRET")

if not STORYBLOK_WEBHOOK_SECRET:
    raise ValueError("STORYBLOK_WEBHOOK_SECRET environment variable is required")

# Initialize validator with secret
validator = WebhookValidator(STORYBLOK_WEBHOOK_SECRET)


def get_client_ip(request: Request) -> str:
    """Extract client IP address from request."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@app.post("/webhooks/storyblok")
async def handle_storyblok_webhook(request: Request) -> JSONResponse:
    """
    Handle incoming Storyblok webhooks with signature validation.
    
    Validates the HMAC-SHA256 signature in the webhook-signature header
    and processes the webhook payload if valid.
    
    Returns:
        200 OK with {"ok": true} for valid webhooks
        400 Bad Request with {"error": "message"} for invalid requests
    """
    client_ip = get_client_ip(request)
    
    try:
        # Get the raw body for signature verification (must use raw bytes)
        body = await request.body()
        
        # Get the signature from headers
        signature = request.headers.get("webhook-signature")
        
        if not signature:
            WebhookLogger.log_missing_signature(client_ip)
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid signature"}
            )
        
        # Verify the signature using our validator
        if not validator.verify_signature(body, signature):
            WebhookLogger.log_verification_failure(client_ip, "Signature mismatch")
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid signature"}
            )
        
        # Parse the JSON payload after signature verification
        try:
            payload = await request.json()
            event_type = payload.get("action")
        except Exception:
            WebhookLogger.log_verification_failure(client_ip, "Invalid JSON payload")
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid signature"}
            )
        
        # Log successful verification with IP and event type
        WebhookLogger.log_verification_success(client_ip, event_type)
        
        # Return success response as specified in requirements
        return JSONResponse(
            status_code=200,
            content={"ok": True}
        )
        
    except Exception as e:
        WebhookLogger.log_verification_failure(client_ip, f"Unexpected error: {str(e)}")
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid signature"}
        )


@app.get("/")
async def root() -> Dict[str, str]:
    """Health check endpoint."""
    return {"message": "Brewbook Webhook Service is running"}


@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "brewbook-webhook"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
