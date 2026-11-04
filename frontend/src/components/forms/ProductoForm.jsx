import { useState } from 'react';
import Button from '../ui/Button';

const emptyProduct = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria_id: '',
  proveedor_id: '',
};

export default function ProductoForm({ initialValues = emptyProduct, categories, suppliers, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyProduct, ...initialValues });
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  function submit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria_id: Number(form.categoria_id),
      proveedor_id: Number(form.proveedor_id),
    });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {[
        ['codigo', 'Código', 'text'],
        ['nombre', 'Nombre', 'text'],
        ['precio', 'Precio', 'number'],
        ['stock', 'Stock', 'number'],
      ].map(([name, label, type]) => (
        <label key={name}>{label}
          <input name={name} type={type} value={form[name] ?? ''} onChange={change} required min={type === 'number' ? 0 : undefined} step={name === 'precio' ? '0.01' : undefined} />
        </label>
      ))}
      <label>Categoría
        <select name="categoria_id" value={form.categoria_id ?? ''} onChange={change} required>
          <option value="">Seleccionar</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}
        </select>
      </label>
      <label>Proveedor
        <select name="proveedor_id" value={form.proveedor_id ?? ''} onChange={change} required>
          <option value="">Seleccionar</option>
          {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.nombre}</option>)}
        </select>
      </label>
      <label className="full">Descripción
        <textarea name="descripcion" value={form.descripcion ?? ''} onChange={change} />
      </label>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar producto</Button>
      </div>
    </form>
  );
}
