const pool = require('../config/database');

function mapPurchaseRows(rows) {
  const purchases = new Map();
  for (const row of rows) {
    if (!purchases.has(row.id)) {
      purchases.set(row.id, {
        id: row.id,
        proveedor_id: row.proveedor_id,
        proveedor_nombre: row.proveedor_nombre,
        fecha_pedido: row.fecha_pedido,
        estado: row.estado,
        es_demo: Boolean(row.es_demo),
        total: row.total,
        notas: row.notas,
        fecha_creacion: row.fecha_creacion,
        fecha_recepcion: row.fecha_recepcion,
        productos: [],
      });
    }
    if (row.detalle_id !== null) {
      purchases.get(row.id).productos.push({
        detalle_id: row.detalle_id,
        producto_id: row.producto_id,
        codigo: row.codigo,
        nombre: row.producto_nombre,
        cantidad: row.cantidad,
        cantidad_recibida: row.cantidad_recibida,
        pendiente: row.cantidad - row.cantidad_recibida,
        costo_unitario: row.costo_unitario,
      });
    }
  }
  return Array.from(purchases.values());
}

const purchaseQuery = `SELECT c.id, c.proveedor_id, p.nombre AS proveedor_nombre,
      c.fecha_pedido, c.estado, c.total, c.notas, c.es_demo, c.fecha_creacion, c.fecha_recepcion,
      cd.id AS detalle_id, cd.producto_id, cd.cantidad, cd.cantidad_recibida,
      cd.costo_unitario, pr.codigo, pr.nombre AS producto_nombre
    FROM compras c
    JOIN proveedores p ON p.id = c.proveedor_id
    LEFT JOIN compra_detalle cd ON cd.compra_id = c.id
    LEFT JOIN productos pr ON pr.id = cd.producto_id`;

async function findById(id) {
  const [rows] = await pool.query(`${purchaseQuery} WHERE c.id = ? ORDER BY cd.id`, [id]);
  return mapPurchaseRows(rows)[0];
}

async function findAll() {
  const [rows] = await pool.query(`${purchaseQuery} ORDER BY c.fecha_pedido DESC, c.id DESC, cd.id`);
  return mapPurchaseRows(rows);
}

async function create(data) {
  const connection = await pool.getConnection();
  let purchaseId;
  try {
    await connection.beginTransaction();
    const [suppliers] = await connection.query('SELECT id FROM proveedores WHERE id = ? FOR UPDATE', [data.proveedor_id]);
    if (!suppliers.length) {
      const error = new Error('El proveedor seleccionado no existe');
      error.status = 400;
      throw error;
    }

    const products = [];
    for (const item of data.productos) {
      const [rows] = await connection.query(
        'SELECT id, codigo, nombre, proveedor_id FROM productos WHERE id = ? FOR UPDATE',
        [item.producto_id],
      );
      const product = rows[0];
      if (!product) {
        const error = new Error(`No existe el producto ${item.producto_id}`);
        error.status = 400;
        throw error;
      }
      if (Number(product.proveedor_id) !== Number(data.proveedor_id)) {
        const error = new Error(`${product.nombre} no está asignado al proveedor seleccionado`);
        error.status = 400;
        throw error;
      }
      products.push({ ...product, cantidad: Number(item.cantidad), costo_unitario: Number(item.costo_unitario) });
    }

    const total = Math.round(products.reduce((sum, product) => sum + product.cantidad * product.costo_unitario, 0) * 100) / 100;
    const [result] = await connection.query(
      'INSERT INTO compras (proveedor_id, fecha_pedido, estado, total, notas) VALUES (?, ?, ?, ?, ?)',
      [data.proveedor_id, data.fecha_pedido, 'pendiente', total, data.notas?.trim() || null],
    );
    purchaseId = result.insertId;
    for (const product of products) {
      await connection.query(
        'INSERT INTO compra_detalle (compra_id, producto_id, cantidad, costo_unitario) VALUES (?, ?, ?, ?)',
        [purchaseId, product.id, product.cantidad, product.costo_unitario],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return findById(purchaseId);
}

async function receive(id, data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [orders] = await connection.query('SELECT id, estado, es_demo FROM compras WHERE id = ? FOR UPDATE', [id]);
    const purchase = orders[0];
    if (!purchase) {
      const error = new Error('Compra no encontrada');
      error.status = 404;
      throw error;
    }
    if (purchase.estado !== 'pendiente') {
      const error = new Error('Solo se pueden recibir compras pendientes');
      error.status = 409;
      throw error;
    }
    if (purchase.es_demo) {
      const error = new Error('Los pedidos de demostración son de solo lectura y no modifican el inventario');
      error.status = 409;
      throw error;
    }

    for (const item of data.productos) {
      const [rows] = await connection.query(`SELECT cd.id, cd.producto_id, cd.cantidad, cd.cantidad_recibida,
          cd.costo_unitario, p.nombre
        FROM compra_detalle cd
        JOIN productos p ON p.id = cd.producto_id
        WHERE cd.id = ? AND cd.compra_id = ?
        FOR UPDATE`,
      [item.detalle_id, id]);
      const line = rows[0];
      if (!line) {
        const error = new Error(`La línea ${item.detalle_id} no pertenece a esta compra`);
        error.status = 400;
        throw error;
      }
      const quantity = Number(item.cantidad);
      if (quantity > Number(line.cantidad) - Number(line.cantidad_recibida)) {
        const error = new Error(`La cantidad recibida supera lo pendiente para ${line.nombre}`);
        error.status = 400;
        throw error;
      }

      await connection.query(
        'UPDATE compra_detalle SET cantidad_recibida = cantidad_recibida + ? WHERE id = ?',
        [quantity, line.id],
      );
      await connection.query(
        'UPDATE productos SET stock = stock + ?, costo_unitario = ? WHERE id = ?',
        [quantity, line.costo_unitario, line.producto_id],
      );
      await connection.query(
        'INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo) VALUES (?, ?, ?, ?)',
        [line.producto_id, 'entrada', quantity, `Compra #${id}`],
      );
    }

    const [[remaining]] = await connection.query(
      'SELECT COUNT(*) AS lineas_pendientes FROM compra_detalle WHERE compra_id = ? AND cantidad_recibida < cantidad',
      [id],
    );
    if (Number(remaining.lineas_pendientes) === 0) {
      await connection.query(
        'UPDATE compras SET estado = ?, fecha_recepcion = CURRENT_TIMESTAMP WHERE id = ?',
        ['recibida', id],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return findById(id);
}

module.exports = { findAll, findById, create, receive };
