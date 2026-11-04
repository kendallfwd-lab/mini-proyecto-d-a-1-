const pool = require('../config/database');

async function findAll() {
  const [rows] = await pool.query(`SELECT v.id, v.fecha_venta, v.cliente, v.cliente_id, v.canal, v.estado, v.es_demo, v.total,
      f.id AS factura_id, f.numero_factura, COALESCE(f.telefono_cliente, c.telefono) AS telefono_cliente,
      vd.producto_id, vd.cantidad, vd.precio_unitario, vd.costo_unitario,
      p.codigo, p.nombre AS producto_nombre
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    LEFT JOIN facturas f ON f.venta_id = v.id
    LEFT JOIN venta_detalle vd ON vd.venta_id = v.id
    LEFT JOIN productos p ON p.id = vd.producto_id
    ORDER BY v.fecha_venta DESC, v.id DESC`);

  const sales = new Map();
  for (const row of rows) {
    if (!sales.has(row.id)) {
      sales.set(row.id, {
        id: row.id,
        fecha_venta: row.fecha_venta,
        cliente: row.cliente,
        cliente_id: row.cliente_id,
        canal: row.canal,
        estado: row.estado,
        es_demo: Boolean(row.es_demo),
        total: row.total,
        factura_id: row.factura_id,
        numero_factura: row.numero_factura,
        telefono_cliente: row.telefono_cliente,
        productos: [],
      });
    }
    if (row.producto_id !== null) {
      sales.get(row.id).productos.push({
        producto_id: row.producto_id,
        codigo: row.codigo,
        nombre: row.producto_nombre,
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario,
        costo_unitario: row.costo_unitario,
      });
    }
  }
  return Array.from(sales.values());
}

async function create(data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const products = [];

    let customerId = null;
    let customerName = data.cliente.trim();
    if (data.cliente_id != null) {
      const [customers] = await connection.query(
        'SELECT id, nombre, es_demo FROM clientes WHERE id = ? FOR UPDATE',
        [data.cliente_id],
      );
      if (!customers.length) {
        const error = new Error('El cliente seleccionado no existe');
        error.status = 400;
        throw error;
      }
      if (customers[0].es_demo) {
        const error = new Error('Los clientes demo son ejemplos de solo lectura y no se pueden usar en ventas reales');
        error.status = 400;
        throw error;
      }
      customerId = customers[0].id;
      customerName = customers[0].nombre;
      await connection.query('UPDATE clientes SET telefono = ? WHERE id = ?', [data.telefono.trim(), customerId]);
    }

    for (const item of data.productos) {
      const [rows] = await connection.query(
        'SELECT id, codigo, nombre, precio, costo_unitario, stock FROM productos WHERE id = ? FOR UPDATE',
        [item.producto_id],
      );
      const product = rows[0];
      if (!product) {
        const error = new Error(`No existe el producto ${item.producto_id}`);
        error.status = 400;
        throw error;
      }
      if (Number(product.stock) < Number(item.cantidad)) {
        const error = new Error(`Stock insuficiente para ${product.nombre}`);
        error.status = 409;
        throw error;
      }
      products.push({ ...product, cantidad: Number(item.cantidad) });
    }

    const total = Math.round(products.reduce(
      (sum, product) => sum + Number(product.precio) * product.cantidad,
      0,
    ) * 100) / 100;
    const [saleResult] = await connection.query(
      'INSERT INTO ventas (fecha_venta, cliente, cliente_id, canal, estado, es_demo, total) VALUES (?, ?, ?, ?, ?, FALSE, ?)',
      [`${data.fecha_venta} 12:00:00`, customerName, customerId, data.canal, 'pagada', total],
    );

    for (const product of products) {
      await connection.query(
        'INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario, costo_unitario) VALUES (?, ?, ?, ?, ?)',
        [saleResult.insertId, product.id, product.cantidad, product.precio, product.costo_unitario],
      );
      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [product.cantidad, product.id],
      );
      await connection.query(
        'INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo) VALUES (?, ?, ?, ?)',
        [product.id, 'salida', product.cantidad, `Venta #${saleResult.insertId}`],
      );
    }

    const invoiceNumber = `FAC-${data.fecha_venta.slice(0, 4)}-${String(saleResult.insertId).padStart(6, '0')}`;
    const [invoiceResult] = await connection.query(
      'INSERT INTO facturas (venta_id, numero_factura, telefono_cliente, fecha_emision, es_demo) VALUES (?, ?, ?, ?, FALSE)',
      [saleResult.insertId, invoiceNumber, data.telefono.trim(), `${data.fecha_venta} 12:00:00`],
    );

    await connection.commit();
    return {
      id: saleResult.insertId,
      fecha_venta: `${data.fecha_venta} 12:00:00`,
      cliente: customerName,
      cliente_id: customerId,
      canal: data.canal,
      estado: 'pagada',
      total,
      factura_id: invoiceResult.insertId,
      numero_factura: invoiceNumber,
      telefono_cliente: data.telefono.trim(),
      es_demo: false,
      productos: products.map((product) => ({
        producto_id: product.id,
        codigo: product.codigo,
        nombre: product.nombre,
        cantidad: product.cantidad,
        precio_unitario: product.precio,
        costo_unitario: product.costo_unitario,
      })),
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { findAll, create };
