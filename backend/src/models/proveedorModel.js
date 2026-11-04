const pool = require('../config/database');
const fields = 'pr.id, pr.nombre, pr.correo, pr.telefono, pr.direccion, pr.fecha_creacion';
async function findAll(search = '') { const like = `%${search}%`; const [rows] = await pool.query(`SELECT ${fields}, COUNT(p.id) AS productos_count FROM proveedores pr LEFT JOIN productos p ON p.proveedor_id = pr.id WHERE pr.nombre LIKE ? OR pr.correo LIKE ? GROUP BY pr.id ORDER BY pr.nombre`, [like, like]); return rows; }
async function findById(id) { const [rows] = await pool.query(`SELECT ${fields}, COUNT(p.id) AS productos_count FROM proveedores pr LEFT JOIN productos p ON p.proveedor_id = pr.id WHERE pr.id = ? GROUP BY pr.id`, [id]); return rows[0]; }
async function create(data) { const [result] = await pool.query('INSERT INTO proveedores (nombre, correo, telefono, direccion) VALUES (?, ?, ?, ?)', [data.nombre.trim(), data.correo || null, data.telefono || null, data.direccion || null]); return findById(result.insertId); }
async function update(id, data) { await pool.query('UPDATE proveedores SET nombre = ?, correo = ?, telefono = ?, direccion = ? WHERE id = ?', [data.nombre.trim(), data.correo || null, data.telefono || null, data.direccion || null, id]); return findById(id); }
async function remove(id) { const [result] = await pool.query('DELETE FROM proveedores WHERE id = ?', [id]); return result.affectedRows; }
module.exports = { findAll, findById, create, update, remove };
