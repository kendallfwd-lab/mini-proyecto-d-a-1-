const categorias = new Set([
  'alquiler',
  'servicios',
  'transporte',
  'publicidad',
  'comisiones',
  'suministros',
  'otros',
]);

module.exports = function validateGasto(body) {
  const errors = [];
  if (!categorias.has(body.categoria)) {
    errors.push(`categoria debe ser una de estas opciones: ${Array.from(categorias).join(', ')}`);
  }
  if (typeof body.descripcion !== 'string' || !body.descripcion.trim()) {
    errors.push('descripcion es obligatoria');
  } else if (body.descripcion.trim().length > 200) {
    errors.push('descripcion no puede superar 200 caracteres');
  }
  if (body.monto === undefined || !Number.isFinite(Number(body.monto)) || Number(body.monto) <= 0) {
    errors.push('monto debe ser un número mayor que cero');
  }
  const dateParts = typeof body.fecha_gasto === 'string'
    ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(body.fecha_gasto)
    : null;
  const parsedDate = dateParts
    ? new Date(Date.UTC(Number(dateParts[1]), Number(dateParts[2]) - 1, Number(dateParts[3])))
    : null;
  if (!parsedDate || parsedDate.toISOString().slice(0, 10) !== body.fecha_gasto) {
    errors.push('fecha_gasto debe tener formato YYYY-MM-DD');
  }
  return errors;
};
