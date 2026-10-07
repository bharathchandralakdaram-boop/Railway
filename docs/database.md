# Database Schema

## MongoDB Collections

### SensorReading
```json
{
  "sensorId": "string",
  "timestamp": "Date",
  "temperature": "Number (optional)",
  "humidity": "Number (optional)",
  "pressure": "Number (optional)",
  "vibration": "Number (optional)",
  "frequency": "Number (optional)",
  "location": { "latitude": "Number", "longitude": "Number" },
  "source": "string (mqtt | simulation | manual)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### AnomalyResult
```json
{
  "sensorId": "string",
  "timestamp": "Date",
  "anomalyScore": "Number",
  "status": "string (NORMAL | WARNING | CRITICAL)",
  "detectedFeatures": "[string]",
  "explanation": "string",
  "recommendedAction": "string",
  "createdAt": "Date"
}
```

### Alert
```json
{
  "sensorId": "string",
  "timestamp": "Date",
  "severity": "string (LOW | MEDIUM | HIGH | CRITICAL)",
  "type": "string",
  "message": "string",
  "status": "string (active | acknowledged | resolved)",
  "source": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### MaintenanceRecommendation
```json
{
  "assetId": "string",
  "anomalyId": "ObjectId (ref)",
  "issue": "string",
  "severity": "string",
  "recommendation": "string",
  "priority": "string (LOW | MEDIUM | HIGH | IMMEDIATE)",
  "status": "string (pending | in-progress | completed)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### DefectDetection
```json
{
  "imageUrl": "string",
  "timestamp": "Date",
  "defectType": "string",
  "confidence": "Number",
  "severity": "string",
  "boundingBox": "Object (optional)",
  "recommendation": "string",
  "createdAt": "Date"
}
```

## Status

> TODO: Mongoose models will be implemented in Stage 2.
