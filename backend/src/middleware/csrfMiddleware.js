const { verifyCsrf } = require('../config/jwt');
const { mode, csrfCookieName, parseCookies } = require('../config/session');
const httpError = require('../utils/httpError');

const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((value) => value.trim()).filter(Boolean);

module.exports = function csrfMiddleware(req, res, next) {
  if (mode !== 'cookie' || !unsafeMethods.has(req.method)) return next();
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) return next(httpError(403, 'Origen no permitido'));
  const fetchSite = req.headers['sec-fetch-site'];
  if (fetchSite === 'cross-site') return next(httpError(403, 'Solicitud no permitida'));
  try {
    const token = req.headers['x-csrf-token'];
    const cookie = parseCookies(req.headers.cookie)[csrfCookieName];
    const payload = verifyCsrf(token || cookie || '');
    if (payload.typ !== 'csrf' || payload.sid !== req.sessionId) throw new Error('csrf');
    next();
  } catch (error) { next(httpError(403, 'Token CSRF inválido')); }
};

module.exports.refresh = function csrfRefreshMiddleware(req, res, next) {
  if (mode !== 'cookie' || req.method !== 'POST') return next();
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) return next(httpError(403, 'Origen no permitido'));
  const fetchSite = req.headers['sec-fetch-site'];
  if (fetchSite === 'cross-site') return next(httpError(403, 'Solicitud no permitida'));
  try {
    const payload = verifyCsrf(req.headers['x-csrf-token'] || parseCookies(req.headers.cookie)[csrfCookieName] || '');
    if (payload.typ !== 'csrf' || !payload.sid) throw new Error('csrf');
    next();
  } catch (error) { next(httpError(403, 'Token CSRF inválido')); }
};
