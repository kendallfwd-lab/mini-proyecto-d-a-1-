const pool = require('../config/database');

async function createSession({ id, userId, expiresAt, ip, userAgent }) {
  await pool.query('INSERT INTO sesiones (id, usuario_id, fecha_expiracion, ip_origen, user_agent) VALUES (?, ?, ?, ?, ?)', [id, userId, expiresAt, ip || null, userAgent || null]);
}
async function findActive(id, idleMinutes = Number(process.env.IDLE_TIMEOUT_MINUTES || 10)) {
  const [rows] = await pool.query('SELECT * FROM sesiones WHERE id = ? AND revocada_en IS NULL AND fecha_expiracion > CURRENT_TIMESTAMP AND TIMESTAMPDIFF(SECOND, ultima_actividad, CURRENT_TIMESTAMP) < (? * 60)', [id, idleMinutes]);
  return rows[0];
}
async function touch(id) { await pool.query('UPDATE sesiones SET ultima_actividad = CURRENT_TIMESTAMP WHERE id = ? AND revocada_en IS NULL', [id]); }
async function revoke(id) { await pool.query('UPDATE sesiones SET revocada_en = CURRENT_TIMESTAMP WHERE id = ? AND revocada_en IS NULL', [id]); }
async function revokeUser(userId) { await pool.query('UPDATE sesiones SET revocada_en = CURRENT_TIMESTAMP WHERE usuario_id = ? AND revocada_en IS NULL', [userId]); }
async function addRefresh({ sessionId, hash, familyId, expiresAt }, connection = pool) { await connection.query('INSERT INTO refresh_tokens (sesion_id, hash_token, familia_id, fecha_expiracion) VALUES (?, ?, ?, ?)', [sessionId, hash, familyId, expiresAt]); }
async function findRefresh(hash, connection = pool) { const [rows] = await connection.query('SELECT * FROM refresh_tokens WHERE hash_token = ? LIMIT 1', [hash]); return rows[0]; }
async function rotateRefresh(id, oldHash, next) {
  const connection = await pool.getConnection();
  try { await connection.beginTransaction(); const [updated] = await connection.query('UPDATE refresh_tokens SET fecha_uso = CURRENT_TIMESTAMP WHERE id = ? AND hash_token = ? AND fecha_uso IS NULL AND revocado_en IS NULL AND fecha_expiracion > CURRENT_TIMESTAMP', [id, oldHash]); if (updated.affectedRows !== 1) { await connection.query('UPDATE refresh_tokens SET revocado_en = CURRENT_TIMESTAMP WHERE familia_id = (SELECT familia_id FROM (SELECT familia_id FROM refresh_tokens WHERE id = ?) AS token) AND revocado_en IS NULL', [id]); throw new Error('REFRESH_REUSED'); } await addRefresh(next, connection); await connection.commit(); } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}
async function revokeFamily(familyId) { await pool.query('UPDATE refresh_tokens SET revocado_en = CURRENT_TIMESTAMP WHERE familia_id = ? AND revocado_en IS NULL', [familyId]); }
module.exports = { createSession, findActive, touch, revoke, revokeUser, addRefresh, findRefresh, rotateRefresh, revokeFamily };
