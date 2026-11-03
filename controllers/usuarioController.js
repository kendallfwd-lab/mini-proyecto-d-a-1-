const { Usuario } = require('../models');

exports.agregarUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    const respuesta = nuevoUsuario.toJSON();
    delete respuesta.contrasena;
    res.status(201).json(respuesta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await Usuario.destroy({ where: { id: req.params.id } });
    if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const [actualizado] = await Usuario.update(req.body, { where: { id: req.params.id } });
    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['contrasena'] },
    });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['contrasena'] } });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};
