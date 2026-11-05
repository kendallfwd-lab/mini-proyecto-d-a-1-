require('dotenv').config();
const fs = require('node:fs/promises');
const path = require('node:path');
const mysql = require('mysql2/promise');

const adminUser = process.env.DB_ADMIN_USER || process.env.DB_USER || 'root';
const adminPassword = process.env.DB_ADMIN_PASSWORD || process.env.DB_PASSWORD || '';
if (adminPassword === 'AQUI_LA_CONTRASEÑA_ROOT_DE_MYSQL') throw new Error('Reemplace DB_ADMIN_PASSWORD por la contraseña real de MySQL root.');
const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306), user: adminUser, password: adminPassword, database: process.env.DB_NAME || 'business_inventory', waitForConnections: true, connectionLimit: 2, dateStrings: true });

function statements(sql) { return sql.replace(/^\s*USE\s+[^;]+;/gim, '').split(';').map((part) => part.replace(/--.*$/gm, '').trim()).filter(Boolean); }

async function main() {
  const file = process.argv[2] || '007_security_sessions_audit.sql';
  const filename = path.basename(file); const fullPath = path.resolve(__dirname, '../../database/migrations', filename);
  const sql = await fs.readFile(fullPath, 'utf8');
  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(120) NOT NULL PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB');
  const [applied] = await pool.query('SELECT version FROM schema_migrations WHERE version = ?', [filename]);
  if (applied.length) { console.log(`Migración ya aplicada: ${filename}`); return; }
  const connection = await pool.getConnection();
  try { await connection.beginTransaction(); for (const statement of statements(sql)) await connection.query(statement); await connection.query('INSERT INTO schema_migrations (version) VALUES (?)', [filename]); await connection.commit(); console.log(`Migración aplicada: ${filename}`); }
  catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

main().catch((error) => { console.error(`Migración fallida: ${error.message}`); process.exitCode = 1; }).finally(() => pool.end());
