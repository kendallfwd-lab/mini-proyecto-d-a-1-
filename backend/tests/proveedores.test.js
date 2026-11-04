jest.mock('../src/services/proveedoresService', () => ({
  list: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/proveedoresService');

describe('API de proveedores', () => {
  beforeEach(() => jest.clearAllMocks());

  test('crea proveedores válidos y devuelve 201', async () => {
    service.create.mockResolvedValue({ id: 3, nombre: 'Proveedor' });
    const response = await request(app).post('/api/proveedores').send({ nombre: 'Proveedor' });

    expect(response.status).toBe(201);
    expect(response.body.data.nombre).toBe('Proveedor');
    expect(service.create).toHaveBeenCalledWith({ nombre: 'Proveedor' });
  });

  test('rechaza correos con formato inválido', async () => {
    const response = await request(app).post('/api/proveedores').send({
      nombre: 'Proveedor',
      correo: 'no-es-correo',
    });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });
});
