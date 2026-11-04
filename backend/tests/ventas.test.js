jest.mock('../src/services/ventasService', () => ({
  list: jest.fn(),
  create: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/ventasService');

describe('API de ventas', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lista las ventas reales y los ejemplos demo identificados', async () => {
    service.list.mockResolvedValue([
      { id: 8, cliente: 'Cliente', es_demo: false },
      { id: 9, cliente: 'Ejemplo DEMO', es_demo: true },
    ]);
    const response = await request(app).get('/api/ventas');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[1].es_demo).toBe(true);
    expect(service.list).toHaveBeenCalled();
  });

  test('registra una venta con los datos validados', async () => {
    const sale = {
      cliente: 'Cliente de prueba',
      telefono: '+506 8888-8888',
      canal: 'tienda',
      fecha_venta: '2026-11-05',
      productos: [{ producto_id: 2, cantidad: 1 }],
    };
    service.create.mockResolvedValue({ id: 9, ...sale, estado: 'pagada', total: 2500 });
    const response = await request(app).post('/api/ventas').send(sale);

    expect(response.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(sale);
    expect(response.body.data.estado).toBe('pagada');
  });

  test('exige un teléfono válido para emitir la factura', async () => {
    const response = await request(app).post('/api/ventas').send({
      cliente: 'Cliente',
      canal: 'tienda',
      fecha_venta: '2026-11-05',
      productos: [{ producto_id: 2, cantidad: 1 }],
    });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });

  test('rechaza productos incompletos sin llamar al servicio', async () => {
    const response = await request(app).post('/api/ventas').send({
      cliente: 'Cliente',
      canal: 'tienda',
      fecha_venta: '2026-11-05',
      productos: [null],
    });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });

  test('rechaza fechas inexistentes y cantidades no positivas', async () => {
    const response = await request(app).post('/api/ventas').send({
      cliente: 'Cliente',
      canal: 'tienda',
      fecha_venta: '2026-02-31',
      productos: [{ producto_id: 2, cantidad: 0 }],
    });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });
});
