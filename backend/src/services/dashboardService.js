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
    COALESCE(SUM(CASE WHEN estado = 'pagada' THEN total ELSE 0 END), 0) AS ventas_pagadas,
    COUNT(CASE WHEN estado = 'pagada' THEN 1 END) AS pedidos_pagados,
    COALESCE(SUM(CASE WHEN estado = 'pendiente' THEN total ELSE 0 END), 0) AS ventas_pendientes
    FROM ventas WHERE es_demo = FALSE`);
  const [[units]] = await pool.query(`SELECT COALESCE(SUM(vd.cantidad), 0) AS unidades_vendidas
    FROM venta_detalle vd JOIN ventas v ON v.id = vd.venta_id WHERE v.estado = 'pagada' AND v.es_demo = FALSE`);
  const [topProducts] = await pool.query(`SELECT p.codigo, p.nombre, SUM(vd.cantidad) AS unidades_vendidas,
    SUM(vd.subtotal) AS ingresos FROM venta_detalle vd JOIN ventas v ON v.id = vd.venta_id
    JOIN productos p ON p.id = vd.producto_id WHERE v.estado = 'pagada' AND v.es_demo = FALSE
    GROUP BY p.id, p.codigo, p.nombre ORDER BY unidades_vendidas DESC, ingresos DESC LIMIT 5`);
  const [channels] = await pool.query(`SELECT canal, COUNT(*) AS pedidos, SUM(total) AS ingresos
    FROM ventas WHERE estado = 'pagada' AND es_demo = FALSE GROUP BY canal ORDER BY ingresos DESC`);
  const [movementSummary] = await pool.query(`SELECT tipo, SUM(cantidad) AS unidades
    FROM movimientos_inventario GROUP BY tipo ORDER BY tipo`);

  return {
    resumen: { ...summaryResult, ...units },
    productos_mas_vendidos: topProducts,
    ventas_por_canal: channels,
    movimientos: movementSummary,
  };
}

async function profitability() {
  const [sales] = await pool.query(`SELECT v.es_demo,
    COALESCE(SUM(v.total), 0) AS ingresos,
    COALESCE(SUM(costs.costo_productos), 0) AS costo_productos,
    COALESCE(SUM(costs.lineas_sin_costo), 0) + COUNT(CASE WHEN costs.venta_id IS NULL THEN 1 END) AS lineas_sin_costo
    FROM ventas v
    LEFT JOIN (
      SELECT vd.venta_id,
        SUM(vd.cantidad * COALESCE(vd.costo_unitario, p.costo_unitario, 0)) AS costo_productos,
        SUM(CASE WHEN COALESCE(vd.costo_unitario, p.costo_unitario) IS NULL THEN 1 ELSE 0 END) AS lineas_sin_costo
      FROM venta_detalle vd
      JOIN productos p ON p.id = vd.producto_id
      GROUP BY vd.venta_id
    ) costs ON costs.venta_id = v.id
    WHERE v.estado = 'pagada'
    GROUP BY v.es_demo`);
  const [expenses] = await pool.query(`SELECT es_demo, COALESCE(SUM(monto), 0) AS gastos
    FROM gastos GROUP BY es_demo`);

  function totals(isDemo) {
    const sale = sales.find((row) => Boolean(row.es_demo) === isDemo) || {};
    const expense = expenses.find((row) => Boolean(row.es_demo) === isDemo) || {};
    const revenue = Number(sale.ingresos || 0);
    const cost = Number(sale.costo_productos || 0);
    const operatingExpenses = Number(expense.gastos || 0);
    const result = {
      ingresos: revenue,
      costo_productos: cost,
      gastos: operatingExpenses,
      ganancia_bruta: revenue - cost,
      ganancia_neta: revenue - cost - operatingExpenses,
      lineas_sin_costo: Number(sale.lineas_sin_costo || 0),
      ganancia_completa: Number(sale.lineas_sin_costo || 0) === 0,
    };
    if (Number(sale.lineas_sin_costo || 0) > 0) {
      return { ...result, ganancia_bruta: null, ganancia_neta: null };
    }
    return result;
  }

  return {
    real: totals(false),
    demostracion: totals(true),
    nota: 'Las ventas y gastos marcados como demostración no se incluyen en las cifras reales.',
  };
}

module.exports = { summary, analytics, profitability };
