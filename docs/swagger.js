const swaggerJSDoc = require('swagger-jsdoc');

module.exports = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'ConstruccionBE API', version: '1.0.0', description: 'API de usuarios y proyectos.' },
    servers: [{ url: 'http://localhost:3010' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
    paths: {
      '/auth/login': { post: { summary: 'Iniciar sesión', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } }, responses: { 200: { description: 'Token JWT' }, 401: { description: 'Credenciales inválidas' } } } },
      '/usuario': { get: { summary: 'Listar usuarios', security: [{ bearerAuth: [] }], parameters: [{ name: 'etnia', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'Usuarios paginados' } } }, post: { summary: 'Registrar usuario', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioInput' } } } }, responses: { 201: { description: 'Usuario creado' }, 409: { description: 'Correo duplicado' } } } },
      '/usuario/{id}/contrasena': { patch: { summary: 'Actualizar contraseña', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Contraseña actualizada' } } } },
      '/proyecto': { get: { summary: 'Listar proyectos', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Proyectos' } } }, post: { summary: 'Crear proyecto', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Proyecto creado' } } } },
    },
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Login: { type: 'object', required: ['correo', 'contrasena'], properties: { correo: { type: 'string', format: 'email' }, contrasena: { type: 'string', format: 'password' } } },
        UsuarioInput: { type: 'object', required: ['nombre', 'apellido1', 'apellido2', 'altura', 'etnia', 'correo', 'contrasena'], properties: { nombre: { type: 'string' }, apellido1: { type: 'string' }, apellido2: { type: 'string' }, altura: { type: 'number' }, etnia: { type: 'string' }, correo: { type: 'string', format: 'email' }, contrasena: { type: 'string', format: 'password' } } },
      },
    },
  },
  apis: [],
});
