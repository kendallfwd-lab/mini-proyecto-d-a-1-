# Backend de Construcción

API REST construida con Node.js, Express, MySQL y Sequelize.

## Instalación

Requisitos: Node.js 18+, MySQL 8+ y Git.

```bash
npm install
copy .env.example .env
```

Edita `.env` con las credenciales locales de MySQL. No subas `.env` al repositorio.

## Base de datos y migraciones

En MySQL Workbench ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS construccion_be
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE construccion_be;
```

Después ejecuta:

```bash
npx sequelize-cli db:migrate:status
npx sequelize-cli db:migrate
```

Para cargar usuarios de ejemplo sin duplicarlos:

```bash
npm run db:seed
```

Los usuarios de ejemplo usan la contraseña `secreto123`. Para deshacer únicamente ese seeder:

```bash
npm run db:seed:undo
```

Para deshacer la última migración:

```bash
npx sequelize-cli db:migrate:undo
```

## Ejecutar y probar

```bash
npm start
npm test
```

La API queda disponible en `http://localhost:3010`.

El panel frontend está disponible en `http://localhost:3010/app/`.

Endpoints principales:

- `GET /usuario`
- `GET /usuario/:id`
- `POST /usuario`
- `PATCH /usuario/:id`
- `DELETE /usuario/:id`
- `POST /auth/login`

Las consultas `GET /usuario` y `GET /usuario/:id` son públicas y no requieren token. Las operaciones `PATCH` y `DELETE` requieren `Authorization: Bearer <token>`. El registro `POST /usuario` y el login son públicos.

La lista de usuarios admite filtros y paginación:

```text
GET /usuario?etnia=Mestiza&nombre=Ana&page=1&limit=10
```

La respuesta contiene `datos` y `paginacion`. Los roles disponibles son `admin` y `usuario`; únicamente `admin` puede eliminar usuarios. La documentación interactiva está disponible en:

```text
http://localhost:3010/api-docs
```

También existe la tabla `proyectos`:

```text
GET  /proyecto
POST /proyecto
```

La consulta `GET /proyecto` es pública. Para crear proyectos con `POST /proyecto` se requiere JWT; el proyecto queda asociado a la cuenta autenticada.

Para iniciar sesión:

```json
{
  "correo": "ana@example.com",
  "contrasena": "secreto123"
}
```

Ejemplo de cuerpo para `POST /usuario` en Postman:

```json
{
  "nombre": "Ana",
  "apellido1": "Solís",
  "apellido2": "Rojas",
  "altura": 1.7,
  "etnia": "Mestiza",
  "correo": "ana@example.com",
  "contrasena": "secreto123"
}
```

Las contraseñas se almacenan con hash bcrypt y nunca se devuelven en las respuestas. Las validaciones responden con `400`, el correo duplicado con `409` y los usuarios inexistentes con `404`.
