const express = require('express');
const cors = require('cors');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/healthRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const readingsRoutes = require('./routes/readingsRoutes');
const alertRoutes = require('./routes/alertRoutes');
const logger = require('./utils/logger');

const app = express();

// --- CORS ---
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));

// --- Body Parsing ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Request Logging (debug mode) ---
app.use((req, res, next) => {
  if (config.logging.level === 'debug') {
    logger.debug('HTTP', `${req.method} ${req.path}`);
  }
  next();
});

// --- Routes ---
app.use('/api/health', healthRoutes);
app.use('/api/sensor-data', sensorRoutes);
app.use('/api/readings', readingsRoutes);
app.use('/api/alerts', alertRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Railway Monitoring System API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      sensorData: 'POST /api/sensor-data',
      readings: '/api/readings',
      latestReading: '/api/readings/latest',
      alerts: '/api/alerts',
    },
  });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

// --- Error Handler ---
app.use(errorHandler);

module.exports = app;
