const crypto = require('node:crypto');

const mode = process.env.AUTH_MODE || 'bearer';
const cookieSecure = process.env.COOKIE_SECURE === 'true';
const cookiePrefix = cookieSecure ? '__Host-' : '';
const accessCookieName = `${cookiePrefix}access_token`;
const refreshCookieName = `${cookiePrefix}refresh_token`;
const csrfCookieName = 'csrf_token';
const refreshDays = Number(process.env.REFRESH_TOKEN_DAYS || 7);
const refreshMs = refreshDays * 24 * 60 * 60 * 1000;

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, part) => {
    const index = part.indexOf('=');
    if (index > 0) cookies[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
    return cookies;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/'];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join('; ');
}

function setSessionCookies(res, { accessToken, refreshToken, csrfToken }) {
  const common = { secure: cookieSecure, sameSite: 'Strict' };
  res.append('Set-Cookie', serializeCookie(accessCookieName, accessToken, { ...common, httpOnly: true, maxAge: 15 * 60 * 1000 }));
  res.append('Set-Cookie', serializeCookie(refreshCookieName, refreshToken, { ...common, httpOnly: true, maxAge: refreshMs }));
  res.append('Set-Cookie', serializeCookie(csrfCookieName, csrfToken, { ...common, maxAge: 15 * 60 * 1000 }));
}

function clearSessionCookies(res) {
  [accessCookieName, refreshCookieName, csrfCookieName].forEach((name) => res.append('Set-Cookie', serializeCookie(name, '', { secure: cookieSecure, sameSite: 'Strict', httpOnly: name !== csrfCookieName, maxAge: 0 })));
}

function randomToken() { return crypto.randomBytes(48).toString('base64url'); }
function hashToken(token) { return crypto.createHash('sha256').update(token).digest(); }
function randomId() { return crypto.randomUUID(); }

module.exports = { mode, cookieSecure, accessCookieName, refreshCookieName, csrfCookieName, refreshMs, parseCookies, setSessionCookies, clearSessionCookies, randomToken, hashToken, randomId };
