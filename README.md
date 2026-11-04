# Drop_Zone CR — Business Inventory Manager

Sistema full stack para administrar el inventario de Drop_Zone CR con MySQL, Express y React/Vite.

## Inicio rápido

```powershell
npm run install:all
Copy-Item backend/.env.example backend/.env
# Editar backend/.env con las credenciales de MySQL
npm run dev:backend
# En otra terminal
npm run dev:frontend
```

Ejecuta en MySQL Workbench los archivos de `database/` en orden. El archivo `06_drop_zone_catalogo.sql` carga el catálogo y precios de Drop_Zone CR. El archivo `07_analiticas_inventario.sql` agrega movimientos, ventas y datos históricos para el panel.

- API: `http://localhost:3010`
- Frontend: `http://localhost:5173`
- Analíticas: `GET /api/dashboard/analiticas`

## Estructura

```text
backend/
  src/
    config/       conexión a MySQL
    controllers/  lógica de cada recurso
    models/       consultas SQL
    routes/       endpoints HTTP
    validators/   validaciones y pruebas
frontend/
  src/
    components/   componentes reutilizables
    pages/        pantallas del panel
    services/     cliente centralizado de la API
  public/         logo e imágenes del catálogo
database/         esquema, catálogo, seed y analíticas
docs/             documentación del proyecto
```

## Comandos

- `npm test`: ejecuta las pruebas del backend.
- `npm run build`: genera el build de producción del frontend.
- `npm run dev:backend`: inicia la API.
- `npm run dev:frontend`: inicia React/Vite.

La raíz del proyecto contiene únicamente configuración, documentación y scripts. Todo el código de aplicación está dentro de `backend/` y `frontend/`.
