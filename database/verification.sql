USE business_inventory;
SHOW TABLES;
SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'business_inventory' AND REFERENCED_TABLE_NAME IS NOT NULL;
SELECT 'categorias' AS tabla, COUNT(*) AS registros FROM categorias
UNION ALL SELECT 'proveedores', COUNT(*) FROM proveedores
UNION ALL SELECT 'productos', COUNT(*) FROM productos
UNION ALL SELECT 'clientes reales', COUNT(*) FROM clientes WHERE es_demo = FALSE
UNION ALL SELECT 'clientes demo', COUNT(*) FROM clientes WHERE es_demo = TRUE
UNION ALL SELECT 'compras reales', COUNT(*) FROM compras WHERE es_demo = FALSE
UNION ALL SELECT 'compras demo', COUNT(*) FROM compras WHERE es_demo = TRUE
UNION ALL SELECT 'facturas reales', COUNT(*) FROM facturas WHERE es_demo = FALSE
UNION ALL SELECT 'facturas demo', COUNT(*) FROM facturas WHERE es_demo = TRUE;
SELECT c.nombre, c.es_demo, COUNT(v.id) AS ventas_demo, COALESCE(SUM(v.total), 0) AS total_demo
FROM clientes c
LEFT JOIN ventas v ON v.cliente_id = c.id AND v.es_demo = TRUE
GROUP BY c.id, c.nombre, c.es_demo
ORDER BY c.es_demo DESC, c.nombre;
SELECT c.id AS compra_id, p.nombre AS proveedor, c.estado, c.es_demo, c.notas,
  pr.codigo, pr.nombre AS producto, cd.cantidad, cd.cantidad_recibida, cd.costo_unitario
FROM compras c
JOIN proveedores p ON p.id = c.proveedor_id
JOIN compra_detalle cd ON cd.compra_id = c.id
JOIN productos pr ON pr.id = cd.producto_id
ORDER BY c.fecha_pedido DESC, c.id DESC;
SELECT f.numero_factura, f.fecha_emision, f.es_demo, f.telefono_cliente, v.cliente,
  v.total, COUNT(vd.id) AS lineas
FROM facturas f
JOIN ventas v ON v.id = f.venta_id
LEFT JOIN venta_detalle vd ON vd.venta_id = v.id
GROUP BY f.id, f.numero_factura, f.fecha_emision, f.es_demo, f.telefono_cliente, v.cliente, v.total
ORDER BY f.fecha_emision DESC;
SELECT p.codigo, p.nombre, c.nombre AS categoria, pr.nombre AS proveedor, p.precio, p.stock FROM productos p JOIN categorias c ON c.id = p.categoria_id JOIN proveedores pr ON pr.id = p.proveedor_id ORDER BY p.id;
