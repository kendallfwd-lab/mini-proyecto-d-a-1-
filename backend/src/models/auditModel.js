const pool = require('../config/database');
async function record({ userId = null, action, entity = null, recordId = null, result = 'exitoso', metadata = null }) { await pool.query('INSERT INTO auditoria_eventos (usuario_id, accion, entidad, registro_id, resultado, metadatos) VALUES (?, ?, ?, ?, ?, ?)', [userId, action, entity, recordId == null ? null : String(recordId), result, metadata ? JSON.stringify(metadata) : null]); }
async function list(limit = 100) { const [rows] = await pool.query('SELECT id, usuario_id, accion, entidad, registro_id, fecha_evento, resultado, metadatos FROM auditoria_eventos ORDER BY fecha_evento DESC LIMIT ?', [Math.min(Math.max(Number(limit) || 100, 1), 500)]); return rows; }
module.exports = { record, list };
