const { Proyecto } = require('../models');

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.findAll({ order: [['id', 'ASC']] });
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.crearProyecto = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;
    if (!nombre || String(nombre).trim().length < 2) return res.status(400).json({ error: 'nombre es obligatorio' });
    const proyecto = await Proyecto.create({ nombre: String(nombre).trim(), descripcion, estado, usuarioId: req.usuario.id });
    res.status(201).json(proyecto);
  } catch (error) {
    res.status(400).json({ error: error.errors?.map((item) => item.message) || 'Datos inválidos' });
  }
};

module.exports = exports;
