import { useState } from 'react';
import Button from '../ui/Button';
import formatCurrency from '../../utils/formatCurrency';

function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function CompraForm({ suppliers, products, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    proveedor_id: '',
    fecha_pedido: localDate(),
    notas: '',
    productos: [{ producto_id: '', cantidad: 1, costo_unitario: '' }],
  });
  const supplierProducts = products.filter((product) => product.proveedor_id === Number(form.proveedor_id));

  function updateProduct(index, key, value) {
    setForm((current) => ({
      ...current,
      productos: current.productos.map((item, itemIndex) => (
        itemIndex === index
          ? {
            ...item,
            [key]: value,
            ...(key === 'producto_id' ? { costo_unitario: products.find((product) => product.id === Number(value))?.costo_unitario ?? '' } : {}),
          }
          : item
      )),
    }));
  }

  function chooseSupplier(value) {
    setForm((current) => ({
      ...current,
      proveedor_id: value,
      productos: [{ producto_id: '', cantidad: 1, costo_unitario: '' }],
    }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({
      proveedor_id: Number(form.proveedor_id),
      fecha_pedido: form.fecha_pedido,
      notas: form.notas,
      productos: form.productos.map((item) => ({
        producto_id: Number(item.producto_id),
        cantidad: Number(item.cantidad),
        costo_unitario: Number(item.costo_unitario),
      })),
    });
  }

  const total = form.productos.reduce(
    (sum, item) => sum + Number(item.cantidad || 0) * Number(item.costo_unitario || 0),
    0,
  );

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>Proveedor
        <select value={form.proveedor_id} onChange={(event) => chooseSupplier(event.target.value)} required>
          <option value="">Seleccionar proveedor</option>
          {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.nombre}</option>)}
        </select>
      </label>
      <label>Fecha del pedido
        <input type="date" value={form.fecha_pedido} onChange={(event) => setForm({ ...form, fecha_pedido: event.target.value })} required />
      </label>
      <div className="full">
        <div className="sale-items-heading">
          <b>Productos del proveedor</b>
          <Button type="button" variant="secondary" disabled={!form.proveedor_id || !supplierProducts.some((product) => !form.productos.some((line) => Number(line.producto_id) === product.id))} onClick={() => setForm({ ...form, productos: [...form.productos, { producto_id: '', cantidad: 1, costo_unitario: '' }] })}>+ Agregar producto</Button>
        </div>
        {!supplierProducts.length && form.proveedor_id && <p className="muted">No hay productos asignados a este proveedor. Asigna el proveedor desde Productos antes de crear el pedido.</p>}
        {form.productos.map((item, index) => {
          const used = form.productos.filter((_, itemIndex) => itemIndex !== index).map((line) => Number(line.producto_id));
          const selected = products.find((product) => product.id === Number(item.producto_id));
          return (
            <div className="purchase-item" key={index}>
              <label>Producto
                <select value={item.producto_id} onChange={(event) => updateProduct(index, 'producto_id', event.target.value)} required disabled={!form.proveedor_id}>
                  <option value="">Seleccionar</option>
                  {supplierProducts.filter((product) => !used.includes(product.id)).map((product) => <option key={product.id} value={product.id}>{product.nombre} · {product.codigo}</option>)}
                </select>
              </label>
              <label>Cantidad
                <input type="number" min="1" step="1" value={item.cantidad} onChange={(event) => updateProduct(index, 'cantidad', event.target.value)} required />
              </label>
              <label>Costo unitario
                <input type="number" min="0" step="0.01" value={item.costo_unitario} onChange={(event) => updateProduct(index, 'costo_unitario', event.target.value)} required />
              </label>
              {form.productos.length > 1 && <button className="link-button danger-text purchase-remove" type="button" onClick={() => setForm({ ...form, productos: form.productos.filter((_, itemIndex) => itemIndex !== index) })}>Quitar</button>}
              {selected?.costo_unitario != null && <small className="purchase-hint">Costo actual: {formatCurrency(selected.costo_unitario)}</small>}
            </div>
          );
        })}
      </div>
      <label className="full">Notas
        <textarea maxLength={500} value={form.notas} onChange={(event) => setForm({ ...form, notas: event.target.value })} />
      </label>
      <p className="sale-total full">Total estimado del pedido: <b>{formatCurrency(total)}</b></p>
      <p className="muted full">El inventario solo aumenta al registrar la recepción de los productos.</p>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={!suppliers.length || !supplierProducts.length}>Crear pedido</Button>
      </div>
    </form>
  );
}
