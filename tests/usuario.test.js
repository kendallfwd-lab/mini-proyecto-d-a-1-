jest.mock('../models', () => ({
  Usuario: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

process.env.JWT_SECRET = 'test-secret';
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { Usuario } = require('../models');

const token = jwt.sign({ id: 1, correo: 'ana@example.com', rol: 'admin' }, process.env.JWT_SECRET);

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
    Usuario.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ id: 1, nombre: 'Ana' }] });
    const response = await request(app).get('/usuario');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      datos: [{ id: 1, nombre: 'Ana' }],
      paginacion: { page: 1, limit: 10, total: 1, totalPaginas: 1 },
    });
  });

  test('devuelve 404 cuando el usuario no existe', async () => {
    Usuario.findByPk.mockResolvedValue(null);
    const response = await request(app).get('/usuario/999');
    expect(response.status).toBe(404);
  });

  test('inicia sesión y devuelve un JWT', async () => {
    Usuario.findOne.mockResolvedValue({
      id: 1,
      nombre: 'Ana',
      apellido1: 'Solis',
      apellido2: 'Rojas',
      correo: 'ana@example.com',
      compararContrasena: jest.fn().mockResolvedValue(true),
    });

    const response = await request(app).post('/auth/login').send({
      correo: 'ana@example.com',
      contrasena: 'secreto123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.usuario.correo).toBe('ana@example.com');
  });

  test('rechaza credenciales incorrectas', async () => {
    Usuario.findOne.mockResolvedValue(null);
    const response = await request(app).post('/auth/login').send({
      correo: 'ana@example.com',
      contrasena: 'incorrecta',
    });
    expect(response.status).toBe(401);
  });

  test('actualiza un usuario autenticado', async () => {
    Usuario.update.mockResolvedValue([1]);
    Usuario.findByPk.mockResolvedValue({ id: 1, nombre: 'Ana actualizada' });
    const response = await request(app).patch('/usuario/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Ana actualizada' });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Ana actualizada');
  });

  test('elimina un usuario cuando el token es admin', async () => {
    Usuario.destroy.mockResolvedValue(1);
    const response = await request(app).delete('/usuario/2').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  test('devuelve 409 para un correo duplicado', async () => {
    Usuario.create.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });
    const response = await request(app).post('/usuario').send({
      nombre: 'Ana', apellido1: 'Solis', apellido2: 'Rojas', altura: 1.7,
      etnia: 'Mestiza', correo: 'ana@example.com', contrasena: 'secreto123',
    });
    expect(response.status).toBe(409);
  });

  test('oculta errores internos de base de datos', async () => {
    Usuario.findAndCountAll.mockRejectedValue(new Error('connection refused'));
    const response = await request(app).get('/usuario');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error interno del servidor');
  });
});
