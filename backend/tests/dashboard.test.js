jest.mock('../src/services/dashboardService', () => ({
  summary: jest.fn(),
  analytics: jest.fn(),
  profitability: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/dashboardService');

describe('API del dashboard', () => {
  beforeEach(() => jest.clearAllMocks());

  test('responde con el resumen de inventario', async () => {
    service.summary.mockResolvedValue({ totales: { productos: 12 }, alertas: [] });
    const response = await request(app).get('/api/dashboard/resumen');

    expect(response.status).toBe(200);
    expect(response.body.data.totales.productos).toBe(12);
  });

  test('responde con las analíticas de ventas', async () => {
    service.analytics.mockResolvedValue({ resumen: { ventas_pagadas: 1200 } });
    const response = await request(app).get('/api/dashboard/analiticas');

    expect(response.status).toBe(200);
    expect(response.body.data.resumen.ventas_pagadas).toBe(1200);
  });

  test('separa la rentabilidad real de los datos demo', async () => {
    service.profitability.mockResolvedValue({
      real: { ingresos: 100, ganancia_neta: 40 },
      demostracion: { ingresos: 200, ganancia_neta: 80 },
    });
    const response = await request(app).get('/api/dashboard/rentabilidad');

    expect(response.status).toBe(200);
    expect(response.body.data.real.ingresos).toBe(100);
    expect(response.body.data.demostracion.ingresos).toBe(200);
  });
});
