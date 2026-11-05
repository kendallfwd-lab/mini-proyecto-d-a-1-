const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
module.exports = function validateAdmin(body) {
  const errors = [];
  if (Object.prototype.hasOwnProperty.call(body, 'es_principal') || Object.prototype.hasOwnProperty.call(body, 'version_token') || Object.prototype.hasOwnProperty.call(body, 'activo')) errors.push('No se pueden enviar campos protegidos');
  if (!body.nombre || String(body.nombre).trim().length < 2) errors.push('nombre es obligatorio');
  if (!body.correo || !email.test(String(body.correo).trim())) errors.push('correo no es válido');
  if (!body.password || String(body.password).length < 8 || String(body.password).length > 72) errors.push('password debe tener entre 8 y 72 caracteres');
  return errors;
};
