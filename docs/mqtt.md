# MQTT Topics & Protocol

## Broker

- Default: `mqtt://localhost:1883`
- Broker: Eclipse Mosquitto

## Topic Structure

```
sensor/{deviceId}/{dataType}
```

### Individual Sensor Topics

| Topic | Description |
|---|---|
| `sensor/ESP32-001/temperature` | Temperature reading (°C) |
| `sensor/ESP32-001/humidity` | Humidity reading (%) |
| `sensor/ESP32-001/vibration` | Vibration level (g) |
| `sensor/ESP32-001/pressure` | Pressure reading (hPa) |
| `sensor/ESP32-001/frequency` | Frequency reading (Hz) |

### Combined Data Topic

| Topic | Description |
|---|---|
| `sensor/ESP32-001/data` | Full JSON payload with all sensor values |

### Payload Format (Combined)

```json
{
  "sensorId": "ESP32-001",
  "timestamp": "2026-10-05T12:00:00Z",
  "temperature": 28.4,
  "humidity": 61.2,
  "pressure": 1012.4,
  "vibration": 0.23,
  "frequency": 48.2,
  "location": {
    "latitude": 17.3850,
    "longitude": 78.4867
  }
}
```

## Status

> TODO: MQTT integration will be implemented in Stage 3.
