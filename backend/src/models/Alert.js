const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  type: {
    type: String,
    required: true,
    default: 'threshold_exceeded',
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
  },
  message: {
    type: String,
    required: true,
  },
  sensorType: {
    type: String,
  },
  value: {
    type: Number,
  },
  threshold: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active',
  },
});

module.exports = mongoose.model('Alert', alertSchema);
