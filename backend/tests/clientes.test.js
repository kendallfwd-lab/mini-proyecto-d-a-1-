jest.mock('../src/services/clientesService', () => ({
  list: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/clientesService');

describe('API de clientes', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lista clientes con resumen de compras', async () => {
    service.list.mockResolvedValue([{ id: 1, nombre: 'Cliente', compras_count: 2, total_compras: 5000 }]);
    const response = await request(app).get('/api/clientes');

    expect(response.status).toBe(200);
    expect(response.body.data[0].compras_count).toBe(2);
  });

  test('devuelve los datos de contacto y el historial de ventas', async () => {
    service.get.mockResolvedValue({ id: 1, nombre: 'Cliente', ventas: [{ id: 5, total: 2500 }] });
    const response = await request(app).get('/api/clientes/1');

    expect(response.status).toBe(200);
    expect(response.body.data.ventas).toHaveLength(1);
  });

  test('crea clientes validados', async () => {
    const client = { nombre: 'Ana', correo: 'ana@example.com', telefono: '8888-8888' };
    service.create.mockResolvedValue({ id: 2, ...client });
    const response = await request(app).post('/api/clientes').send(client);

    expect(response.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(client);
  });

  test('rechaza un correo inválido', async () => {
    const response = await request(app).post('/api/clientes').send({
      nombre: 'Ana',
      correo: 'no-es-correo',
    });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });
});
