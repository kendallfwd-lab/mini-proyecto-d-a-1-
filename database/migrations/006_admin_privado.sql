USE business_inventory;

-- Migración compatible con la tabla usuarios creada en 005_usuarios_auth.sql.
ALTER TABLE usuarios
  MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ADD COLUMN es_principal TINYINT(1) NOT NULL DEFAULT 0 AFTER password_hash,
  ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER es_principal,
  ADD COLUMN version_token INT UNSIGNED NOT NULL DEFAULT 0 AFTER activo,
  ADD COLUMN fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER fecha_creacion,
  ADD COLUMN principal_unico TINYINT GENERATED ALWAYS AS (CASE WHEN es_principal = 1 THEN 1 ELSE NULL END) STORED,
  ADD UNIQUE KEY uq_usuarios_principal (principal_unico),
  ADD CONSTRAINT chk_usuarios_principal CHECK (es_principal IN (0, 1)),
  ADD CONSTRAINT chk_usuarios_activo CHECK (activo IN (0, 1));

-- No crea cuentas ni contraseñas. Ejecutar backend/scripts/bootstrapAdmin.js.
