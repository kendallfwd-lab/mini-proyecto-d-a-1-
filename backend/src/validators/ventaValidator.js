const canales = new Set(['tienda', 'whatsapp', 'instagram', 'web']);

module.exports = function validateVenta(body) {
  const errors = [];
  if (typeof body.cliente !== 'string' || !body.cliente.trim()) {
    errors.push('cliente es obligatorio');
  } else if (body.cliente.trim().length > 120) {
    errors.push('cliente no puede superar 120 caracteres');
  }
  if (body.cliente_id != null && (!Number.isInteger(Number(body.cliente_id)) || Number(body.cliente_id) < 1)) {
    errors.push('cliente_id debe ser un entero positivo');
  }
  if (typeof body.telefono !== 'string' || !/^\+?[\d\s()-]{8,25}$/.test(body.telefono.trim())) {
    errors.push('telefono es obligatorio y debe ser un número válido');
  } else {
    const digits = body.telefono.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) errors.push('telefono debe tener entre 8 y 15 dígitos');
  }
  if (!canales.has(body.canal)) {
    errors.push('canal debe ser tienda, whatsapp, instagram o web');
  }
  if (typeof body.fecha_venta !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.fecha_venta)) {
    errors.push('fecha_venta debe tener formato YYYY-MM-DD');
  } else {
    const [year, month, day] = body.fecha_venta.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.toISOString().slice(0, 10) !== body.fecha_venta) {
      errors.push('fecha_venta no es una fecha válida');
    }
  }
  if (!Array.isArray(body.productos) || body.productos.length === 0) {
    errors.push('Agrega al menos un producto a la venta');
  } else {
    const ids = new Set();
    body.productos.forEach((item, index) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errors.push(`productos[${index}] debe ser un objeto`);
        return;
      }
      if (!Number.isInteger(Number(item.producto_id)) || Number(item.producto_id) < 1) {
        errors.push(`productos[${index}].producto_id debe ser un entero positivo`);
      } else if (ids.has(Number(item.producto_id))) {
        errors.push('No repitas un producto en la venta');
      }
      ids.add(Number(item.producto_id));
      if (!Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) < 1) {
        errors.push(`productos[${index}].cantidad debe ser un entero positivo`);
      }
    });
  }
  return errors;
};
