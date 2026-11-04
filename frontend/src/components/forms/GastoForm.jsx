import { useState } from 'react';
import Button from '../ui/Button';

const categories = [
  ['alquiler', 'Alquiler'],
  ['servicios', 'Servicios'],
  ['transporte', 'Transporte'],
  ['publicidad', 'Publicidad'],
  ['comisiones', 'Comisiones'],
  ['suministros', 'Suministros'],
  ['otros', 'Otros'],
];

function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function GastoForm({ initialValues = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    categoria: 'otros',
    descripcion: '',
    monto: '',
    ...initialValues,
    fecha_gasto: initialValues.fecha_gasto
      ? String(initialValues.fecha_gasto).slice(0, 10)
      : localDate(),
  }));

  function submit(event) {
    event.preventDefault();
    onSubmit({ ...form, monto: Number(form.monto) });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>Categoría
        <select value={form.categoria} onChange={(event) => setForm({ ...form, categoria: event.target.value })} required>
          {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label>Monto (CRC)
        <input type="number" min="0.01" step="0.01" value={form.monto} onChange={(event) => setForm({ ...form, monto: event.target.value })} required />
      </label>
      <label className="full">Descripción
        <input maxLength={200} value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} required />
      </label>
      <label>Fecha del gasto
        <input type="date" value={form.fecha_gasto} onChange={(event) => setForm({ ...form, fecha_gasto: event.target.value })} required />
      </label>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar gasto real</Button>
      </div>
    </form>
  );
}
