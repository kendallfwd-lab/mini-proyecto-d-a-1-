# Investigación técnica: JWT en Business Inventory

Consulta: 5 de noviembre de 2026.

## Conceptos

Un JSON Web Token (JWT) es una representación compacta de claims que puede transmitirse entre partes y verificarse mediante una firma. Su forma habitual es `header.payload.signature`. El header declara el tipo y algoritmo; el payload contiene claims como `sub`, `iat`, `exp`, `iss` y `aud`; la firma permite detectar modificaciones. Un JWT firmado no está cifrado, por lo que no debe contener contraseñas ni información sensible.

Autenticación comprueba quién es la persona; autorización decide qué puede hacer. En este MVP solo se exige que la persona esté autenticada; no se agregan roles.

## Decisión del proyecto

El backend genera un access token HS256 con duración de una hora y valida algoritmo, issuer y audience. El frontend conserva el token únicamente en memoria mediante `AuthContext`; no usa `localStorage` ni `sessionStorage`. Al recargar la página se solicita nuevamente el login. El logout limpia el estado local; como no existe una lista de revocación, no invalida instantáneamente un token que alguien haya copiado.

## Contraseñas y seguridad

Las contraseñas se procesan con bcrypt y nunca se guarda ni retorna el valor original. `Authorization: Bearer <token>` protege las rutas empresariales. Las respuestas 401 eliminan la sesión del frontend. Se agregan Helmet, CORS restringido, límite básico de intentos en auth, consultas parametrizadas y errores sin detalles internos.

En producción se requiere HTTPS, un secreto aleatorio fuera de Git, rotación de secretos, monitoreo y una política de revocación adecuada. El almacenamiento en memoria reduce persistencia del token, pero no elimina el riesgo de XSS dentro de la aplicación.

## Fuentes oficiales

- [RFC 7519 — JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [OWASP — JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [jsonwebtoken — documentación](https://github.com/auth0/node-jsonwebtoken)
- [Express — middleware](https://expressjs.com/en/guide/using-middleware.html)
- [MDN — sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
