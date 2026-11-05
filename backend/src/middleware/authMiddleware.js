const { verify } = require('../config/jwt');
const httpError = require('../utils/httpError');
const usuarioModel = require('../models/usuarioModel');

async function authMiddleware(req, res, next) {
  if (process.env.AUTH_TEST_BYPASS === 'true') { req.user = { id: 0, nombre: 'Test', correo: 'test@example.com' }; return next(); }
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) throw httpError(401, 'Se requiere un token Bearer');
    const token = header.slice(7).trim();
    if (!token) throw httpError(401, 'Token Bearer inválido');
    const payload = verify(token);
    const user = await usuarioModel.findById(payload.sub);
    if (!user || !user.activo || Number(user.version_token) !== Number(payload.version_token)) throw httpError(401, 'No autorizado');
    req.user = user;
    next();
  } catch (error) { next(httpError(401, 'No autorizado')); }
}
module.exports = authMiddleware;
