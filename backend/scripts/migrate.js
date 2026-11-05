require('dotenv').config();
const fs = require('node:fs/promises');
const path = require('node:path');
const pool = require('../src/config/database');

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
