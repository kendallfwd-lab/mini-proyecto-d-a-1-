module.exports = function validateCategoria(body) {
  const errors = [];
  if (typeof body.nombre !== 'string' || !body.nombre.trim()) {
    errors.push('nombre es obligatorio');
  } else if (body.nombre.trim().length > 100) {
    errors.push('nombre no puede superar 100 caracteres');
  }
  return errors;
};
