const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../middleware/auth');

const camposObligatorios = ['nombre', 'apellido1', 'apellido2', 'altura', 'etnia', 'correo', 'contrasena'];

function validarUsuario(data, parcial = false) {
  const errores = [];
  if (!parcial) {
    for (const campo of camposObligatorios) {
      if (data[campo] === undefined || data[campo] === null || data[campo] === '') {
        errores.push(`${campo} es obligatorio`);
      }
    }
  }
  if (data.altura !== undefined && (Number.isNaN(Number(data.altura)) || Number(data.altura) < 0.3 || Number(data.altura) > 3)) {
    errores.push('altura debe ser un número entre 0.3 y 3');
  }
  for (const campo of ['nombre', 'apellido1', 'apellido2', 'etnia']) {
    if (data[campo] !== undefined && (typeof data[campo] !== 'string' || data[campo].trim().length < 2)) {
      errores.push(`${campo} debe tener al menos 2 caracteres`);
    }
  }
  if (data.correo !== undefined && (typeof data.correo !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim()))) {
    errores.push('correo no tiene un formato válido');
  }
  if (data.contrasena !== undefined && (!/(?=.*[A-Za-z])(?=.*\d)/.test(String(data.contrasena)) || String(data.contrasena).length < 8)) {
    errores.push('contrasena debe tener al menos 8 caracteres, una letra y un número');
  }
  return errores;
}

function responderError(res, error) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'El correo ya está registrado' });
  }
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map((item) => item.message) });
  }
  return res.status(500).json({ error: 'Error interno del servidor' });
}

exports.agregarUsuario = async (req, res) => {
  try {
    const errores = validarUsuario(req.body);
    if (errores.length) return res.status(400).json({ error: errores });
    const datos = { ...req.body, correo: req.body.correo.trim().toLowerCase(), rol: 'usuario' };
    const nuevoUsuario = await Usuario.create(datos);
    const respuesta = nuevoUsuario.toJSON();
    delete respuesta.contrasena;
    res.status(201).json(respuesta);
  } catch (error) {
    responderError(res, error);
  }
};

exports.iniciarSesion = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'correo y contrasena son obligatorios' });
    }

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario || !(await usuario.compararContrasena(contrasena))) {
      return res.status(401).json({ error: 'Correo o contrasena incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      getJwtSecret(),
      { expiresIn: '2h' },
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido1: usuario.apellido1,
        apellido2: usuario.apellido2,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    return responderError(res, error);
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await Usuario.destroy({ where: { id: req.params.id } });
    if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    responderError(res, error);
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin' && Number(req.usuario.id) !== Number(req.params.id)) {
      return res.status(403).json({ error: 'Solo puedes modificar tu propio usuario' });
    }
    const errores = validarUsuario(req.body, true);
    if (errores.length) return res.status(400).json({ error: errores });
    const datos = { ...req.body };
    delete datos.rol;
    if (datos.correo) datos.correo = datos.correo.trim().toLowerCase();
    const [actualizado] = await Usuario.update(datos, { where: { id: req.params.id } });
    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['contrasena'] },
    });
    res.json(usuario);
  } catch (error) {
    responderError(res, error);
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
    const where = {};
    if (req.query.etnia) where.etnia = req.query.etnia;
    if (req.query.correo) where.correo = { [Op.like]: `%${req.query.correo}%` };
    if (req.query.nombre) where.nombre = { [Op.like]: `%${req.query.nombre}%` };
    const resultado = await Usuario.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'ASC']],
      attributes: { exclude: ['contrasena'] },
    });
    res.json({ datos: resultado.rows, paginacion: { page, limit, total: resultado.count, totalPaginas: Math.ceil(resultado.count / limit) } });
  } catch (error) {
    responderError(res, error);
  }
};

exports.actualizarContrasena = async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin' && Number(req.usuario.id) !== Number(req.params.id)) {
      return res.status(403).json({ error: 'Solo puedes cambiar tu propia contraseña' });
    }
    const { contrasenaActual, nuevaContrasena } = req.body;
    if (!contrasenaActual || !nuevaContrasena) {
      return res.status(400).json({ error: 'contrasenaActual y nuevaContrasena son obligatorias' });
    }
    const errores = validarUsuario({ contrasena: nuevaContrasena }, true);
    if (errores.length) return res.status(400).json({ error: errores });
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (req.usuario.rol !== 'admin' && !(await usuario.compararContrasena(contrasenaActual))) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    }
    usuario.contrasena = nuevaContrasena;
    await usuario.save();
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    responderError(res, error);
  }
};

exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['contrasena'] },
    });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    responderError(res, error);
  }
};
