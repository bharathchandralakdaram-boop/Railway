const logger = require('../utils/logger');

/**
 * Global error handling middleware.
 * Catches unhandled errors and returns consistent JSON responses.
 */
function errorHandler(err, req, res, _next) {
  logger.error('SERVER', `Unhandled error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
