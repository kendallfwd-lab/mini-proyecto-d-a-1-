# Modelo de datos

```mermaid
erDiagram
  CATEGORIAS ||--o{ PRODUCTOS : clasifica
  PROVEEDORES ||--o{ PRODUCTOS : suministra
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
    int stock
    int categoria_id FK
    int proveedor_id FK
    datetime fecha_creacion
    datetime fecha_actualizacion
  }
```

La fuente ejecutable del modelo está en `database/schema.sql` y la migración inicial en `database/migrations/001_initial_schema.sql`. El diagrama editable está en `docs/diagrama-er.drawio`.
