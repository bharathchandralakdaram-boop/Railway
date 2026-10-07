# API Reference

## Base URL

`http://localhost:5000`

## Health & System

### GET /api/health

Returns overall system health.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "online",
    "timestamp": "2026-10-05T12:00:00.000Z",
    "uptime": 120.5,
    "services": {
      "backend": "online",
      "mongodb": "connected",
      "mqtt": "disconnected",
      "aiService": "offline"
    },
    "environment": "development",
    "version": "1.0.0"
  }
}
```

### GET /api/system/status

Detailed system status for the System Health dashboard.

---

## Sensors & Readings

> TODO: Will be implemented in Stage 2.

## Alerts

> TODO: Will be implemented in Stage 9.

## Maintenance

> TODO: Will be implemented in Stage 9.

## Computer Vision

> TODO: Will be implemented in Stage 8.
