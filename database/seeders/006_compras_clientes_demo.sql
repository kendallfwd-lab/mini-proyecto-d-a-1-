USE business_inventory;

INSERT INTO clientes (nombre, correo, telefono, direccion, es_demo)
SELECT 'Cliente mostrador (DEMO)', 'mostrador.demo@example.com', '+506 8000-0001', 'El Roble, Puntarenas (dato de ejemplo)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE nombre = 'Cliente mostrador (DEMO)' AND es_demo = TRUE);

INSERT INTO clientes (nombre, correo, telefono, direccion, es_demo)
SELECT 'Pedido WhatsApp #001 (DEMO)', 'whatsapp.demo@example.com', '+506 8000-0002', 'Puntarenas (dato de ejemplo)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE nombre = 'Pedido WhatsApp #001 (DEMO)' AND es_demo = TRUE);

INSERT INTO clientes (nombre, correo, telefono, direccion, es_demo)
SELECT 'Cliente Instagram #002 (DEMO)', 'instagram.demo@example.com', '+506 8000-0003', 'El Roble, Puntarenas (dato de ejemplo)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE nombre = 'Cliente Instagram #002 (DEMO)' AND es_demo = TRUE);

INSERT INTO clientes (nombre, correo, telefono, direccion, es_demo)
SELECT 'Pedido web #004 (DEMO)', 'web.demo@example.com', '+506 8000-0004', 'Puntarenas (dato de ejemplo)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE nombre = 'Pedido web #004 (DEMO)' AND es_demo = TRUE);

UPDATE ventas v
JOIN clientes c ON c.es_demo = TRUE
  AND c.nombre = CASE v.cliente
    WHEN 'Cliente mostrador' THEN 'Cliente mostrador (DEMO)'
    WHEN 'Pedido WhatsApp #001' THEN 'Pedido WhatsApp #001 (DEMO)'
    WHEN 'Cliente Instagram #002' THEN 'Cliente Instagram #002 (DEMO)'
    WHEN 'Pedido web #004' THEN 'Pedido web #004 (DEMO)'
    ELSE ''
  END
SET v.cliente_id = c.id
WHERE v.es_demo = TRUE AND v.cliente_id IS NULL;

INSERT INTO compras (proveedor_id, fecha_pedido, estado, total, notas, es_demo)
SELECT p.proveedor_id, '2026-10-25', 'pendiente', ROUND(p.precio * 0.65 * 8, 2),
  'DEMO · Reposición de 8 unidades de DZ-009', TRUE
FROM productos p
WHERE p.codigo = 'DZ-009'
  AND NOT EXISTS (SELECT 1 FROM compras WHERE notas = 'DEMO · Reposición de 8 unidades de DZ-009');

INSERT INTO compra_detalle (compra_id, producto_id, cantidad, cantidad_recibida, costo_unitario)
SELECT c.id, p.id, 8, 0, ROUND(p.precio * 0.65, 2)
FROM compras c
JOIN productos p ON p.codigo = 'DZ-009'
WHERE c.notas = 'DEMO · Reposición de 8 unidades de DZ-009'
  AND NOT EXISTS (SELECT 1 FROM compra_detalle WHERE compra_id = c.id AND producto_id = p.id);

INSERT INTO compras (proveedor_id, fecha_pedido, estado, total, notas, es_demo)
SELECT p.proveedor_id, '2026-10-27', 'pendiente', ROUND(p.precio * 0.65 * 10, 2),
  'DEMO · Reposición de 10 unidades de DZ-014', TRUE
FROM productos p
WHERE p.codigo = 'DZ-014'
  AND NOT EXISTS (SELECT 1 FROM compras WHERE notas = 'DEMO · Reposición de 10 unidades de DZ-014');

INSERT INTO compra_detalle (compra_id, producto_id, cantidad, cantidad_recibida, costo_unitario)
SELECT c.id, p.id, 10, 0, ROUND(p.precio * 0.65, 2)
FROM compras c
JOIN productos p ON p.codigo = 'DZ-014'
WHERE c.notas = 'DEMO · Reposición de 10 unidades de DZ-014'
  AND NOT EXISTS (SELECT 1 FROM compra_detalle WHERE compra_id = c.id AND producto_id = p.id);

INSERT INTO compras (proveedor_id, fecha_pedido, estado, total, notas, es_demo)
SELECT p.proveedor_id, '2026-10-29', 'pendiente', ROUND(p.precio * 0.65 * 12, 2),
  'DEMO · Reposición de 12 unidades de DZ-012', TRUE
FROM productos p
WHERE p.codigo = 'DZ-012'
  AND NOT EXISTS (SELECT 1 FROM compras WHERE notas = 'DEMO · Reposición de 12 unidades de DZ-012');

INSERT INTO compra_detalle (compra_id, producto_id, cantidad, cantidad_recibida, costo_unitario)
SELECT c.id, p.id, 12, 0, ROUND(p.precio * 0.65, 2)
FROM compras c
JOIN productos p ON p.codigo = 'DZ-012'
WHERE c.notas = 'DEMO · Reposición de 12 unidades de DZ-012'
  AND NOT EXISTS (SELECT 1 FROM compra_detalle WHERE compra_id = c.id AND producto_id = p.id);

INSERT INTO compras (proveedor_id, fecha_pedido, estado, total, notas, es_demo)
SELECT p.proveedor_id, '2026-10-31', 'pendiente', ROUND(p.precio * 0.65 * 6, 2),
  'DEMO · Reposición de 6 unidades de DZ-004', TRUE
FROM productos p
WHERE p.codigo = 'DZ-004'
  AND NOT EXISTS (SELECT 1 FROM compras WHERE notas = 'DEMO · Reposición de 6 unidades de DZ-004');

INSERT INTO compra_detalle (compra_id, producto_id, cantidad, cantidad_recibida, costo_unitario)
SELECT c.id, p.id, 6, 0, ROUND(p.precio * 0.65, 2)
FROM compras c
JOIN productos p ON p.codigo = 'DZ-004'
WHERE c.notas = 'DEMO · Reposición de 6 unidades de DZ-004'
  AND NOT EXISTS (SELECT 1 FROM compra_detalle WHERE compra_id = c.id AND producto_id = p.id);
