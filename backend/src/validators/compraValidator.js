function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) === value;
}

module.exports = {
  create(body) {
    const errors = [];
    if (!Number.isInteger(Number(body.proveedor_id)) || Number(body.proveedor_id) < 1) {
      errors.push('proveedor_id debe ser un entero positivo');
    }
    if (!isDate(body.fecha_pedido)) errors.push('fecha_pedido debe ser una fecha válida en formato YYYY-MM-DD');
    if (body.notas != null && (typeof body.notas !== 'string' || body.notas.length > 500)) {
      errors.push('notas no puede superar 500 caracteres');
    }
    if (!Array.isArray(body.productos) || body.productos.length === 0) {
      errors.push('Agrega al menos un producto a la compra');
    } else {
      const ids = new Set();
      body.productos.forEach((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`productos[${index}] debe ser un objeto`);
          return;
        }
        const id = Number(item.producto_id);
        if (!Number.isInteger(id) || id < 1) errors.push(`productos[${index}].producto_id debe ser un entero positivo`);
        else if (ids.has(id)) errors.push('No repitas un producto en la compra');
        ids.add(id);
        if (!Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) < 1) {
          errors.push(`productos[${index}].cantidad debe ser un entero positivo`);
        }
        if (!Number.isFinite(Number(item.costo_unitario)) || Number(item.costo_unitario) < 0) {
          errors.push(`productos[${index}].costo_unitario debe ser un monto no negativo`);
        }
      });
    }
    return errors;
  },

  receive(body) {
    const errors = [];
    if (!Array.isArray(body.productos) || body.productos.length === 0) {
      errors.push('Indica las cantidades recibidas');
    } else {
      const ids = new Set();
      body.productos.forEach((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`productos[${index}] debe ser un objeto`);
          return;
        }
        const id = Number(item.detalle_id);
        if (!Number.isInteger(id) || id < 1) errors.push(`productos[${index}].detalle_id debe ser un entero positivo`);
        else if (ids.has(id)) errors.push('No repitas una línea de compra');
        ids.add(id);
        if (!Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) < 1) {
          errors.push(`productos[${index}].cantidad debe ser un entero positivo`);
        }
      });
    }
    return errors;
  },
};
