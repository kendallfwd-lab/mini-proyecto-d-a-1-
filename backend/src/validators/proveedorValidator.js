module.exports = function validateProveedor(body) {
  const errors = [];
  if (typeof body.nombre !== 'string' || !body.nombre.trim()) {
    errors.push('nombre es obligatorio');
  } else if (body.nombre.trim().length > 150) {
    errors.push('nombre no puede superar 150 caracteres');
  }
  if (body.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.correo)) {
    errors.push('correo no es válido');
  }
  return errors;
};
