const pool = require('../config/database');

function mapInvoiceRows(rows) {
  const invoices = new Map();
  for (const row of rows) {
    if (!invoices.has(row.id)) {
      invoices.set(row.id, {
        id: row.id,
        venta_id: row.venta_id,
        numero_factura: row.numero_factura,
        fecha_emision: row.fecha_emision,
        telefono_cliente: row.telefono_cliente,
        es_demo: Boolean(row.es_demo),
        cliente: row.cliente,
        cliente_id: row.cliente_id,
        canal: row.canal,
        estado_venta: row.estado_venta,
        total: row.total,
        productos: [],
      });
    }
    if (row.producto_id !== null) {
      invoices.get(row.id).productos.push({
        producto_id: row.producto_id,
        codigo: row.codigo,
        nombre: row.producto_nombre,
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario,
        subtotal: row.subtotal,
      });
    }
  }
  return Array.from(invoices.values());
}

const invoiceQuery = `SELECT f.id, f.venta_id, f.numero_factura, f.telefono_cliente,
    f.fecha_emision, f.es_demo, v.cliente, v.cliente_id, v.canal,
    v.estado AS estado_venta, v.total, vd.producto_id, vd.cantidad,
    vd.precio_unitario, vd.subtotal, p.codigo, p.nombre AS producto_nombre
  FROM facturas f
  JOIN ventas v ON v.id = f.venta_id
  LEFT JOIN venta_detalle vd ON vd.venta_id = v.id
  LEFT JOIN productos p ON p.id = vd.producto_id`;

async function findAll() {
  const [rows] = await pool.query(`${invoiceQuery} ORDER BY f.fecha_emision DESC, f.id DESC, vd.id`);
  return mapInvoiceRows(rows);
}

async function findById(id) {
  const [rows] = await pool.query(`${invoiceQuery} WHERE f.id = ? ORDER BY vd.id`, [id]);
  return mapInvoiceRows(rows)[0];
}

module.exports = { findAll, findById };
