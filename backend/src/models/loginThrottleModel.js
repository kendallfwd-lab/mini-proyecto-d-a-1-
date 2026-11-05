const crypto = require('node:crypto');
const pool = require('../config/database');
const hash = (email) => crypto.createHash('sha256').update(email).digest();
async function status(email) { const [rows] = await pool.query('SELECT * FROM login_throttles WHERE identificador_hash = ?', [hash(email)]); const row = rows[0]; return row && row.bloqueado_hasta && new Date(row.bloqueado_hasta) > new Date() ? row : null; }
async function failure(email) { const id = hash(email); const [rows] = await pool.query('SELECT * FROM login_throttles WHERE identificador_hash = ?', [id]); const row = rows[0]; const now = Date.now(); const recent = row && now - new Date(row.ultimo_intento).getTime() < 15 * 60 * 1000; const attempts = recent ? Number(row.intentos) + 1 : 1; const blocked = attempts >= 5 ? new Date(now + 15 * 60 * 1000) : null; if (row) await pool.query('UPDATE login_throttles SET intentos = ?, ultimo_intento = CURRENT_TIMESTAMP, bloqueado_hasta = ? WHERE identificador_hash = ?', [attempts, blocked, id]); else await pool.query('INSERT INTO login_throttles (identificador_hash, intentos, bloqueado_hasta) VALUES (?, ?, ?)', [id, attempts, blocked]); return blocked; }
async function success(email) { await pool.query('DELETE FROM login_throttles WHERE identificador_hash = ?', [hash(email)]); }
module.exports = { status, failure, success };
