# Operación segura

## Sesiones

- Inactividad máxima: 10 minutos validada en backend mediante `sesiones.ultima_actividad`.
- Access token: 15 minutos.
- Refresh token: 7 días, rotatorio, revocable y almacenado como SHA-256.
- En producción usar `AUTH_MODE=cookie`, `COOKIE_SECURE=true` y HTTPS.
- El logout y el cambio de contraseña revocan las sesiones de la cuenta.

## MFA del administrador principal

Configurar primero `MFA_ENCRYPTION_KEY` como una clave base64 de 32 bytes y ejecutar desde `backend`:

```powershell
npm run admin:mfa:setup
```

El comando solicita las credenciales localmente, genera un secreto TOTP cifrado con AES-GCM y muestra una URI `otpauth` para registrarla en Authenticator. El principal no puede iniciar sesión sin un código MFA válido.

## MySQL

La aplicación utiliza `business_inventory_app`, con permisos limitados de lectura y escritura sobre `business_inventory`; no debe usar `root` en ejecución normal. Las migraciones deben ejecutarse con una cuenta administrativa separada.

## Backups

Configurar `BACKUP_ENCRYPTION_KEY` y ejecutar:

```powershell
npm run db:backup
```

El backup se guarda cifrado en `backups/`, excluido de Git. Para probar una restauración sin tocar producción:

```powershell
node scripts/restoreDatabase.js ..\backups\archivo.sql.enc business_inventory_restore_test
```

El destino debe ser una base de pruebas diferente de `business_inventory`.
