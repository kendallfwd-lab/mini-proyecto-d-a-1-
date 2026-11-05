# Drop_Zone CR — Inventario

Aplicación para administrar productos, categorías y proveedores, con panel de inventario y analíticas. Está dividida en React/Vite, una API REST con Express y MySQL.

## Preparar el entorno

Requisitos: Node.js 18+, MySQL 8+.

```powershell
npm run install:all
if (!(Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
if (!(Test-Path frontend/.env)) { Copy-Item frontend/.env.example frontend/.env }
```

Configura `backend/.env` con el usuario y la contraseña de MySQL. No agregues archivos `.env` al repositorio. La aplicación usa:

- API: `http://localhost:3010`
- Frontend: `http://localhost:5173`
- URL de API del frontend: `VITE_API_URL` (por defecto `http://localhost:3010/api`)

## Crear y cargar la base de datos

En MySQL Workbench, ejecuta en este orden:

1. `database/migrations/001_initial_schema.sql`
2. `database/migrations/002_gastos_rentabilidad.sql`
3. `database/migrations/003_compras_clientes.sql`
4. `database/migrations/004_facturas.sql`
5. `database/seeders/001_datos_iniciales.sql`
6. `database/seeders/002_imagenes_productos.sql`
7. `database/seeders/003_catalogo_drop_zone.sql`
8. `database/seeders/004_analiticas_inventario.sql`
9. `database/seeders/005_gastos_demo.sql`
10. `database/seeders/006_compras_clientes_demo.sql`
11. `database/seeders/007_facturas_demo.sql`

`database/schema.sql` contiene el esquema inicial completo para crear la base desde cero. `database/verification.sql` permite inspeccionar tablas, relaciones y registros.

## Ejecutar

Abre dos terminales desde la raíz:

```powershell
npm run dev:backend
```

```powershell
npm run dev:frontend
```

La API ofrece gestión de productos, categorías, proveedores, clientes, compras, ventas, facturas y gastos, además de los endpoints `/api/dashboard/resumen`, `/api/dashboard/analiticas` y `/api/dashboard/rentabilidad`. Las compras permiten recepciones parciales; cada entrada actualiza existencias, el costo vigente del producto y el historial de movimientos. Las ventas piden un teléfono y crean una factura numerada automáticamente. En `/facturas` se puede consultar, imprimir/guardar en PDF y abrir WhatsApp con el detalle preparado para revisión y envío manual. Los seeders `006_compras_clientes_demo.sql` y `007_facturas_demo.sql` agregan clientes, pedidos, ventas y facturas de demostración: están marcados como DEMO, no alteran existencias ni se mezclan con cifras reales, y no se pueden enviar por WhatsApp. El endpoint `/api/health` comprueba el estado HTTP de la API.

## Pruebas y compilación

```powershell
npm test
npm run build
```

## Estructura y responsabilidades

```text
backend/
  src/config/       Conexión MySQL y política CORS
  src/controllers/  Traduce solicitudes HTTP a respuestas
  src/models/       Consultas parametrizadas a MySQL
  src/routes/       Define endpoints y aplica validaciones
  src/middleware/   Validación de solicitudes y errores HTTP
  src/validators/   Reglas de entrada por entidad
  src/services/     Operaciones de negocio y analíticas
  src/utils/        Errores HTTP y controladores async
  tests/            Pruebas de API y validadores
frontend/
  src/components/   Layout, formularios, tablas y elementos UI
  src/pages/        Vistas conectadas con los servicios
  src/services/     Cliente HTTP y servicios por recurso
  src/hooks/        Carga de recursos y debounce
  src/styles/       Variables, estilos globales y responsive
  src/utils/        Formato monetario y estado del stock
database/           Migración, esquema, datos y verificación
docs/               Modelo, endpoints, pruebas y diagrama ER
```
## Autenticación del Día 2

Ejecuta `database/migrations/005_usuarios_auth.sql` después de las migraciones existentes. Copia `backend/.env.example` a `backend/.env` y reemplaza `JWT_SECRET` por una cadena aleatoria de al menos 32 caracteres. Las rutas empresariales requieren JWT; registro y login son públicos. El token se conserva solo en memoria en React.

La colección de Postman está en `postman/MiniProyecto1_Dia2.postman_collection.json` y la investigación de seguridad en `docs/investigacion-jwt.md`.
