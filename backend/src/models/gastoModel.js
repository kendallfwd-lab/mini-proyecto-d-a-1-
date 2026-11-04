const pool = require('../config/database');

async function findAll({ desde, hasta } = {}) {
  const conditions = [];
  const params = [];
  if (desde) {
    conditions.push('fecha_gasto >= ?');
    params.push(desde);
  }
  if (hasta) {
    conditions.push('fecha_gasto <= ?');
    params.push(hasta);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT id, categoria, descripcion, monto, fecha_gasto, es_demo, fecha_creacion
     FROM gastos ${where} ORDER BY fecha_gasto DESC, id DESC`,
    params,
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, categoria, descripcion, monto, fecha_gasto, es_demo, fecha_creacion FROM gastos WHERE id = ?',
    [id],
  );
  return rows[0];
}

async function create(data) {
  const [result] = await pool.query(
    'INSERT INTO gastos (categoria, descripcion, monto, fecha_gasto, es_demo) VALUES (?, ?, ?, ?, FALSE)',
    [data.categoria, data.descripcion.trim(), Number(data.monto), data.fecha_gasto],
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const current = await findById(id);
  if (!current || Boolean(current.es_demo)) return undefined;
  await pool.query(
    'UPDATE gastos SET categoria = ?, descripcion = ?, monto = ?, fecha_gasto = ? WHERE id = ? AND es_demo = FALSE',
    [data.categoria, data.descripcion.trim(), Number(data.monto), data.fecha_gasto, id],
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM gastos WHERE id = ? AND es_demo = FALSE', [id]);
  return result.affectedRows;
}

module.exports = { findAll, findById, create, update, remove };
