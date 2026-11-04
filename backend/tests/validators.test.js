const validateProducto = require('../src/validators/productoValidator');
const validateCategoria = require('../src/validators/categoriaValidator');
const validateProveedor = require('../src/validators/proveedorValidator');

describe('validaciones de inventario', () => {
  test('rechaza producto sin datos obligatorios', () => {
    expect(validateProducto({}).length).toBeGreaterThan(0);
  });

  test('acepta producto válido', () => {
    expect(validateProducto({
      codigo: 'A-1',
      nombre: 'Producto',
      precio: 10,
      stock: 5,
      categoria_id: 1,
      proveedor_id: 1,
    })).toEqual([]);
  });

  test('valida categoría y proveedor', () => {
    expect(validateCategoria({ nombre: '' }).length).toBeGreaterThan(0);
    expect(validateProveedor({ nombre: 'Proveedor', correo: 'correo@demo.com' })).toEqual([]);
  });
});
