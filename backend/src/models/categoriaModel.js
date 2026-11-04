const pool = require('../config/database');
const fields = 'c.id, c.nombre, c.descripcion, c.fecha_creacion';
async function findAll(search = '') { const like = `%${search}%`; const [rows] = await pool.query(`SELECT ${fields}, COUNT(p.id) AS productos_count FROM categorias c LEFT JOIN productos p ON p.categoria_id = c.id WHERE c.nombre LIKE ? GROUP BY c.id ORDER BY c.nombre`, [like]); return rows; }
async function findById(id) { const [rows] = await pool.query(`SELECT ${fields}, COUNT(p.id) AS productos_count FROM categorias c LEFT JOIN productos p ON p.categoria_id = c.id WHERE c.id = ? GROUP BY c.id`, [id]); return rows[0]; }
async function create(data) { const [result] = await pool.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [data.nombre.trim(), data.descripcion || null]); return findById(result.insertId); }
async function update(id, data) { await pool.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [data.nombre.trim(), data.descripcion || null, id]); return findById(id); }
async function remove(id) { const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]); return result.affectedRows; }
module.exports = { findAll, findById, create, update, remove };
