USE business_inventory;

CREATE TABLE IF NOT EXISTS facturas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  numero_factura VARCHAR(30) NOT NULL UNIQUE,
  telefono_cliente VARCHAR(25) NULL,
  fecha_emision DATETIME NOT NULL,
  es_demo BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_facturas_venta UNIQUE (venta_id),
  CONSTRAINT fk_facturas_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  INDEX idx_facturas_fecha (fecha_emision),
  INDEX idx_facturas_demo_fecha (es_demo, fecha_emision)
) ENGINE=InnoDB;
