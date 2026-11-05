const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const model = require('../models/usuarioModel');

exports.list = asyncHandler(async (req, res) => { res.json({ success: true, data: await model.listAdmins() }); });
exports.create = asyncHandler(async (req, res) => {
  const correo = String(req.body.correo).trim().toLowerCase();
  if (await model.findByEmail(correo)) throw httpError(409, 'El correo ya está registrado');
  const user = await model.create({ nombre: String(req.body.nombre).trim(), correo, passwordHash: await bcrypt.hash(req.body.password, 12), esPrincipal: 0 });
  res.status(201).json({ success: true, data: user });
});
exports.deactivate = asyncHandler(async (req, res) => { const count = await model.deactivate(req.params.id); if (!count) throw httpError(400, 'No se puede desactivar al administrador principal o la cuenta no existe'); res.status(204).send(); });
