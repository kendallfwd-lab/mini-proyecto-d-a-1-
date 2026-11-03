jest.mock('../models', () => ({
  Usuario: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

const request = require('supertest');
const app = require('../app');
const { Usuario } = require('../models');

describe('API de usuarios', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rechaza un usuario incompleto', async () => {
    const response = await request(app).post('/usuario').send({ nombre: 'Ana' });
    expect(response.status).toBe(400);
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  test('crea un usuario y no devuelve la contraseña', async () => {
    Usuario.create.mockResolvedValue({
      toJSON: () => ({ id: 1, nombre: 'Ana', contrasena: 'hash' }),
    });
    const response = await request(app).post('/usuario').send({
      nombre: 'Ana', apellido1: 'Solís', apellido2: 'Rojas', altura: 1.7,
      etnia: 'Mestiza', correo: 'ana@example.com', contrasena: 'secreto123',
    });
    expect(response.status).toBe(201);
    expect(response.body.contrasena).toBeUndefined();
  });

  test('lista usuarios sin contraseñas', async () => {
    Usuario.findAll.mockResolvedValue([{ id: 1, nombre: 'Ana' }]);
    const response = await request(app).get('/usuario');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, nombre: 'Ana' }]);
  });

  test('devuelve 404 cuando el usuario no existe', async () => {
    Usuario.findByPk.mockResolvedValue(null);
    const response = await request(app).get('/usuario/999');
    expect(response.status).toBe(404);
  });
});
