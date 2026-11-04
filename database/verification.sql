USE business_inventory;
SHOW TABLES;
SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'business_inventory' AND REFERENCED_TABLE_NAME IS NOT NULL;
SELECT 'categorias' AS tabla, COUNT(*) AS registros FROM categorias UNION ALL SELECT 'proveedores', COUNT(*) FROM proveedores UNION ALL SELECT 'productos', COUNT(*) FROM productos;
SELECT p.codigo, p.nombre, c.nombre AS categoria, pr.nombre AS proveedor, p.precio, p.stock FROM productos p JOIN categorias c ON c.id = p.categoria_id JOIN proveedores pr ON pr.id = p.proveedor_id ORDER BY p.id;
