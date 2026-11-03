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

Para deshacer la última migración:

```bash
npx sequelize-cli db:migrate:undo
```

## Ejecutar y probar

```bash
npm start
npm test
```

La API queda disponible en `http://localhost:3000`.

Endpoints principales:

- `GET /usuario`
- `GET /usuario/:id`
- `POST /usuario`
- `PATCH /usuario/:id`
- `DELETE /usuario/:id`

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
