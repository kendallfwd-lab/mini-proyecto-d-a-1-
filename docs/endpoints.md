# Endpoints

Base URL: `http://localhost:3010/api`

| Recurso | GET lista | GET uno | POST | PUT | DELETE |
|---|---|---|---|---|---|
| Productos | `/productos` | `/productos/:id` | `/productos` | `/productos/:id` | `/productos/:id` |
| Categorías | `/categorias` | `/categorias/:id` | `/categorias` | `/categorias/:id` | `/categorias/:id` |
| Proveedores | `/proveedores` | `/proveedores/:id` | `/proveedores` | `/proveedores/:id` | `/proveedores/:id` |
| Clientes | `/clientes` | `/clientes/:id` | `/clientes` | `/clientes/:id` | `/clientes/:id` |
| Compras | `/compras` | `/compras/:id` | `/compras` | — | — |
| Ventas | `/ventas` | — | `/ventas` | — | — |
| Facturas | `/facturas` | `/facturas/:id` | automática al registrar una venta | — | — |
| Gastos | `/gastos` | — | `/gastos` | `/gastos/:id` | `/gastos/:id` |

Extras: `GET /health`, `GET /dashboard/resumen`, `GET /dashboard/analiticas` y `GET /dashboard/rentabilidad`.

Filtros de productos: `search`, `categoria_id`, `proveedor_id`, `disponibilidad` (`disponible`, `bajo`, `agotado`), `sort` (`precio` o nombre) y `direction` (`asc` o `desc`).

La rentabilidad devuelve métricas separadas en `real` y `demostracion`; solo las ventas pagadas se consideran ingresos. Las ventas y gastos demo nunca se mezclan con cifras reales. Los productos aceptan `costo_unitario` opcional y las líneas de venta guardan una copia del costo para estimar la ganancia.

Un gasto requiere `categoria` (`alquiler`, `servicios`, `transporte`, `publicidad`, `comisiones`, `suministros` u `otros`), `descripcion`, `monto` positivo y `fecha_gasto` en formato `YYYY-MM-DD`. Los registros demo son de solo lectura.

Para registrar una venta pagada, `POST /ventas` recibe `cliente`, `cliente_id`, `telefono`, `canal` (`tienda`, `whatsapp`, `instagram` o `web`), `fecha_venta` (`YYYY-MM-DD`) y `productos` como arreglo de `{ "producto_id": 1, "cantidad": 2 }`. El servidor calcula el total con los precios vigentes, rechaza ventas sin stock y actualiza la existencia dentro de una transacción. También guarda el costo vigente como snapshot; si el producto no tiene costo, la rentabilidad real se marca incompleta hasta que se complete. La venta pagada crea una factura con número único y snapshot del teléfono.

Los clientes se registran con `nombre` y, opcionalmente, `correo`, `telefono` y `direccion`. `GET /clientes/:id` incluye `ventas`, el historial de operaciones reales asociadas. Al crear una venta desde la interfaz se selecciona un cliente registrado, asociándolo para su historial.

Un pedido se crea con `proveedor_id`, `fecha_pedido`, `productos` (cada línea incluye `producto_id`, `cantidad` y `costo_unitario`) y `notas` opcionales. Los productos deben pertenecer al proveedor elegido. `POST /compras/:id/recibir` recibe `{ "productos": [{ "detalle_id": 1, "cantidad": 3 }] }`; permite entradas parciales, no permite exceder lo pendiente y actualiza existencias, costo del producto y movimientos de inventario dentro de una transacción. El pedido queda recibido cuando todas sus unidades han entrado.

El seeder `database/seeders/006_compras_clientes_demo.sql` agrega cuatro clientes de muestra vinculados a las ventas demo existentes y cuatro pedidos de reposición de muestra, usando productos y proveedores del catálogo. `007_facturas_demo.sql` crea facturas de muestra para las ventas pagadas. Se identifican con `es_demo` y la etiqueta DEMO; no se pueden usar para ventas reales ni recibir, no cambian el stock y no cuentan como ventas reales. Los clientes reales se pueden crear y asociar a ventas desde la interfaz.

Al consultar `/facturas`, una factura incluye número (formato `FAC-AAAA-######`), fecha de emisión, cliente, teléfono, canal, productos y total. El botón de WhatsApp abre `wa.me` con un mensaje prellenado; la persona encargada debe revisar y confirmar el envío dentro de WhatsApp. La impresión permite guardar una copia comercial en PDF, pero no sustituye la factura electrónica tributaria. La aplicación no finge envíos automáticos ni requiere credenciales de WhatsApp Business.
