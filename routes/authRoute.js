const express = require('express');
const { iniciarSesion } = require('../controllers/usuarioController');

const router = express.Router();

router.post('/login', iniciarSesion);

module.exports = router;
