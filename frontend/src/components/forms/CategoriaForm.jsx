import { useState } from 'react';
import Button from '../ui/Button';

export default function CategoriaForm({ initialValues = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', ...initialValues });

  function submit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>Nombre
        <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required maxLength={100} />
      </label>
      <label className="full">Descripción
        <textarea value={form.descripcion ?? ''} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} />
      </label>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar categoría</Button>
      </div>
    </form>
  );
}
