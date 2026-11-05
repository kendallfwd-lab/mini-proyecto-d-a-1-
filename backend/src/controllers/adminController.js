const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const model = require('../models/usuarioModel');
const auditModel = require('../models/auditModel');
const sessionModel = require('../models/sessionModel');

const safeUser = (user) => {
  const { version_token, password_hash, ...publicUser } = user;
  return publicUser;
};

exports.list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await model.listAdmins() });
});
exports.audit = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await auditModel.list(req.query.limit) });
});

exports.create = asyncHandler(async (req, res) => {
  const correo = String(req.body.correo).trim().toLowerCase();
  if (await model.findByEmail(correo)) throw httpError(409, 'El correo ya está registrado');
  const user = await model.create({
    nombre: String(req.body.nombre).trim(),
    correo,
    passwordHash: await bcrypt.hash(req.body.password, 12),
    esPrincipal: 0,
  });
  await auditModel.record({ userId: req.user.id, action: 'admin_create', entity: 'usuarios', recordId: user.id, metadata: { correo } });
  res.status(201).json({ success: true, data: safeUser(user) });
});

exports.deactivate = asyncHandler(async (req, res) => {
  const count = await model.deactivate(req.params.id);
  if (!count) throw httpError(400, 'No se puede desactivar al administrador principal o la cuenta no existe');
  await auditModel.record({ userId: req.user.id, action: 'admin_deactivate', entity: 'usuarios', recordId: req.params.id });
  res.status(204).send();
});

exports.revokeSessions = asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  if (targetId === Number(req.user.id)) throw httpError(400, 'El administrador principal no puede revocar su propia sesión desde esta acción');
  await sessionModel.revokeUser(targetId);
  await model.invalidateToken(targetId);
  await auditModel.record({ userId: req.user.id, action: 'sessions_revoke', entity: 'usuarios', recordId: targetId });
  res.status(204).send();
});
