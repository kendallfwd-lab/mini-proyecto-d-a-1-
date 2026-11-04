const pool = require('../config/database');

async function summary() {
  const limit = Number(process.env.LOW_STOCK_LIMIT || 5);
  const [[totals]] = await pool.query(
    'SELECT (SELECT COUNT(*) FROM productos) AS productos, (SELECT COUNT(*) FROM categorias) AS categorias, (SELECT COUNT(*) FROM proveedores) AS proveedores, COALESCE((SELECT SUM(stock) FROM productos), 0) AS unidades, COALESCE((SELECT SUM(precio * stock) FROM productos), 0) AS valor_inventario, (SELECT COUNT(*) FROM productos WHERE stock > 0 AND stock <= ?) AS stock_bajo, (SELECT COUNT(*) FROM productos WHERE stock = 0) AS agotados',
    [limit],
  );
  const [porCategoria] = await pool.query(
    'SELECT c.nombre AS categoria, COUNT(p.id) AS productos FROM categorias c LEFT JOIN productos p ON p.categoria_id = c.id GROUP BY c.id, c.nombre ORDER BY c.nombre',
  );
  const [recientes] = await pool.query(
    'SELECT p.id, p.codigo, p.nombre, p.imagen_url, p.precio, p.stock, c.nombre AS categoria FROM productos p JOIN categorias c ON c.id = p.categoria_id ORDER BY p.fecha_creacion DESC LIMIT 5',
  );
  const [alertas] = await pool.query(
    'SELECT p.id, p.codigo, p.nombre, p.stock FROM productos p WHERE p.stock <= ? ORDER BY p.stock, p.nombre',
    [limit],
  );
  return { totales: totals, por_categoria: porCategoria, recientes, alertas };
}

async function analytics() {
  const [[summaryResult]] = await pool.query(`SELECT
    COALESCE(SUM(CASE WHEN v.estado = 'pagada' THEN v.total ELSE 0 END), 0) AS ventas_pagadas,
    COUNT(DISTINCT CASE WHEN v.estado = 'pagada' THEN v.id END) AS pedidos_pagados,
    COALESCE(SUM(CASE WHEN v.estado = 'pagada' THEN vd.cantidad ELSE 0 END), 0) AS unidades_vendidas,
    COALESCE(SUM(CASE WHEN v.estado = 'pendiente' THEN v.total ELSE 0 END), 0) AS ventas_pendientes
    FROM ventas v LEFT JOIN venta_detalle vd ON vd.venta_id = v.id`);
  const [topProducts] = await pool.query(`SELECT p.codigo, p.nombre, SUM(vd.cantidad) AS unidades_vendidas,
    SUM(vd.subtotal) AS ingresos FROM venta_detalle vd JOIN ventas v ON v.id = vd.venta_id
    JOIN productos p ON p.id = vd.producto_id WHERE v.estado = 'pagada'
    GROUP BY p.id, p.codigo, p.nombre ORDER BY unidades_vendidas DESC, ingresos DESC LIMIT 5`);
  const [channels] = await pool.query(`SELECT canal, COUNT(*) AS pedidos, SUM(total) AS ingresos
    FROM ventas WHERE estado = 'pagada' GROUP BY canal ORDER BY ingresos DESC`);
  const [movementSummary] = await pool.query(`SELECT tipo, SUM(cantidad) AS unidades
    FROM movimientos_inventario GROUP BY tipo ORDER BY tipo`);

  return {
    resumen: summaryResult,
    productos_mas_vendidos: topProducts,
    ventas_por_canal: channels,
    movimientos: movementSummary,
  };
}

module.exports = { summary, analytics };
