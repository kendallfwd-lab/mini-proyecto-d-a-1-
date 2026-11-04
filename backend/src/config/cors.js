require('dotenv').config();

const cors = require('cors');

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = cors({ origin: origins });
