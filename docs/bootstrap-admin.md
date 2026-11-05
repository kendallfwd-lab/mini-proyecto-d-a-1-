# Bootstrap del administrador principal

La migración `database/migrations/006_admin_privado.sql` agrega los campos de autenticación y una restricción única que impide más de un administrador principal. La migración no inserta cuentas ni contraseñas.

Desde la carpeta `backend`, ejecutar una sola vez:

```powershell
npm run admin:bootstrap
```

El script comprueba la conexión, verifica que no exista un principal, solicita nombre y correo y lee la contraseña sin mostrarla en pantalla. La contraseña se almacena únicamente como hash bcrypt. Si ya existe un principal, la operación se rechaza.

No existe registro público ni una ruta HTTP para crear el primer administrador. Solo el principal puede crear administradores adicionales mediante `POST /api/admin/usuarios`. Las rutas empresariales requieren `Authorization: Bearer <token>`.

El JWT vive solo en memoria del navegador. Al cerrar sesión, `version_token` se incrementa en MySQL e invalida los tokens existentes de esa cuenta; al recargar la página se solicita iniciar sesión nuevamente.
