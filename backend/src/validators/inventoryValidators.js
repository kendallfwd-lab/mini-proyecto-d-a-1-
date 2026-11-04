function text(value, field, max) {
  if (typeof value !== 'string' || !value.trim()) return `${field} es obligatorio`;
  if (value.trim().length > max) return `${field} no puede superar ${max} caracteres`;
  return null;
}
function positiveId(value, field) { return Number.isInteger(Number(value)) && Number(value) > 0 ? null : `${field} debe ser un entero positivo`; }
function validateCategory(body) { return [text(body.nombre, 'nombre', 100)].filter(Boolean); }
function validateSupplier(body) {
  const errors = [text(body.nombre, 'nombre', 150)].filter(Boolean);
  if (body.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.correo)) errors.push('correo no es válido');
  return errors;
}
function validateProduct(body) {
  const errors = [text(body.codigo, 'codigo', 50), text(body.nombre, 'nombre', 150)].filter(Boolean);
  if (body.precio === undefined || Number.isNaN(Number(body.precio)) || Number(body.precio) < 0) errors.push('precio debe ser un número no negativo');
  if (!Number.isInteger(Number(body.stock)) || Number(body.stock) < 0) errors.push('stock debe ser un entero no negativo');
  if (positiveId(body.categoria_id, 'categoria_id')) errors.push(positiveId(body.categoria_id, 'categoria_id'));
  if (positiveId(body.proveedor_id, 'proveedor_id')) errors.push(positiveId(body.proveedor_id, 'proveedor_id'));
  return errors;
}
module.exports = {
  validateCategory,
  validateSupplier,
  validateProduct,
  validateCategoria: validateCategory,
  validateProveedor: validateSupplier,
  validateProducto: validateProduct
};
