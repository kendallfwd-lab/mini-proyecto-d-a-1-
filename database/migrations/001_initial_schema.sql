CREATE DATABASE IF NOT EXISTS business_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE business_inventory;

CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS proveedores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NULL,
  telefono VARCHAR(25) NULL,
  direccion TEXT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_proveedores_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  precio DECIMAL(12,2) NOT NULL,
  stock INT NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  proveedor_id INT UNSIGNED NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_productos_precio CHECK (precio >= 0),
  CONSTRAINT chk_productos_stock CHECK (stock >= 0),
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_productos_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_productos_categoria (categoria_id),
  INDEX idx_productos_proveedor (proveedor_id),
  INDEX idx_productos_stock (stock),
  INDEX idx_productos_nombre (nombre)
) ENGINE=InnoDB;
