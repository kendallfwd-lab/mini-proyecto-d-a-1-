import { useState } from 'react';
import Button from '../ui/Button';
import formatCurrency from '../../utils/formatCurrency';

function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function VentaForm({ products, clients, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    cliente_id: '',
    telefono: '',
    canal: 'tienda',
    fecha_venta: localDate(),
    productos: [{ producto_id: '', cantidad: 1 }],
  });

  function updateProduct(index, key, value) {
    setForm((current) => ({
      ...current,
      productos: current.productos.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [key]: value } : item
      )),
    }));
  }

  function submit(event) {
    event.preventDefault();
    const client = clients.find((candidate) => candidate.id === Number(form.cliente_id));
    onSubmit({
      cliente: client.nombre,
      cliente_id: Number(form.cliente_id),
      telefono: form.telefono,
      canal: form.canal,
      fecha_venta: form.fecha_venta,
      productos: form.productos.map((item) => ({
        producto_id: Number(item.producto_id),
        cantidad: Number(item.cantidad),
      })),
    });
  }

  const total = form.productos.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === Number(item.producto_id));
    return sum + (product ? Number(product.precio) * Number(item.cantidad || 0) : 0);
  }, 0);

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>Cliente
        <select value={form.cliente_id} onChange={(event) => setForm({ ...form, cliente_id: event.target.value })} required>
          <option value="">Seleccionar cliente</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.nombre}{client.telefono ? ` · ${client.telefono}` : ''}</option>)}
        </select>
      </label>
      <label>Teléfono para la factura y WhatsApp
        <input type="tel" maxLength={25} autoComplete="tel" placeholder="+506 8888-8888" value={form.telefono} onChange={(event) => setForm({ ...form, telefono: event.target.value })} required />
      </label>
      <label>Canal de venta
        <select value={form.canal} onChange={(event) => setForm({ ...form, canal: event.target.value })}>
          <option value="tienda">Tienda</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
          <option value="web">Web</option>
        </select>
      </label>
      <label>Fecha de venta
        <input type="date" value={form.fecha_venta} onChange={(event) => setForm({ ...form, fecha_venta: event.target.value })} required />
      </label>
      <div className="sale-items full">
        <div className="sale-items-heading"><b>Productos</b><Button type="button" variant="secondary" onClick={() => setForm({ ...form, productos: [...form.productos, { producto_id: '', cantidad: 1 }] })}>+ Agregar producto</Button></div>
        {form.productos.map((item, index) => {
          const product = products.find((candidate) => candidate.id === Number(item.producto_id));
          const selectedIds = form.productos.filter((_, itemIndex) => itemIndex !== index).map((selected) => Number(selected.producto_id));
          return (
            <div className="sale-item" key={index}>
              <label>Producto
                <select value={item.producto_id} onChange={(event) => updateProduct(index, 'producto_id', event.target.value)} required>
                  <option value="">Seleccionar</option>
                  {products.filter((candidate) => candidate.stock > 0 && !selectedIds.includes(candidate.id)).map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>{candidate.nombre} · stock {candidate.stock} · {formatCurrency(candidate.precio)}</option>
                  ))}
                </select>
              </label>
              <label>Cantidad
                <input type="number" min="1" max={product?.stock} value={item.cantidad} onChange={(event) => updateProduct(index, 'cantidad', event.target.value)} required />
              </label>
              {form.productos.length > 1 && <button className="link-button danger-text sale-remove" type="button" onClick={() => setForm({ ...form, productos: form.productos.filter((_, itemIndex) => itemIndex !== index) })}>Quitar</button>}
              {product && <small className="sale-cost">{product.costo_unitario == null ? 'Falta costo unitario; esta venta quedará sin ganancia neta completa.' : `Costo unitario: ${formatCurrency(product.costo_unitario)}`}</small>}
            </div>
          );
        })}
      </div>
      <p className="sale-total full">Total de la venta: <b>{formatCurrency(total)}</b></p>
      <p className="muted full">Se creará la factura con este teléfono. Después podrás imprimirla o abrir WhatsApp con el detalle listo para enviar.</p>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={!clients.length || !products.some((product) => product.stock > 0)}>Registrar venta pagada</Button>
      </div>
    </form>
  );
}
