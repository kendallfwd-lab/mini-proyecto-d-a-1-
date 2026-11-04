import { useState } from 'react';
import Button from '../ui/Button';

export default function ClienteForm({ initialValues = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    ...initialValues,
  });

  function submit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>Nombre
        <input maxLength={120} value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
      </label>
      <label>Correo electrónico
        <input type="email" maxLength={150} value={form.correo ?? ''} onChange={(event) => setForm({ ...form, correo: event.target.value })} />
      </label>
      <label>Teléfono
        <input type="tel" maxLength={25} value={form.telefono ?? ''} onChange={(event) => setForm({ ...form, telefono: event.target.value })} />
      </label>
      <label className="full">Dirección
        <textarea maxLength={1000} value={form.direccion ?? ''} onChange={(event) => setForm({ ...form, direccion: event.target.value })} />
      </label>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar cliente</Button>
      </div>
    </form>
  );
}
