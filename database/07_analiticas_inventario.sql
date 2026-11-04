USE business_inventory;

CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT UNSIGNED NOT NULL,
  tipo ENUM('entrada','salida','ajuste') NOT NULL,
  cantidad INT NOT NULL,
  motivo VARCHAR(120) NOT NULL,
  fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_movimientos_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_movimientos_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
  INDEX idx_movimientos_fecha (fecha_movimiento),
  INDEX idx_movimientos_tipo (tipo)
);

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha_venta DATETIME NOT NULL,
  cliente VARCHAR(120) NOT NULL,
  canal ENUM('tienda','whatsapp','instagram','web') NOT NULL,
  estado ENUM('pagada','pendiente','cancelada') NOT NULL DEFAULT 'pagada',
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  INDEX idx_ventas_fecha (fecha_venta),
  INDEX idx_ventas_estado (estado)
);

CREATE TABLE IF NOT EXISTS venta_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) AS (cantidad * precio_unitario) STORED,
  CONSTRAINT chk_venta_detalle_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_venta_detalle_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  CONSTRAINT fk_venta_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
  INDEX idx_venta_detalle_producto (producto_id)
);

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

INSERT INTO ventas (fecha_venta, cliente, canal, estado, total) VALUES
('2026-10-05 10:20:00','Cliente mostrador','tienda','pagada',45000),
('2026-10-08 14:10:00','Pedido WhatsApp #001','whatsapp','pagada',36000),
('2026-10-12 16:45:00','Cliente Instagram #002','instagram','pagada',20000),
('2026-10-18 11:30:00','Cliente mostrador','tienda','pagada',31000),
('2026-10-24 13:05:00','Pedido web #004','web','pagada',40000),
('2026-10-29 17:25:00','Cliente mostrador','tienda','pendiente',9500);

INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario)
SELECT 1, id, 1, precio FROM productos WHERE codigo='DZ-001'
UNION ALL SELECT 1, id, 1, precio FROM productos WHERE codigo='DZ-006'
UNION ALL SELECT 2, id, 1, precio FROM productos WHERE codigo='DZ-002'
UNION ALL SELECT 2, id, 1, precio FROM productos WHERE codigo='DZ-012'
UNION ALL SELECT 3, id, 1, precio FROM productos WHERE codigo='DZ-009'
UNION ALL SELECT 4, id, 1, precio FROM productos WHERE codigo='DZ-005'
UNION ALL SELECT 4, id, 1, precio FROM productos WHERE codigo='DZ-014'
UNION ALL SELECT 5, id, 2, precio FROM productos WHERE codigo='DZ-007'
UNION ALL SELECT 5, id, 2, precio FROM productos WHERE codigo='DZ-008'
UNION ALL SELECT 6, id, 1, precio FROM productos WHERE codigo='DZ-015';

INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo, fecha_movimiento)
SELECT vd.producto_id, 'salida', vd.cantidad, CONCAT('Venta #', vd.venta_id), v.fecha_venta
FROM venta_detalle vd JOIN ventas v ON v.id = vd.venta_id
WHERE v.estado = 'pagada';
