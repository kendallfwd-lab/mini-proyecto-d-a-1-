# Pruebas API

1. Ejecutar las migraciones `001_initial_schema.sql`, `002_gastos_rentabilidad.sql`, `003_compras_clientes.sql` y `004_facturas.sql`, y después los seeders `001` a `007` en orden.
2. Copiar `backend/.env.example` a `backend/.env` y colocar las credenciales de MySQL 8.0.
3. Ejecutar `npm run install:all` desde la raíz.
4. Levantar API con `npm run dev:backend` y validar `GET http://localhost:3010/api/health`.
5. Levantar la interfaz con `npm run dev:frontend`.

Ejemplo de creación:

```json
POST /api/productos
{
  "codigo": "DEMO-001",
  "nombre": "Producto de demostración",
  "descripcion": "Registro creado desde Postman",
  "precio": 12500,
  "stock": 12,
  "categoria_id": 1,
  "proveedor_id": 1
}
```

Las pruebas automatizadas se ejecutan con `npm test` y cubren health check, 404, CRUD HTTP, dashboard, ventas, facturas, clientes, pedidos y validaciones; no necesitan una base MySQL activa porque aíslan los servicios. Las pruebas de persistencia requieren MySQL encendido y se pueden ejecutar desde Postman con los endpoints documentados. Los seeders `006` y `007` se pueden ejecutar más de una vez; comprueba que Ventas muestre los ejemplos DEMO, que Facturas incluya comprobantes de muestra y que las compras demo no ofrezcan la acción de recepción ni el envío por WhatsApp. Una venta real requiere teléfono del cliente y genera factura inmediatamente.
