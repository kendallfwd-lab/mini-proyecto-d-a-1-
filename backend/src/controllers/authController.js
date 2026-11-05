const bcrypt = require('bcryptjs');
const { sign, signCsrf } = require('../config/jwt');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const model = require('../models/usuarioModel');
const sessionModel = require('../models/sessionModel');
const auditModel = require('../models/auditModel');
const { mode, refreshMs, randomId, randomToken, hashToken, setSessionCookies, clearSessionCookies, parseCookies, refreshCookieName } = require('../config/session');

const normalize = (value) => String(value || '').trim().toLowerCase();
const publicUser = (user) => { const { version_token, password_hash, ...safeUser } = user; return safeUser; };
const expiresAt = () => new Date(Date.now() + refreshMs);

async function issueSession(user, req) {
  const sessionId = randomId(); const familyId = randomId(); const refreshToken = randomToken();
  await sessionModel.createSession({ id: sessionId, userId: user.id, expiresAt: expiresAt(), ip: req.ip, userAgent: req.get('user-agent') });
  await sessionModel.addRefresh({ sessionId, hash: hashToken(refreshToken), familyId, expiresAt: expiresAt() });
  const accessToken = sign({ sub: user.id, sid: sessionId, version_token: user.version_token });
  const csrfToken = signCsrf(sessionId);
  return { accessToken, refreshToken, csrfToken, sessionId, familyId };
}

exports.login = asyncHandler(async (req, res) => {
  const user = await model.findByEmail(normalize(req.body.correo));
  if (!user || !user.activo || !(await bcrypt.compare(req.body.password, user.password_hash))) {
    await auditModel.record({ action: 'login', entity: 'usuarios', result: 'fallido', metadata: { motivo: 'credenciales_invalidas' } }).catch(() => {});
    throw httpError(401, 'Correo o contraseña incorrectos');
  }
  const session = await issueSession(user, req);
  await auditModel.record({ userId: user.id, action: 'login', entity: 'usuarios', recordId: user.id, metadata: { modo: mode } }).catch(() => {});
  if (mode === 'cookie') { setSessionCookies(res, session); return res.json({ success: true, data: { user: publicUser(user) } }); }
  res.json({ success: true, data: { user: publicUser(user), token: session.accessToken } });
});

exports.refresh = asyncHandler(async (req, res) => {
  if (mode !== 'cookie') throw httpError(400, 'La renovación por cookie no está habilitada en este modo');
  const refreshToken = parseCookies(req.headers.cookie)[refreshCookieName];
  if (!refreshToken) throw httpError(401, 'No autorizado');
  const hash = hashToken(refreshToken); const stored = await sessionModel.findRefresh(hash);
  if (!stored) throw httpError(401, 'No autorizado');
  const session = await sessionModel.findActive(stored.sesion_id);
  if (!session) throw httpError(401, 'No autorizado');
  const user = await model.findById(session.usuario_id);
  if (!user || !user.activo) throw httpError(401, 'No autorizado');
  const nextRefresh = randomToken();
  try { await sessionModel.rotateRefresh(stored.id, hash, { sessionId: stored.sesion_id, hash: hashToken(nextRefresh), familyId: stored.familia_id, expiresAt: expiresAt() }); }
  catch (error) { if (error.message === 'REFRESH_REUSED') { await auditModel.record({ userId: user.id, action: 'refresh_reuse', entity: 'sesiones', recordId: stored.sesion_id, result: 'fallido' }).catch(() => {}); } throw httpError(401, 'No autorizado'); }
  const accessToken = sign({ sub: user.id, sid: stored.sesion_id, version_token: user.version_token });
  setSessionCookies(res, { accessToken, refreshToken: nextRefresh, csrfToken: signCsrf(stored.sesion_id) });
  res.json({ success: true, data: { user: publicUser(user) } });
});

exports.me = asyncHandler(async (req, res) => { res.json({ success: true, data: publicUser(req.user) }); });
exports.logout = asyncHandler(async (req, res) => { await sessionModel.revoke(req.sessionId); await model.invalidateToken(req.user.id); await auditModel.record({ userId: req.user.id, action: 'logout', entity: 'sesiones', recordId: req.sessionId }).catch(() => {}); clearSessionCookies(res); res.status(204).send(); });
