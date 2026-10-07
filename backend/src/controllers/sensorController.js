const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');
const { checkAnomalies } = require('../services/anomalyService');
const logger = require('../utils/logger');

/**
 * POST /api/sensor-data
 * Receive sensor data from ESP32
 */
async function receiveSensorData(req, res) {
  try {
    const { deviceId, temperature, humidity, vibration, pressure, frequency, motion, tilt } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        error: 'deviceId is required',
      });
    }

    // Create and save sensor reading
    const reading = new SensorReading({
      deviceId,
      timestamp: new Date(),
      temperature,
      humidity,
      vibration,
      pressure,
      frequency,
      motion: motion !== undefined ? motion : tilt,
      tilt,
    });

    const savedReading = await reading.save();
    logger.info('SENSOR', `Data received from ${deviceId}: temp=${temperature}, hum=${humidity}, vib=${vibration}`);

    // Check for anomalies
    const anomalies = checkAnomalies(req.body);
    const savedAlerts = [];

    for (const anomaly of anomalies) {
      const alert = new Alert(anomaly);
      const savedAlert = await alert.save();
      savedAlerts.push(savedAlert);
    }

    // Emit via Socket.IO
    const io = global.__io;
    if (io) {
      io.emit('sensorData', savedReading);
      for (const alert of savedAlerts) {
        io.emit('alert', alert);
      }
    }

    res.status(201).json({
      success: true,
      data: savedReading,
      alerts: savedAlerts,
    });
  } catch (err) {
    logger.error('SENSOR', 'Failed to process sensor data', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process sensor data',
    });
  }
}

/**
 * GET /api/readings
 * Get sensor readings with optional filters
 */
async function getReadings(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const query = {};

    if (req.query.deviceId) {
      query.deviceId = req.query.deviceId;
    }

    const readings = await SensorReading.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: readings.length,
      data: readings,
    });
  } catch (err) {
    logger.error('SENSOR', 'Failed to fetch readings', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch readings',
    });
  }
}

/**
 * GET /api/readings/latest
 * Get the most recent sensor reading
 */
async function getLatestReading(req, res) {
  try {
    const reading = await SensorReading.findOne()
      .sort({ timestamp: -1 });

    if (!reading) {
      return res.json({
        success: true,
        data: null,
        message: 'No readings available yet',
      });
    }

    res.json({
      success: true,
      data: reading,
    });
  } catch (err) {
    logger.error('SENSOR', 'Failed to fetch latest reading', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest reading',
    });
  }
}

/**
 * GET /api/alerts
 * Get anomaly alerts with optional filters
 */
async function getAlerts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.severity) {
      query.severity = req.query.severity;
    }

    const alerts = await Alert.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (err) {
    logger.error('ALERTS', 'Failed to fetch alerts', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts',
    });
  }
}

module.exports = {
  receiveSensorData,
  getReadings,
  getLatestReading,
  getAlerts,
};
