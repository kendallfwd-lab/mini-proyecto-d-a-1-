const { Usuario } = require('../models');

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
  if (data.correo !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
    errores.push('correo no tiene un formato válido');
  }
  if (data.contrasena !== undefined && String(data.contrasena).length < 8) {
    errores.push('contrasena debe tener al menos 8 caracteres');
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
    const nuevoUsuario = await Usuario.create(req.body);
    const respuesta = nuevoUsuario.toJSON();
    delete respuesta.contrasena;
    res.status(201).json(respuesta);
  } catch (error) {
    responderError(res, error);
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
    const errores = validarUsuario(req.body, true);
    if (errores.length) return res.status(400).json({ error: errores });
    const [actualizado] = await Usuario.update(req.body, { where: { id: req.params.id } });
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
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['contrasena'] } });
    res.json(usuarios);
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
