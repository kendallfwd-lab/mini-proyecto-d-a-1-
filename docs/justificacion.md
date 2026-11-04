# Justificación técnica

## Arquitectura

El proyecto se separa en `backend`, `frontend` y `database` para aislar responsabilidades y facilitar el despliegue. El backend usa Express y `mysql2/promise` con consultas parametrizadas; el frontend usa React, Vite y React Router; MySQL 8.0 conserva las relaciones y restricciones del inventario.

## Decisiones

- No hay autenticación, roles ni sesiones porque el alcance es un sistema académico de inventario.
- Los borrados usan `ON DELETE RESTRICT` para no perder productos relacionados accidentalmente.
- Los productos guardan precio y stock como valores no negativos, con índices para código, categoría, proveedor y búsquedas comunes.
- La API devuelve una forma consistente `{ success, data }` y errores `{ success: false, message }`.
- La interfaz utiliza componentes reutilizables, responsive y formatos locales de Costa Rica (CRC).

## Seguridad y mantenimiento

Las credenciales se configuran mediante `.env`, nunca dentro del código. Se validan entradas en el servidor, se usan consultas preparadas y se centralizan los errores HTTP. Para producción se debe agregar HTTPS, secretos del proveedor de despliegue y un sistema de autenticación acorde al alcance real.
