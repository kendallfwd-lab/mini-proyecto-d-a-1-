const pool = require('../config/database');

async function findAll(search = '') {
  const like = `%${search}%`;
  const [rows] = await pool.query(`SELECT c.id, c.nombre, c.correo, c.telefono, c.direccion, c.es_demo, c.fecha_creacion,
      COUNT(CASE WHEN v.estado = 'pagada' AND v.es_demo = FALSE THEN v.id END) AS ventas_reales,
      COALESCE(SUM(CASE WHEN v.estado = 'pagada' AND v.es_demo = FALSE THEN v.total ELSE 0 END), 0) AS total_real,
      COUNT(CASE WHEN v.es_demo = TRUE THEN v.id END) AS ventas_demo
    FROM clientes c
    LEFT JOIN ventas v ON v.cliente_id = c.id
    WHERE c.nombre LIKE ? OR c.correo LIKE ? OR c.telefono LIKE ?
    GROUP BY c.id ORDER BY c.nombre`,
  [like, like, like]);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nombre, correo, telefono, direccion, es_demo, fecha_creacion FROM clientes WHERE id = ?',
    [id],
  );
  if (!rows[0]) return undefined;
  const [sales] = await pool.query(`SELECT v.id, v.fecha_venta, v.canal, v.estado, v.total,
      v.es_demo, vd.producto_id, vd.cantidad, vd.precio_unitario, p.codigo, p.nombre AS producto_nombre
    FROM ventas v
    LEFT JOIN venta_detalle vd ON vd.venta_id = v.id
    LEFT JOIN productos p ON p.id = vd.producto_id
    WHERE v.cliente_id = ?
    ORDER BY v.fecha_venta DESC, v.id DESC`,
  [id]);
  const history = new Map();
  for (const row of sales) {
    if (!history.has(row.id)) {
      history.set(row.id, {
        id: row.id,
        fecha_venta: row.fecha_venta,
        canal: row.canal,
        estado: row.estado,
        total: row.total,
        es_demo: Boolean(row.es_demo),
        productos: [],
      });
    }
    if (row.producto_id !== null) {
      history.get(row.id).productos.push({
        producto_id: row.producto_id,
        codigo: row.codigo,
        nombre: row.producto_nombre,
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario,
      });
    }
  }
  return { ...rows[0], ventas: Array.from(history.values()) };
}

async function create(data) {
  const [result] = await pool.query(
    'INSERT INTO clientes (nombre, correo, telefono, direccion) VALUES (?, ?, ?, ?)',
    [data.nombre.trim(), data.correo?.trim() || null, data.telefono?.trim() || null, data.direccion?.trim() || null],
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const [rows] = await pool.query(
    'SELECT id FROM clientes WHERE id = ? AND es_demo = FALSE',
    [id],
  );
  if (!rows.length) return undefined;
  await pool.query(
    'UPDATE clientes SET nombre = ?, correo = ?, telefono = ?, direccion = ? WHERE id = ? AND es_demo = FALSE',
    [data.nombre.trim(), data.correo?.trim() || null, data.telefono?.trim() || null, data.direccion?.trim() || null, id],
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM clientes WHERE id = ? AND es_demo = FALSE', [id]);
  return result.affectedRows;
}

module.exports = { findAll, findById, create, update, remove };
