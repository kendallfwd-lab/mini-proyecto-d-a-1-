# Business Inventory Manager

Sistema empresarial full stack para administrar productos, categorías y proveedores con MySQL 8.0, Express y React/Vite.

## Inicio rápido

```powershell
npm run install:all
Copy-Item backend/.env.example backend/.env
# editar backend/.env con las credenciales de MySQL
npm run dev:backend
# en otra terminal
npm run dev:frontend
```

Antes de arrancar la API, ejecutar en MySQL Workbench los archivos de `database/` en orden. `03_seed.sql` agrega datos demo idempotentes, `05_imagenes_productos.sql` relaciona los productos con imágenes y `06_drop_zone_catalogo.sql` aplica la marca, categorías, proveedores y catálogo de Drop_Zone CR. La API queda en `http://localhost:3010` y Vite en `http://localhost:5173`.

## Estructura

- `backend/src`: API Express, modelos SQL, validadores y controladores.
- `frontend/src`: panel React con resumen, productos, categorías y proveedores.
- `database`: creación, esquema, seed y consultas de verificación.
- `docs`: justificación, modelo ER, endpoints y pruebas.

## Comandos

`npm test` ejecuta las pruebas backend · `npm run build` valida el build frontend · `GET /api/health` comprueba la API.

No se incluye autenticación ni roles en esta versión, conforme al alcance del proyecto.
