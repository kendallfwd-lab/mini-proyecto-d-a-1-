jest.mock('../src/services/categoriasService', () => ({
  list: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/categoriasService');

describe('API de categorías', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lista categorías usando el filtro de búsqueda', async () => {
    service.list.mockResolvedValue([{ id: 2, nombre: 'Audio' }]);
    const response = await request(app).get('/api/categorias?search=audio');

    expect(response.status).toBe(200);
    expect(service.list).toHaveBeenCalledWith('audio');
    expect(response.body.data[0].nombre).toBe('Audio');
  });

  test('no permite crear una categoría sin nombre', async () => {
    const response = await request(app).post('/api/categorias').send({ descripcion: 'Sin nombre' });

    expect(response.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });
});
