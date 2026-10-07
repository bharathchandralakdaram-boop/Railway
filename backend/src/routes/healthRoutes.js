const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * GET /api/health
 * Returns system health status
 */
router.get('/', (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.json({
    success: true,
    data: {
      status: 'online',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        backend: 'online',
        mongodb: mongoStatus,
        socketio: global.__io ? 'online' : 'offline',
      },
      version: '1.0.0',
    },
  });
});

module.exports = router;
