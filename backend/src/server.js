const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { initSocket } = require('./sockets');

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

/**
 * Connect to MongoDB
 */
async function connectMongoDB() {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('DB', `MongoDB connected: ${config.mongodb.uri}`);
  } catch (err) {
    logger.error('DB', 'MongoDB connection failed', err.message);
    logger.warn('DB', 'Server will continue without database. Some features will be unavailable.');
  }
}

/**
 * Graceful shutdown
 */
async function shutdown(signal) {
  logger.info('SERVER', `${signal} received. Shutting down...`);

  server.close(() => {
    logger.info('SERVER', 'HTTP server closed.');
  });

  try {
    await mongoose.connection.close();
    logger.info('DB', 'MongoDB connection closed.');
  } catch (err) {
    logger.error('DB', 'Error closing MongoDB', err.message);
  }

  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

/**
 * Start the server
 */
async function start() {
  console.log('');
  logger.info('SERVER', '╔══════════════════════════════════════════╗');
  logger.info('SERVER', '║   RAILWAY MONITORING SYSTEM - BACKEND    ║');
  logger.info('SERVER', '║   ESP32 → Node.js → MongoDB → React     ║');
  logger.info('SERVER', '╚══════════════════════════════════════════╝');
  console.log('');

  // Connect to MongoDB
  await connectMongoDB();

  // Start HTTP server
  server.listen(config.port, () => {
    logger.info('SERVER', `Backend running on http://localhost:${config.port}`);
    logger.info('SERVER', `Health check: http://localhost:${config.port}/api/health`);
    logger.info('SERVER', `ESP32 endpoint: POST http://localhost:${config.port}/api/sensor-data`);
    logger.info('SERVER', `Socket.IO ready for React dashboard`);
    console.log('');
  });
}

start().catch((err) => {
  logger.error('SERVER', 'Failed to start server', err.message);
  process.exit(1);
});
