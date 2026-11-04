USE business_inventory;

SET @columna_imagen = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'imagen_url'
);
SET @sentencia_imagen = IF(@columna_imagen = 0,
  'ALTER TABLE productos ADD COLUMN imagen_url VARCHAR(255) NULL AFTER descripcion',
  'SELECT 1');
PREPARE stmt FROM @sentencia_imagen;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE productos SET nombre='Cable Samsung USB-C negro', imagen_url='/products/cable-samsung-usbc-negro.webp' WHERE codigo='COMP-001';
UPDATE productos SET nombre='AirPods Max', imagen_url='/products/airpods-max.webp' WHERE codigo='COMP-002';
UPDATE productos SET nombre='Estuche iPhone rosado transparente', imagen_url='/products/estuche-iphone-rosado-transparent.webp' WHERE codigo='COMP-003';
UPDATE productos SET nombre='Estuche iPhone arena transparente', imagen_url='/products/estuche-iphone-arena-transparent.webp' WHERE codigo='COMP-004';
UPDATE productos SET nombre='AirPods 3', imagen_url='/products/airpods-3.webp' WHERE codigo='COMP-005';
UPDATE productos SET nombre='Estuche iPhone fucsia transparente', imagen_url='/products/estuche-fucsia-transparent.webp' WHERE codigo='ACC-001';
UPDATE productos SET nombre='Estuche azul oscuro', imagen_url='/products/estuche-azul-oscuro.webp' WHERE codigo='ACC-002';
UPDATE productos SET nombre='Apple Pencil', imagen_url='/products/apple-pencil.webp' WHERE codigo='ACC-003';
UPDATE productos SET nombre='Estuche iPhone menta', imagen_url='/products/estuche-iphone-menta-transparent.webp' WHERE codigo='ACC-004';
UPDATE productos SET nombre='EarPods Lightning Premium', imagen_url='/products/earpods-lightning-premium.webp' WHERE codigo='ACC-005';
UPDATE productos SET nombre='Adaptador Samsung 45W', imagen_url='/products/samsung-adaptador-45w-sin-cable.webp' WHERE codigo='AUD-001';
UPDATE productos SET nombre='Estuche gris', imagen_url='/products/estuche-gris.webp' WHERE codigo='AUD-002';
UPDATE productos SET nombre='Cable Apple Lightning USB 1m', imagen_url='/products/cable-apple-lightning-usb-1m.png' WHERE codigo='AUD-003';
UPDATE productos SET nombre='Cable USB-C 60W 1m', imagen_url='/products/cable-usb-c-60w-1m.webp' WHERE codigo='AUD-004';
UPDATE productos SET nombre='Estuche iPhone café', imagen_url='/products/estuche-iphone-cafe.webp' WHERE codigo='AUD-005';
UPDATE productos SET nombre='Estuche iPhone arena', imagen_url='/products/estuche-iphone-arena.webp' WHERE codigo='ALM-001';
UPDATE productos SET nombre='Estuche turquesa', imagen_url='/products/estuche-turquesa.webp' WHERE codigo='ALM-002';
UPDATE productos SET nombre='Batería magnética 10000mAh', imagen_url='/products/bateria-magnetica-10000mah.webp' WHERE codigo='ALM-003';
UPDATE productos SET nombre='EarPods Lightning transparente', imagen_url='/products/earpods-lightning-premium-transparent.webp' WHERE codigo='ALM-004';
UPDATE productos SET nombre='Cable Samsung USB-C blanco', imagen_url='/products/cable-samsung-usbc-blanco.webp' WHERE codigo='ALM-005';
UPDATE productos SET nombre='Kit cargador Apple 35W', imagen_url='/products/kit-cargador-apple-35w-cable.webp' WHERE codigo='RED-001';
UPDATE productos SET nombre='Estuche negro transparente', imagen_url='/products/estuche-negro-transparent.webp' WHERE codigo='RED-002';
UPDATE productos SET nombre='Estuche turquesa transparente', imagen_url='/products/estuche-turquesa-transparent.webp' WHERE codigo='RED-003';
UPDATE productos SET nombre='Batería magnética 5000mAh', imagen_url='/products/bateria-magnetica-5000mah.webp' WHERE codigo='RED-004';
UPDATE productos SET nombre='Adaptador audio USB-C', imagen_url='/products/adaptador-audio-usb-c.webp' WHERE codigo='RED-005';
UPDATE productos SET nombre='AirPods 4', imagen_url='/products/airpods-4.webp' WHERE codigo='PER-001';
UPDATE productos SET nombre='Cable Apple Lightning con empaque', imagen_url='/products/cable-apple-lightning-usb-1m-empaque.png' WHERE codigo='PER-002';
UPDATE productos SET nombre='AirPods Pro 2', imagen_url='/products/airpods-pro-2.webp' WHERE codigo='PER-003';
UPDATE productos SET nombre='Galaxy Buds3 Pro', imagen_url='/products/galaxy-buds3-pro.webp' WHERE codigo='PER-004';
UPDATE productos SET nombre='Adaptador audio Lightning', imagen_url='/products/adaptador-audio-lightning.webp' WHERE codigo='PER-005';
