USE business_inventory;

INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo, fecha_movimiento)
SELECT id, 'entrada', CASE codigo
  WHEN 'DZ-001' THEN 12 WHEN 'DZ-002' THEN 10 WHEN 'DZ-003' THEN 20 WHEN 'DZ-004' THEN 15
  WHEN 'DZ-005' THEN 8 WHEN 'DZ-006' THEN 25 WHEN 'DZ-007' THEN 30 WHEN 'DZ-008' THEN 20
  WHEN 'DZ-009' THEN 12 WHEN 'DZ-010' THEN 25 WHEN 'DZ-011' THEN 18 WHEN 'DZ-012' THEN 35
  WHEN 'DZ-013' THEN 20 WHEN 'DZ-014' THEN 15 WHEN 'DZ-015' THEN 20 WHEN 'DZ-016' THEN 25
  WHEN 'DZ-017' THEN 15 WHEN 'DZ-018' THEN 30 WHEN 'DZ-019' THEN 25 WHEN 'DZ-020' THEN 20 ELSE 10 END,
  'Inventario inicial Drop_Zone', '2026-10-01 09:00:00'
FROM productos p
WHERE p.codigo LIKE 'DZ-%'
  AND NOT EXISTS (SELECT 1 FROM movimientos_inventario m WHERE m.producto_id = p.id AND m.motivo = 'Inventario inicial Drop_Zone');

INSERT INTO ventas (fecha_venta, cliente, canal, estado, es_demo, total) VALUES
('2026-10-05 10:20:00','Cliente mostrador','tienda','pagada',TRUE,45000),
('2026-10-08 14:10:00','Pedido WhatsApp #001','whatsapp','pagada',TRUE,36000),
('2026-10-12 16:45:00','Cliente Instagram #002','instagram','pagada',TRUE,20000),
('2026-10-18 11:30:00','Cliente mostrador','tienda','pagada',TRUE,31000),
('2026-10-24 13:05:00','Pedido web #004','web','pagada',TRUE,40000),
('2026-10-29 17:25:00','Cliente mostrador','tienda','pendiente',TRUE,9500);

INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario, costo_unitario)
SELECT 1, id, 1, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-001' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=1 AND producto_id=productos.id)
UNION ALL SELECT 1, id, 1, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-006' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=1 AND producto_id=productos.id)
UNION ALL SELECT 2, id, 1, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-002' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=2 AND producto_id=productos.id)
UNION ALL SELECT 2, id, 1, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-012' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=2 AND producto_id=productos.id)
UNION ALL SELECT 3, id, 1, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-009' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=3 AND producto_id=productos.id)
UNION ALL SELECT 4, id, 1, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-005' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=4 AND producto_id=productos.id)
UNION ALL SELECT 4, id, 1, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-014' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=4 AND producto_id=productos.id)
UNION ALL SELECT 5, id, 2, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-007' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=5 AND producto_id=productos.id)
UNION ALL SELECT 5, id, 2, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-008' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=5 AND producto_id=productos.id)
UNION ALL SELECT 6, id, 1, precio, ROUND(precio * 0.6, 2) FROM productos WHERE codigo='DZ-015' AND NOT EXISTS (SELECT 1 FROM venta_detalle WHERE venta_id=6 AND producto_id=productos.id);

INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo, fecha_movimiento)
SELECT vd.producto_id, 'salida', vd.cantidad, CONCAT('Venta #', vd.venta_id), v.fecha_venta
FROM venta_detalle vd JOIN ventas v ON v.id = vd.venta_id
WHERE v.estado = 'pagada';
