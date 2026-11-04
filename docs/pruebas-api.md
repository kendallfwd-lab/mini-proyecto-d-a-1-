# Pruebas API

1. Ejecutar `database/migrations/001_initial_schema.sql` y después los seeders `001` a `004` en orden.
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

Las pruebas automatizadas se ejecutan con `npm test` y cubren health check, 404, CRUD HTTP, rutas del dashboard y validaciones; no necesitan una base MySQL activa porque aíslan los servicios. Las pruebas de persistencia requieren MySQL encendido y se pueden ejecutar desde Postman con los endpoints documentados.
