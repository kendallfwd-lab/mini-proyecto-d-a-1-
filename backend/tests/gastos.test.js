jest.mock('../src/services/gastosService', () => ({
  list: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/gastosService');

describe('API de gastos', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lista gastos incluyendo la marca de demostración', async () => {
    service.list.mockResolvedValue([{ id: 1, descripcion: 'Ejemplo', es_demo: 1 }]);
    const response = await request(app).get('/api/gastos');

    expect(response.status).toBe(200);
    expect(response.body.data[0].es_demo).toBe(1);
  });

  test('crea gastos reales validados', async () => {
    const gasto = { categoria: 'alquiler', descripcion: 'Alquiler local', monto: 120000, fecha_gasto: '2026-11-01' };
    service.create.mockResolvedValue({ id: 2, ...gasto, es_demo: 0 });
    const response = await request(app).post('/api/gastos').send(gasto);

    expect(response.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(gasto);
    expect(response.body.data.es_demo).toBe(0);
  });

  test('rechaza gastos con monto no positivo', async () => {
    const response = await request(app).post('/api/gastos').send({
      categoria: 'alquiler',
      descripcion: 'Prueba',
      monto: 0,
      fecha_gasto: '2026-11-01',
    });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });

  test('rechaza fechas que no existen en el calendario', async () => {
    const response = await request(app).post('/api/gastos').send({
      categoria: 'servicios',
      descripcion: 'Fecha inválida',
      monto: 100,
      fecha_gasto: '2026-02-31',
    });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });
});
