/**
 * Structured logger utility for the Railway Intelligence Platform.
 * Provides consistent log formatting with service tags.
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;

function formatTimestamp() {
  return new Date().toISOString();
}

function log(level, tag, message, data = null) {
  if (LOG_LEVELS[level] > currentLevel) return;

  const timestamp = formatTimestamp();
  const prefix = `${timestamp} [${tag}]`;

  const consoleFn =
    level === 'error' ? console.error :
    level === 'warn' ? console.warn :
    console.log;

  if (data) {
    consoleFn(
      `${prefix} ${message}`,
      typeof data === 'object' ? JSON.stringify(data, null, 2) : data
    );
  } else {
    consoleFn(`${prefix} ${message}`);
  }
}

const logger = {
  info: (tag, message, data) => log('info', tag, message, data),
  warn: (tag, message, data) => log('warn', tag, message, data),
  error: (tag, message, data) => log('error', tag, message, data),
  debug: (tag, message, data) => log('debug', tag, message, data),
};

module.exports = logger;
