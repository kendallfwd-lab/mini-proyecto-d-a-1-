# Endpoints

Base URL: `http://localhost:3010/api`

| Recurso | GET lista | GET uno | POST | PUT | DELETE |
|---|---|---|---|---|---|
| Productos | `/productos` | `/productos/:id` | `/productos` | `/productos/:id` | `/productos/:id` |
| Categorías | `/categorias` | `/categorias/:id` | `/categorias` | `/categorias/:id` | `/categorias/:id` |
| Proveedores | `/proveedores` | `/proveedores/:id` | `/proveedores` | `/proveedores/:id` | `/proveedores/:id` |

Extras: `GET /health` y `GET /dashboard/resumen`.

Filtros de productos: `search`, `categoria_id`, `proveedor_id`, `disponibilidad` (`disponible`, `bajo`, `agotado`), `sort` y `order`.
