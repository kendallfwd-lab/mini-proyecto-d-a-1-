const { verify } = require('../config/jwt');
const httpError = require('../utils/httpError');
const usuarioModel = require('../models/usuarioModel');
const sessionModel = require('../models/sessionModel');
const { mode, accessCookieName, parseCookies } = require('../config/session');

async function authMiddleware(req, res, next) {
  if (process.env.NODE_ENV === 'test' && process.env.AUTH_TEST_BYPASS === 'true') { req.user = { id: 0, nombre: 'Test', correo: 'test@example.com', es_principal: 1, activo: 1, version_token: 0 }; return next(); }
  try {
    const cookies = parseCookies(req.headers.cookie);
    const header = req.headers.authorization || '';
    const token = mode === 'cookie' ? cookies[accessCookieName] : header.startsWith('Bearer ') ? header.slice(7).trim() : null;
    if (!token) throw httpError(401, 'No autorizado');
    const payload = verify(token);
    const user = await usuarioModel.findById(payload.sub);
    if (!user || !user.activo || Number(user.version_token) !== Number(payload.version_token)) throw httpError(401, 'No autorizado');
    if (!payload.sid) throw httpError(401, 'No autorizado');
    const session = await sessionModel.findActive(payload.sid);
    if (!session || Number(session.usuario_id) !== Number(user.id)) throw httpError(401, 'No autorizado');
    await sessionModel.touch(payload.sid);
    req.sessionId = payload.sid; req.user = user; next();
  } catch (error) { next(httpError(401, 'No autorizado')); }
}
module.exports = authMiddleware;
