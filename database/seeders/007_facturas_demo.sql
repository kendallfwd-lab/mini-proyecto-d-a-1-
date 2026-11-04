USE business_inventory;

INSERT INTO facturas (venta_id, numero_factura, telefono_cliente, fecha_emision, es_demo)
SELECT v.id,
  CONCAT('FAC-', YEAR(v.fecha_venta), '-', LPAD(v.id, 6, '0')),
  c.telefono,
  v.fecha_venta,
  v.es_demo
FROM ventas v
LEFT JOIN clientes c ON c.id = v.cliente_id
WHERE v.estado = 'pagada'
  AND NOT EXISTS (SELECT 1 FROM facturas f WHERE f.venta_id = v.id);
