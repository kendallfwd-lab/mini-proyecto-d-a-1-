function text(value, field, max) {
  if (typeof value !== 'string' || !value.trim()) return `${field} es obligatorio`;
  if (value.trim().length > max) return `${field} no puede superar ${max} caracteres`;
  return null;
}

function positiveId(value, field) {
  return Number.isInteger(Number(value)) && Number(value) > 0
    ? null
    : `${field} debe ser un entero positivo`;
}

module.exports = function validateProducto(body) {
  const errors = [
    text(body.codigo, 'codigo', 50),
    text(body.nombre, 'nombre', 150),
  ].filter(Boolean);

  if (body.precio === undefined || Number.isNaN(Number(body.precio)) || Number(body.precio) < 0) {
    errors.push('precio debe ser un número no negativo');
  }
  if (body.costo_unitario !== undefined
    && body.costo_unitario !== null
    && (Number.isNaN(Number(body.costo_unitario)) || Number(body.costo_unitario) < 0)) {
    errors.push('costo_unitario debe ser un número no negativo');
  }
  if (!Number.isInteger(Number(body.stock)) || Number(body.stock) < 0) {
    errors.push('stock debe ser un entero no negativo');
  }
  const categoriaError = positiveId(body.categoria_id, 'categoria_id');
  const proveedorError = positiveId(body.proveedor_id, 'proveedor_id');
  if (categoriaError) errors.push(categoriaError);
  if (proveedorError) errors.push(proveedorError);

  return errors;
};
