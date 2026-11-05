-- Ejecutar con una cuenta administrativa, sustituyendo la contraseña por una secreta.
-- La aplicación no debe conectarse como root.
CREATE USER IF NOT EXISTS 'business_inventory_app'@'localhost' IDENTIFIED BY 'REPLACE_WITH_SECRET';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON business_inventory.* TO 'business_inventory_app'@'localhost';
FLUSH PRIVILEGES;
