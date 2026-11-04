import { useState } from 'react';
import Button from '../ui/Button';

export default function RecepcionForm({ purchase, onSubmit, onCancel }) {
  const [quantities, setQuantities] = useState(() => Object.fromEntries(
    purchase.productos.filter((line) => line.pendiente > 0).map((line) => [line.detalle_id, line.pendiente]),
  ));
  const pendingLines = purchase.productos.filter((line) => line.pendiente > 0);

  function submit(event) {
    event.preventDefault();
    onSubmit({
      productos: pendingLines
        .filter((line) => Number(quantities[line.detalle_id]) > 0)
        .map((line) => ({ detalle_id: line.detalle_id, cantidad: Number(quantities[line.detalle_id]) })),
    });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <p className="muted full">Indica cuántas unidades llegaron. Puedes registrar recepciones parciales.</p>
      {pendingLines.map((line) => (
        <label className="full" key={line.detalle_id}>
          {line.nombre} · pendientes {line.pendiente} de {line.cantidad}
          <input type="number" min="0" max={line.pendiente} step="1" value={quantities[line.detalle_id]} onChange={(event) => setQuantities({ ...quantities, [line.detalle_id]: event.target.value })} />
        </label>
      ))}
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={!pendingLines.some((line) => Number(quantities[line.detalle_id]) > 0)}>Registrar entrada</Button>
      </div>
    </form>
  );
}
