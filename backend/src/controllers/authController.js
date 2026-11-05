const bcrypt = require('bcryptjs');
const { sign } = require('../config/jwt');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const model = require('../models/usuarioModel');

const normalize = (value) => String(value || '').trim().toLowerCase();
function response(user) { const { version_token, password_hash, ...publicUser } = user; return { user: publicUser, token: sign({ sub: user.id, version_token: user.version_token }) }; }

exports.register = asyncHandler(async (req, res) => {
  const nombre = String(req.body.nombre).trim(); const correo = normalize(req.body.correo);
  const existing = await model.findByEmail(correo); if (existing) throw httpError(409, 'El correo ya está registrado');
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await model.create({ nombre, correo, passwordHash });
  res.status(201).json({ success: true, data: response(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const correo = normalize(req.body.correo); const user = await model.findByEmail(correo);
  if (!user || !user.activo || !(await bcrypt.compare(req.body.password, user.password_hash))) throw httpError(401, 'Correo o contraseña incorrectos');
  res.json({ success: true, data: response(user) });
});

exports.me = asyncHandler(async (req, res) => { res.json({ success: true, data: req.user }); });
exports.logout = asyncHandler(async (req, res) => { await model.invalidateToken(req.user.id); res.status(204).send(); });
