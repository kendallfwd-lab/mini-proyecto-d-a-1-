USE business_inventory;

CREATE TABLE IF NOT EXISTS sesiones (
  id CHAR(36) NOT NULL,
  usuario_id BIGINT UNSIGNED NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultima_actividad TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion TIMESTAMP NOT NULL,
  revocada_en TIMESTAMP NULL,
  ip_origen VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_sesiones_usuario_activa (usuario_id, revocada_en, fecha_expiracion)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sesion_id CHAR(36) NOT NULL,
  hash_token BINARY(32) NOT NULL,
  familia_id CHAR(36) NOT NULL,
  fecha_emision TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_uso TIMESTAMP NULL,
  fecha_expiracion TIMESTAMP NOT NULL,
  revocado_en TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_hash (hash_token),
  CONSTRAINT fk_refresh_sesion FOREIGN KEY (sesion_id) REFERENCES sesiones(id) ON DELETE CASCADE,
  INDEX idx_refresh_sesion (sesion_id),
  INDEX idx_refresh_familia (familia_id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auditoria_eventos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NULL,
  accion VARCHAR(80) NOT NULL,
  entidad VARCHAR(80) NULL,
  registro_id VARCHAR(80) NULL,
  fecha_evento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resultado ENUM('exitoso', 'fallido') NOT NULL,
  metadatos JSON NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_auditoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_auditoria_fecha (fecha_evento),
  INDEX idx_auditoria_usuario (usuario_id, fecha_evento),
  INDEX idx_auditoria_accion (accion, fecha_evento)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
