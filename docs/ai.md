# AI / ML Module

## Anomaly Detection

- **Algorithm**: Isolation Forest (scikit-learn)
- **Features**: Temperature, Humidity, Pressure, Vibration, Frequency
- **Output**: Anomaly score, status (NORMAL/WARNING/CRITICAL), explanation

## API

- `POST /predict/anomaly` — Run anomaly detection on sensor data
- `GET /health` — AI service health check

## Status

> TODO: Will be implemented in Stage 7.
