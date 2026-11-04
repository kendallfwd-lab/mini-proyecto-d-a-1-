jest.mock('../src/services/facturasService', () => ({
  list: jest.fn(),
  get: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/facturasService');

describe('API de facturas', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lista facturas reales y demo', async () => {
    service.list.mockResolvedValue([
      { id: 1, numero_factura: 'FAC-2026-000001', es_demo: true },
      { id: 2, numero_factura: 'FAC-2026-000002', es_demo: false },
    ]);
    const response = await request(app).get('/api/facturas');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].numero_factura).toBe('FAC-2026-000001');
  });

  test('devuelve los datos de factura para vista e impresión', async () => {
    service.get.mockResolvedValue({
      id: 2,
      numero_factura: 'FAC-2026-000002',
      telefono_cliente: '+506 8888-8888',
      productos: [{ nombre: 'Audífonos', subtotal: 25000 }],
    });
    const response = await request(app).get('/api/facturas/2');

    expect(response.status).toBe(200);
    expect(response.body.data.productos).toHaveLength(1);
  });

  test('valida el identificador de factura', async () => {
    const response = await request(app).get('/api/facturas/0');

    expect(response.status).toBe(400);
    expect(service.get).not.toHaveBeenCalled();
  });

  test('responde 404 al solicitar una factura inexistente', async () => {
    service.get.mockResolvedValue(undefined);
    const response = await request(app).get('/api/facturas/999');

    expect(response.status).toBe(404);
  });
});
