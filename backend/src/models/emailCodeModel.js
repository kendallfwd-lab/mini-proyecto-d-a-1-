const crypto = require('node:crypto');
const pool = require('../config/database');
const hash = (value) => crypto.createHash('sha256').update(String(value)).digest();
async function create(userId, code) { await pool.query('UPDATE email_mfa_codes SET usado_en = CURRENT_TIMESTAMP WHERE usuario_id = ? AND usado_en IS NULL', [userId]); await pool.query('INSERT INTO email_mfa_codes (usuario_id, codigo_hash, expira_en) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 10 MINUTE))', [userId, hash(code)]); }
async function consume(userId, code) { const [rows] = await pool.query('SELECT * FROM email_mfa_codes WHERE usuario_id = ? AND usado_en IS NULL AND expira_en > UTC_TIMESTAMP() ORDER BY id DESC LIMIT 1', [userId]); const row = rows[0]; if (!row || row.intentos >= 5 || !crypto.timingSafeEqual(row.codigo_hash, hash(code))) { if (row) await pool.query('UPDATE email_mfa_codes SET intentos = intentos + 1 WHERE id = ?', [row.id]); return false; } await pool.query('UPDATE email_mfa_codes SET usado_en = CURRENT_TIMESTAMP WHERE id = ?', [row.id]); return true; }
module.exports = { create, consume };
