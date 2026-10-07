const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/railway-intelligence',
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

module.exports = config;
