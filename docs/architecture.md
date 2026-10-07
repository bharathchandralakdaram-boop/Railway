# Architecture

## System Architecture

The Railway Intelligence Platform follows a modular microservice-inspired architecture.

### Data Flow

1. **Sensor Layer**: ESP32 devices (or simulator) publish telemetry via MQTT
2. **Ingestion Layer**: Node.js backend subscribes to MQTT topics, validates, and stores data
3. **Storage Layer**: MongoDB stores sensor readings, alerts, anomalies, and maintenance records
4. **Intelligence Layer**: Python FastAPI services run ML anomaly detection and CV defect detection
5. **Communication Layer**: Socket.IO pushes real-time updates to the frontend
6. **Presentation Layer**: React dashboard displays live data, alerts, analytics, and AI insights

### Component Responsibilities

| Component | Responsibility |
|---|---|
| ESP32 / Simulator | Generate and publish sensor telemetry |
| MQTT Broker | Message routing between devices and backend |
| Node.js Backend | API, MQTT ingestion, orchestration, Socket.IO |
| MongoDB | Persistent data storage |
| ML Service | Anomaly detection using Isolation Forest |
| CV Service | Railway track defect detection |
| React Frontend | Real-time dashboard and user interface |

### Port Allocation

| Service | Default Port |
|---|---|
| Frontend (Vite) | 5173 |
| Backend (Express) | 5000 |
| MongoDB | 27017 |
| MQTT Broker | 1883 |
| AI Service (FastAPI) | 8000 |
