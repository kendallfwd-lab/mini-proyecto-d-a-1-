# Modelo de datos

```mermaid
erDiagram
  CATEGORIAS ||--o{ PRODUCTOS : clasifica
  PROVEEDORES ||--o{ PRODUCTOS : suministra
  PROVEEDORES ||--o{ COMPRAS : recibe
  COMPRAS ||--o{ COMPRA_DETALLE : incluye
  PRODUCTOS ||--o{ COMPRA_DETALLE : repone
  CLIENTES ||--o{ VENTAS : realiza
  VENTAS ||--o| FACTURAS : documenta
  CATEGORIAS {
    int id PK
    varchar nombre UK
    text descripcion
    datetime fecha_creacion
  }
  PROVEEDORES {
    int id PK
    varchar nombre
    varchar correo
    varchar telefono
    varchar direccion
    datetime fecha_creacion
  }
  PRODUCTOS {
    int id PK
    varchar codigo UK
    varchar nombre
    text descripcion
    decimal precio
    decimal costo_unitario
    int stock
    int categoria_id FK
    int proveedor_id FK
    datetime fecha_creacion
    datetime fecha_actualizacion
  }
  VENTAS ||--o{ VENTA_DETALLE : incluye
  PRODUCTOS ||--o{ VENTA_DETALLE : vendido
  VENTAS {
    int id PK
    int cliente_id FK
    varchar cliente
    datetime fecha_venta
    decimal total
    boolean es_demo
  }
  FACTURAS {
    int id PK
    int venta_id FK
    varchar numero_factura UK
    varchar telefono_cliente
    datetime fecha_emision
    boolean es_demo
  }
  VENTA_DETALLE {
    int id PK
    int venta_id FK
    int producto_id FK
    int cantidad
    decimal precio_unitario
    decimal costo_unitario
  }
  GASTOS {
    int id PK
    varchar categoria
    varchar descripcion
    decimal monto
    date fecha_gasto
    boolean es_demo
  }
  CLIENTES {
    int id PK
    varchar nombre
    varchar correo
    varchar telefono
    text direccion
    boolean es_demo
  }
  COMPRAS {
    int id PK
    int proveedor_id FK
    date fecha_pedido
    varchar estado
    decimal total
    boolean es_demo
    datetime fecha_recepcion
  }
  COMPRA_DETALLE {
    int id PK
    int compra_id FK
    int producto_id FK
    int cantidad
    int cantidad_recibida
    decimal costo_unitario
  }
```

La fuente ejecutable del modelo está en `database/schema.sql`; aplica las migraciones en orden `database/migrations/001_initial_schema.sql`, `002_gastos_rentabilidad.sql`, `003_compras_clientes.sql` y `004_facturas.sql`. La migración de clientes conserva ventas existentes; cada venta pagada nueva crea una factura y guarda el teléfono informado como snapshot. Los seeders `006` y `007` cargan clientes, ventas y pedidos de muestra sin alterar existencias. El diagrama editable está en `docs/diagrama-er.drawio`.
