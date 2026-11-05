process.env.AUTH_TEST_BYPASS = 'false';
require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');

describe('Autenticación JWT', () => {
  test('no expone un registro público', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Usuario no autorizado', correo: 'publico@example.com', password: 'Segura123!' });

    expect(response.status).toBe(401);
  });

  test('rechaza credenciales inválidas sin filtrar información', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'no-existe@example.com', password: 'incorrecta' });

    expect([401, 500]).toContain(response.status);
    expect(response.body).not.toHaveProperty('data.token');
  });

  test('protege rutas empresariales sin token', async () => {
    expect((await request(app).get('/api/productos')).status).toBe(401);
    expect((await request(app).get('/api/productos').set('Authorization', 'Bearer invalid')).status).toBe(401);
  });

  test('protege la administración de usuarios', async () => {
    expect((await request(app).get('/api/admin/usuarios')).status).toBe(401);
  });
});
