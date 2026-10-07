const express = require('express');
const router = express.Router();
const { receiveSensorData } = require('../controllers/sensorController');

// POST /api/sensor-data - Receive data from ESP32
router.post('/', receiveSensorData);

module.exports = router;
