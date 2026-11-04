module.exports = function validateCliente(body) {
  const errors = [];
  if (typeof body.nombre !== 'string' || !body.nombre.trim()) {
    errors.push('nombre es obligatorio');
  } else if (body.nombre.trim().length > 120) {
    errors.push('nombre no puede superar 120 caracteres');
  }
  if (body.correo && (typeof body.correo !== 'string' || body.correo.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.correo))) {
    errors.push('correo debe ser válido y no superar 150 caracteres');
  }
  if (body.telefono && (typeof body.telefono !== 'string' || body.telefono.length > 25)) {
    errors.push('telefono no puede superar 25 caracteres');
  }
  if (body.direccion && (typeof body.direccion !== 'string' || body.direccion.length > 1000)) {
    errors.push('direccion no puede superar 1000 caracteres');
  }
  return errors;
};
