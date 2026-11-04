jest.mock('../src/services/productosService', () => ({
  list: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/productosService');

describe('API de productos', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lista productos a través del servicio', async () => {
    service.list.mockResolvedValue([{ id: 1, nombre: 'Cable' }]);
    const response = await request(app).get('/api/productos');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([{ id: 1, nombre: 'Cable' }]);
  });

  test('valida antes de crear un producto', async () => {
    const response = await request(app).post('/api/productos').send({});

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });

  test('rechaza identificadores inválidos antes de consultar', async () => {
    const response = await request(app).get('/api/productos/abc');

    expect(response.status).toBe(400);
    expect(service.get).not.toHaveBeenCalled();
  });
});
