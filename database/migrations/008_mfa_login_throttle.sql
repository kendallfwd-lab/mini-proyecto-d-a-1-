USE business_inventory;

ALTER TABLE usuarios
  ADD COLUMN mfa_enabled TINYINT(1) NOT NULL DEFAULT 0 AFTER activo,
  ADD COLUMN mfa_secret_ciphertext VARBINARY(255) NULL AFTER mfa_enabled,
  ADD COLUMN mfa_secret_iv VARBINARY(16) NULL AFTER mfa_secret_ciphertext,
  ADD COLUMN mfa_secret_tag VARBINARY(16) NULL AFTER mfa_secret_iv;

CREATE TABLE IF NOT EXISTS login_throttles (
  identificador_hash BINARY(32) NOT NULL,
  intentos INT UNSIGNED NOT NULL DEFAULT 0,
  ultimo_intento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bloqueado_hasta TIMESTAMP NULL,
  PRIMARY KEY (identificador_hash)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
