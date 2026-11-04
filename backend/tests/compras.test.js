jest.mock('../src/services/comprasService', () => ({
  list: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  receive: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/comprasService');

describe('API de compras', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lista pedidos de compra', async () => {
    service.list.mockResolvedValue([{ id: 3, estado: 'pendiente' }]);
    const response = await request(app).get('/api/compras');

    expect(response.status).toBe(200);
    expect(response.body.data[0].estado).toBe('pendiente');
  });

  test('crea pedidos con cantidades y costos válidos', async () => {
    const purchase = {
      proveedor_id: 1,
      fecha_pedido: '2026-11-04',
      productos: [{ producto_id: 4, cantidad: 10, costo_unitario: 1250 }],
    };
    service.create.mockResolvedValue({ id: 7, ...purchase, estado: 'pendiente' });
    const response = await request(app).post('/api/compras').send(purchase);

    expect(response.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(purchase);
  });

  test('rechaza fechas inexistentes y costos negativos', async () => {
    const response = await request(app).post('/api/compras').send({
      proveedor_id: 1,
      fecha_pedido: '2026-02-31',
      productos: [{ producto_id: 4, cantidad: 2, costo_unitario: -1 }],
    });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });

  test('registra una recepción parcial validada', async () => {
    service.receive.mockResolvedValue({ id: 7, estado: 'pendiente' });
    const response = await request(app).post('/api/compras/7/recibir').send({
      productos: [{ detalle_id: 12, cantidad: 3 }],
    });

    expect(response.status).toBe(200);
    expect(service.receive).toHaveBeenCalledWith('7', { productos: [{ detalle_id: 12, cantidad: 3 }] });
  });

  test('rechaza cantidades recibidas no positivas', async () => {
    const response = await request(app).post('/api/compras/7/recibir').send({
      productos: [{ detalle_id: 12, cantidad: 0 }],
    });

    expect(response.status).toBe(400);
    expect(service.receive).not.toHaveBeenCalled();
  });
});
