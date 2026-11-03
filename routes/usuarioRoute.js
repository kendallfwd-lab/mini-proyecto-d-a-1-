const express = require('express');
const {
  agregarUsuario,
  eliminarUsuario,
  actualizarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
} = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/', agregarUsuario);
router.patch('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
