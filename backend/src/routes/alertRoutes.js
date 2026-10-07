const express = require('express');
const router = express.Router();
const { getAlerts } = require('../controllers/sensorController');

// GET /api/alerts - Get anomaly alerts
router.get('/', getAlerts);

module.exports = router;
