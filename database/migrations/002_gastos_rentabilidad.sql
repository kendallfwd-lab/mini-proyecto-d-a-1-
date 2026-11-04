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
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha_venta DATETIME NOT NULL,
  cliente VARCHAR(120) NOT NULL,
  canal ENUM('tienda','whatsapp','instagram','web') NOT NULL,
  estado ENUM('pagada','pendiente','cancelada') NOT NULL DEFAULT 'pagada',
  es_demo BOOLEAN NOT NULL DEFAULT FALSE,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  INDEX idx_ventas_fecha (fecha_venta),
  INDEX idx_ventas_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS venta_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  costo_unitario DECIMAL(12,2) NULL,
  subtotal DECIMAL(12,2) AS (cantidad * precio_unitario) STORED,
  CONSTRAINT chk_venta_detalle_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_venta_detalle_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  CONSTRAINT fk_venta_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
  INDEX idx_venta_detalle_producto (producto_id)
) ENGINE=InnoDB;

SET @costo_producto_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'costo_unitario'
);
SET @sql_costo_producto = IF(
  @costo_producto_existia = 0,
  'ALTER TABLE productos ADD COLUMN costo_unitario DECIMAL(12,2) NULL AFTER descripcion, ADD CONSTRAINT chk_productos_costo CHECK (costo_unitario IS NULL OR costo_unitario >= 0)',
  'SELECT 1'
);
PREPARE stmt FROM @sql_costo_producto;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @costo_producto_check_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND CONSTRAINT_NAME = 'chk_productos_costo'
);
SET @sql_costo_producto_check = IF(
  @costo_producto_check_existia = 0,
  'ALTER TABLE productos ADD CONSTRAINT chk_productos_costo CHECK (costo_unitario IS NULL OR costo_unitario >= 0)',
  'SELECT 1'
);
PREPARE stmt FROM @sql_costo_producto_check;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @demo_venta_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ventas' AND COLUMN_NAME = 'es_demo'
);
SET @sql_demo_venta = IF(
  @demo_venta_existia = 0,
  'ALTER TABLE ventas ADD COLUMN es_demo BOOLEAN NOT NULL DEFAULT FALSE AFTER estado',
  'SELECT 1'
);
PREPARE stmt FROM @sql_demo_venta;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @costo_detalle_check_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'venta_detalle' AND CONSTRAINT_NAME = 'chk_venta_detalle_costo'
);
SET @sql_costo_detalle_check = IF(
  @costo_detalle_check_existia = 0,
  'ALTER TABLE venta_detalle ADD CONSTRAINT chk_venta_detalle_costo CHECK (costo_unitario IS NULL OR costo_unitario >= 0)',
  'SELECT 1'
);
PREPARE stmt FROM @sql_costo_detalle_check;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql_marcar_ventas_demo = IF(
  @demo_venta_existia = 0,
  'UPDATE ventas SET es_demo = TRUE',
  'SELECT 1'
);
PREPARE stmt FROM @sql_marcar_ventas_demo;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @costo_detalle_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'venta_detalle' AND COLUMN_NAME = 'costo_unitario'
);
SET @sql_costo_detalle = IF(
  @costo_detalle_existia = 0,
  'ALTER TABLE venta_detalle ADD COLUMN costo_unitario DECIMAL(12,2) NULL AFTER precio_unitario',
  'SELECT 1'
);
PREPARE stmt FROM @sql_costo_detalle;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS gastos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria ENUM('alquiler','servicios','transporte','publicidad','comisiones','suministros','otros') NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  fecha_gasto DATE NOT NULL,
  es_demo BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_gastos_monto CHECK (monto > 0),
  INDEX idx_gastos_fecha (fecha_gasto),
  INDEX idx_gastos_demo_fecha (es_demo, fecha_gasto)
) ENGINE=InnoDB;

UPDATE venta_detalle vd
JOIN ventas v ON v.id = vd.venta_id AND v.es_demo = TRUE
JOIN productos p ON p.id = vd.producto_id
SET vd.costo_unitario = ROUND(vd.precio_unitario * 0.6, 2)
WHERE vd.costo_unitario IS NULL;
