const mysql = require('mysql2/promise');
require('dotenv').config();

if (!process.env.DB_NAME) throw new Error('Falta DB_NAME en las variables de entorno');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'business_inventory',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  namedPlaceholders: false,
});

module.exports = pool;
