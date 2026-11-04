# Pruebas API

1. Crear la base con `database/01_database.sql`, estructura con `02_schema.sql` y datos con `03_seed.sql`.
2. Copiar `backend/.env.example` a `backend/.env` y colocar las credenciales de MySQL 8.0.
3. Ejecutar `npm install:all` desde la raíz.
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

Los tests automáticos cubren health check, 404 y validaciones. Las pruebas CRUD completas requieren que MySQL esté encendido y se pueden ejecutar desde Postman con los endpoints documentados.
