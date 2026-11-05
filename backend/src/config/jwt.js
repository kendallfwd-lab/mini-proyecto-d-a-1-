const jwt = require('jsonwebtoken');

const required = ['JWT_SECRET', 'JWT_EXPIRES_IN', 'JWT_ISSUER', 'JWT_AUDIENCE'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Falta ${key} en las variables de entorno`);
}
if (process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('replace-with')) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres aleatorios');
}

const options = { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN, issuer: process.env.JWT_ISSUER, audience: process.env.JWT_AUDIENCE };
function sign(payload) { return jwt.sign(payload, process.env.JWT_SECRET, options); }
function verify(token) { return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], issuer: process.env.JWT_ISSUER, audience: process.env.JWT_AUDIENCE }); }
module.exports = { sign, verify };
