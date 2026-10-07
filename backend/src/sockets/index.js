const { Server } = require('socket.io');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Initialize Socket.IO server
 * @param {http.Server} server - HTTP server instance
 * @returns {Server} Socket.IO server instance
 */
function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: config.frontend.url,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info('SOCKET', `Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info('SOCKET', `Client disconnected: ${socket.id}`);
    });
  });

  // Store globally so controllers can emit events
  global.__io = io;

  logger.info('SOCKET', 'Socket.IO initialized');
  return io;
}

module.exports = { initSocket };
