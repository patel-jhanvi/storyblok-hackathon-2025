# Brewbook Webhook Service

FastAPI application that handles Storyblok webhooks with HMAC-SHA256 signature validation.

## Files

- `main.py` - FastAPI application with webhook endpoint
- `webhook_validator.py` - OOP classes for validation and logging
- `tests/` - Test folder containing comprehensive unit tests
  - `tests/test_webhook.py` - Webhook endpoint tests
  - `tests/__init__.py` - Test package initialization
- `requirements.txt` - Python dependencies
- `env.example` - Environment configuration template

## Setup

1. Install dependencies:
```bash
pip3 install -r requirements.txt
```

2. Configure environment variables:
```bash
cp env.example .env
# Edit .env and set Storyblok webhook secret
```

3. Run the application:
```bash
python3 main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

4. Run tests:
```bash
python3 -m pytest tests/ -v
```

## API Responses

**Valid webhook** → `200 OK` with `{"ok": true}`  
**Invalid/Missing signature** → `400 Bad Request` with `{"error": "Invalid signature"}`

## Endpoints

- `POST /webhooks/storyblok` - Storyblok webhook endpoint with signature validation
- `GET /` - Root endpoint  
- `GET /health` - Health check endpoint

## Security Features

- **HMAC-SHA256 signature validation** using raw request body
- **Secure signature comparison** with `hmac.compare_digest()` 
- **IP logging** for all verification attempts
- **Environment-based secrets** (never hardcoded)
- **Comprehensive error handling**

## Webhook Configuration

In Storyblok space settings:
1. Go to Settings > Webhooks
2. Add webhook: `https://your-domain.com/webhooks/storyblok`
3. Set secret key (same as `STORYBLOK_WEBHOOK_SECRET` in .env)
4. Configure events to receive

## Logging

All requests are logged with:
- Client IP address (supports X-Forwarded-For)
- Verification success/failure status
- Event types for valid webhooks
- Detailed error reasons for failures
