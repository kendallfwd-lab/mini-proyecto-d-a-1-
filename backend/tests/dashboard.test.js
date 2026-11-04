jest.mock('../src/services/dashboardService', () => ({
  summary: jest.fn(),
  analytics: jest.fn(),
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
});
