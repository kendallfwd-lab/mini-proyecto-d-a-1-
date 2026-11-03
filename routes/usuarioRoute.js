const express = require('express');
const {
  agregarUsuario,
  eliminarUsuario,
  actualizarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarContrasena,
} = require('../controllers/usuarioController');
const { requerirAutenticacion, permitirRoles } = require('../middleware/auth');

const router = express.Router();

// Consultas públicas: no requieren token Bearer.
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/', agregarUsuario);
router.patch('/:id', requerirAutenticacion, actualizarUsuario);
router.patch('/:id/contrasena', requerirAutenticacion, actualizarContrasena);
router.delete('/:id', requerirAutenticacion, permitirRoles('admin'), eliminarUsuario);

module.exports = router;
