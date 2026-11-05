# Auditoría y mejoras V6

## Hallazgos corregidos

- **Alto:** el sistema solo tenía sesiones Bearer en memoria del frontend. Se agregó un modo `cookie` con cookies HttpOnly, SameSite Strict, cookies `__Host-` cuando `COOKIE_SECURE=true`, refresh tokens rotatorios y revocables.
- **Alto:** no existían sesiones persistentes ni revocación por familia. Se agregaron `sesiones` y `refresh_tokens`; los refresh tokens se almacenan únicamente como SHA-256.
- **Alto:** no había protección CSRF para el modo cookie. Se agregó `X-CSRF-Token`, validación de Origin y Fetch Metadata para mutaciones.
- **Medio:** no existía trazabilidad administrativa. Se agregó `auditoria_eventos`, registro de login, logout, creación/desactivación de administradores, revocación y reutilización de refresh tokens.
- **Medio:** el bypass de pruebas podía activarse fuera de pruebas. Ahora solo funciona cuando `NODE_ENV=test`.
- **Medio:** el JSON de Express no tenía límite explícito. Se estableció un límite de 100 KB.

## Modos de autenticación

`AUTH_MODE=bearer` conserva el modo académico local con `Authorization: Bearer`. `AUTH_MODE=cookie` activa access y refresh tokens en cookies HttpOnly. En producción se debe utilizar `COOKIE_SECURE=true`, HTTPS y un `CORS_ORIGIN` explícito.

El frontend siempre utiliza `credentials: include`; en modo cookie restaura la sesión con `/auth/me`, renueva una sola vez ante un `401` y evita almacenar JWT en almacenamiento persistente.

## Migración

Ejecutar desde `backend`:

```powershell
npm run db:migrate:security
```

La migración `007_security_sessions_audit.sql` es aditiva y se registra en `schema_migrations`. No elimina tablas ni datos.
