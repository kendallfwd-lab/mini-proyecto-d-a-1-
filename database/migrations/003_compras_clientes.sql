USE business_inventory;

CREATE TABLE IF NOT EXISTS clientes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(150) NULL,
  telefono VARCHAR(25) NULL,
  direccion TEXT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_clientes_nombre (nombre),
  INDEX idx_clientes_correo (correo)
) ENGINE=InnoDB;

SET @cliente_demo_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clientes' AND COLUMN_NAME = 'es_demo'
);
SET @sql_cliente_demo = IF(
  @cliente_demo_existia = 0,
  'ALTER TABLE clientes ADD COLUMN es_demo BOOLEAN NOT NULL DEFAULT FALSE AFTER direccion',
  'SELECT 1'
);
PREPARE stmt FROM @sql_cliente_demo;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proveedor_id INT UNSIGNED NOT NULL,
  fecha_pedido DATE NOT NULL,
  estado ENUM('pendiente','recibida','cancelada') NOT NULL DEFAULT 'pendiente',
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  notas VARCHAR(500) NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_recepcion DATETIME NULL,
  CONSTRAINT fk_compras_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_compras_proveedor (proveedor_id),
  INDEX idx_compras_estado_fecha (estado, fecha_pedido)
) ENGINE=InnoDB;

SET @compra_demo_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'compras' AND COLUMN_NAME = 'es_demo'
);
SET @sql_compra_demo = IF(
  @compra_demo_existia = 0,
  'ALTER TABLE compras ADD COLUMN es_demo BOOLEAN NOT NULL DEFAULT FALSE AFTER notas',
  'SELECT 1'
);
PREPARE stmt FROM @sql_compra_demo;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS compra_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  compra_id INT NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  cantidad INT NOT NULL,
  cantidad_recibida INT NOT NULL DEFAULT 0,
  costo_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) AS (cantidad * costo_unitario) STORED,
  CONSTRAINT chk_compra_detalle_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_compra_detalle_recibida CHECK (cantidad_recibida >= 0 AND cantidad_recibida <= cantidad),
  CONSTRAINT chk_compra_detalle_costo CHECK (costo_unitario >= 0),
  CONSTRAINT fk_compra_detalle_compra FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
  CONSTRAINT fk_compra_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
  UNIQUE KEY uq_compra_detalle_producto (compra_id, producto_id),
  INDEX idx_compra_detalle_producto (producto_id)
) ENGINE=InnoDB;

SET @cliente_id_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ventas' AND COLUMN_NAME = 'cliente_id'
);
SET @sql_cliente_id = IF(
  @cliente_id_existia = 0,
  'ALTER TABLE ventas ADD COLUMN cliente_id INT UNSIGNED NULL AFTER cliente',
  'SELECT 1'
);
PREPARE stmt FROM @sql_cliente_id;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @cliente_id_index_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ventas' AND INDEX_NAME = 'idx_ventas_cliente'
);
SET @sql_cliente_id_index = IF(
  @cliente_id_index_existia = 0,
  'ALTER TABLE ventas ADD INDEX idx_ventas_cliente (cliente_id)',
  'SELECT 1'
);
PREPARE stmt FROM @sql_cliente_id_index;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @cliente_id_fk_existia = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ventas' AND CONSTRAINT_NAME = 'fk_ventas_cliente'
);
SET @sql_cliente_id_fk = IF(
  @cliente_id_fk_existia = 0,
  'ALTER TABLE ventas ADD CONSTRAINT fk_ventas_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON UPDATE CASCADE ON DELETE RESTRICT',
  'SELECT 1'
);
PREPARE stmt FROM @sql_cliente_id_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

INSERT INTO clientes (nombre)
SELECT DISTINCT TRIM(v.cliente)
FROM ventas v
WHERE v.es_demo = FALSE
  AND v.cliente_id IS NULL
  AND TRIM(v.cliente) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM clientes c WHERE c.nombre = TRIM(v.cliente)
  );

UPDATE ventas v
JOIN clientes c ON c.nombre = TRIM(v.cliente)
SET v.cliente_id = c.id
WHERE v.es_demo = FALSE AND v.cliente_id IS NULL;
