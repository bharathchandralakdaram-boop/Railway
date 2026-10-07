const express = require('express');
const router = express.Router();
const { getReadings, getLatestReading } = require('../controllers/sensorController');

// GET /api/readings - Get sensor readings
router.get('/', getReadings);

// GET /api/readings/latest - Get most recent reading
router.get('/latest', getLatestReading);

module.exports = router;
