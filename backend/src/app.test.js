const request = require('supertest');
const app = require('./app');

describe('API base', () => {
  test('expone health check sin autenticación', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('devuelve 404 para rutas inexistentes', async () => {
    const response = await request(app).get('/ruta-inexistente');
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
