const express = require('express');
const { obtenerProyectos, crearProyecto } = require('../controllers/proyectoController');
const { requerirAutenticacion } = require('../middleware/auth');

const router = express.Router();
// Consultas públicas: no requieren token Bearer.
router.get('/', obtenerProyectos);
router.post('/', requerirAutenticacion, crearProyecto);

module.exports = router;
