const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, default: 'ESP32-001' },
  timestamp: { type: Date, default: Date.now, index: true },
  temperature: { type: Number },
  humidity: { type: Number },
  vibration: { type: Number },
  pressure: { type: Number },
  frequency: { type: Number },
  motion: { type: Number },
  tilt: { type: Number }
});

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
