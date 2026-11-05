const pool = require('../config/database');

const publicFields = 'id, nombre, correo, es_principal, activo, fecha_creacion';
async function findByEmail(correo) { const [rows] = await pool.query(`SELECT ${publicFields}, password_hash, version_token FROM usuarios WHERE correo = ?`, [correo]); return rows[0]; }
async function findById(id) { const [rows] = await pool.query(`SELECT ${publicFields}, version_token FROM usuarios WHERE id = ?`, [id]); return rows[0]; }
async function create({ nombre, correo, passwordHash, esPrincipal = 0 }) { const [result] = await pool.query('INSERT INTO usuarios (nombre, correo, password_hash, es_principal) VALUES (?, ?, ?, ?)', [nombre, correo, passwordHash, esPrincipal]); return findById(result.insertId); }
async function listAdmins() { const [rows] = await pool.query(`SELECT ${publicFields} FROM usuarios ORDER BY es_principal DESC, nombre`); return rows; }
async function deactivate(id) { const [result] = await pool.query('UPDATE usuarios SET activo = 0, version_token = version_token + 1 WHERE id = ? AND es_principal = 0', [id]); return result.affectedRows; }
async function invalidateToken(id) { await pool.query('UPDATE usuarios SET version_token = version_token + 1 WHERE id = ?', [id]); }
module.exports = { findByEmail, findById, create, listAdmins, deactivate, invalidateToken };
