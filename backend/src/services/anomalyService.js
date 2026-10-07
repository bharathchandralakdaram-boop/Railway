/**
 * Prototype Anomaly Detection (Threshold-Based)
 *
 * This is NOT machine learning. It uses simple threshold comparisons
 * to flag abnormal sensor values. Clearly labeled as prototype.
 */

const logger = require('../utils/logger');

// Configurable thresholds for each sensor type
const THRESHOLDS = {
  temperature: { min: -10, max: 60, unit: '°C' },
  humidity:    { min: 0,   max: 100, unit: '%' },
  vibration:   { min: 0,   max: 1.5, unit: 'g' },
  pressure:    { min: 950, max: 1050, unit: 'hPa' },
  frequency:   { min: 45,  max: 55, unit: 'Hz' },
  motion:      { min: 0,   max: 0.8, unit: 'lvl' },
  tilt:        { min: -5,  max: 5, unit: '°' },
};

/**
 * Determine severity based on how far value exceeds threshold
 */
function getSeverity(value, min, max) {
  const range = max - min;
  const overMax = value > max ? (value - max) / range : 0;
  const underMin = value < min ? (min - value) / range : 0;
  const deviation = Math.max(overMax, underMin);

  if (deviation > 0.3) return 'CRITICAL';
  if (deviation > 0.2) return 'HIGH';
  if (deviation > 0.1) return 'MEDIUM';
  return 'LOW';
}

/**
 * Check sensor data for anomalies.
 * @param {Object} sensorData - The sensor reading object
 * @returns {Array} Array of alert objects (empty if no anomalies)
 */
function checkAnomalies(sensorData) {
  const alerts = [];

  for (const [sensor, threshold] of Object.entries(THRESHOLDS)) {
    const value = sensorData[sensor];

    // Skip if sensor value not present
    if (value === undefined || value === null) continue;

    if (value > threshold.max || value < threshold.min) {
      const exceeded = value > threshold.max ? 'above maximum' : 'below minimum';
      const limit = value > threshold.max ? threshold.max : threshold.min;
      const severity = getSeverity(value, threshold.min, threshold.max);

      const alert = {
        deviceId: sensorData.deviceId || 'ESP32-001',
        type: 'threshold_exceeded',
        severity,
        sensorType: sensor,
        value,
        threshold: limit,
        message: `Abnormal ${sensor} detected: ${value}${threshold.unit} is ${exceeded} (limit: ${limit}${threshold.unit}). Recommended action: Inspect affected track segment.`,
      };

      alerts.push(alert);
      logger.warn('ANOMALY', `${severity} - ${sensor}: ${value}${threshold.unit} (limit: ${limit}${threshold.unit})`);
    }
  }

  return alerts;
}

module.exports = { checkAnomalies, THRESHOLDS };
