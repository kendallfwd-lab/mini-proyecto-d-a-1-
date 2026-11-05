# API REST

Base URL: `http://localhost:3010/api`

Excepto `GET /health`, `POST /auth/register` y `POST /auth/login`, todos los endpoints requieren `Authorization: Bearer <token>`.

## Auth

| Método | Ruta | Resultado |
|---|---|---|
| POST | `/auth/register` | Registra usuario, guarda bcrypt y devuelve token |
| POST | `/auth/login` | Valida credenciales y devuelve JWT |
| GET | `/auth/me` | Devuelve el usuario autenticado |

Registro recibe `{ nombre, correo, password }`; login recibe `{ correo, password }`. El correo se normaliza y nunca se devuelve `password_hash`.

## Entidades

Productos, categorías, proveedores, clientes y gastos tienen `GET /recurso`, `GET /recurso/:id`, `POST /recurso`, `PUT /recurso/:id` y `DELETE /recurso/:id` cuando aplica. Compras tienen `GET`, `GET/:id`, `POST` y `POST/:id/recibir`; ventas tienen `GET` y `POST`; facturas tienen `GET` y `GET/:id`.

| Recurso | Ruta base |
|---|---|
| Productos | `/productos` |
| Categorías | `/categorias` |
| Proveedores | `/proveedores` |
| Clientes | `/clientes` |
| Compras | `/compras` |
| Ventas | `/ventas` |
| Facturas | `/facturas` |
| Gastos | `/gastos` |

## Dashboard

- `GET /health` — estado técnico público.
- `GET /dashboard/resumen` — indicadores reales de inventario.
- `GET /dashboard/analiticas` — ventas, canales, movimientos y productos más vendidos.
- `GET /dashboard/rentabilidad` — ingresos, costos, gastos y utilidad.

Todas las respuestas usan `{ success: true, data }`. Los errores usan `{ success: false, error }` y códigos 400, 401, 404, 409 o 500.
