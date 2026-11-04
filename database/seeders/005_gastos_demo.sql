USE business_inventory;

INSERT INTO gastos (categoria, descripcion, monto, fecha_gasto, es_demo)
SELECT 'alquiler', 'Ejemplo de alquiler mensual (demostración)', 120000, '2026-10-01', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM gastos WHERE es_demo = TRUE AND descripcion = 'Ejemplo de alquiler mensual (demostración)'
);

INSERT INTO gastos (categoria, descripcion, monto, fecha_gasto, es_demo)
SELECT 'transporte', 'Ejemplo de transporte de mercadería (demostración)', 8500, '2026-10-08', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM gastos WHERE es_demo = TRUE AND descripcion = 'Ejemplo de transporte de mercadería (demostración)'
);

INSERT INTO gastos (categoria, descripcion, monto, fecha_gasto, es_demo)
SELECT 'publicidad', 'Ejemplo de publicidad en redes (demostración)', 15000, '2026-10-12', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM gastos WHERE es_demo = TRUE AND descripcion = 'Ejemplo de publicidad en redes (demostración)'
);

INSERT INTO gastos (categoria, descripcion, monto, fecha_gasto, es_demo)
SELECT 'servicios', 'Ejemplo de servicios públicos (demostración)', 18000, '2026-10-15', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM gastos WHERE es_demo = TRUE AND descripcion = 'Ejemplo de servicios públicos (demostración)'
);

INSERT INTO gastos (categoria, descripcion, monto, fecha_gasto, es_demo)
SELECT 'suministros', 'Ejemplo de empaques y suministros (demostración)', 6500, '2026-10-22', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM gastos WHERE es_demo = TRUE AND descripcion = 'Ejemplo de empaques y suministros (demostración)'
);
