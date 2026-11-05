const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateRegister(body) { const errors = []; if (!body.nombre || String(body.nombre).trim().length < 2) errors.push('nombre es obligatorio'); if (!body.correo || !email.test(String(body.correo).trim())) errors.push('correo no es válido'); if (!body.password || String(body.password).length < 8) errors.push('password debe tener al menos 8 caracteres'); return errors; }
function validateLogin(body) { const errors = []; if (!body.correo || !email.test(String(body.correo).trim())) errors.push('correo no es válido'); if (!body.password) errors.push('password es obligatorio'); return errors; }
module.exports = { validateRegister, validateLogin };
