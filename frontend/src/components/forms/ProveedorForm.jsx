import { useState } from 'react';
import Button from '../ui/Button';

export default function ProveedorForm({ initialValues = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', direccion: '', ...initialValues });

  function submit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {[
        ['nombre', 'Nombre', 'text'],
        ['correo', 'Correo', 'email'],
        ['telefono', 'Teléfono', 'tel'],
      ].map(([name, label, type]) => (
        <label key={name}>{label}
          <input type={type} value={form[name] ?? ''} onChange={(event) => setForm({ ...form, [name]: event.target.value })} required={name === 'nombre'} />
        </label>
      ))}
      <label className="full">Dirección
        <textarea value={form.direccion ?? ''} onChange={(event) => setForm({ ...form, direccion: event.target.value })} />
      </label>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar proveedor</Button>
      </div>
    </form>
  );
}
