import { useCallback, useState } from 'react';
import GastoForm from '../components/forms/GastoForm';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import DataTable from '../components/tables/DataTable';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import useResource from '../hooks/useResource';
import { dashboardService } from '../services/dashboardService';
import { gastosService } from '../services/gastosService';
import formatCurrency from '../utils/formatCurrency';

const categoryLabels = {
  alquiler: 'Alquiler',
  servicios: 'Servicios',
  transporte: 'Transporte',
  publicidad: 'Publicidad',
  comisiones: 'Comisiones',
  suministros: 'Suministros',
  otros: 'Otros',
};

function formatDate(value) {
  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split('-').map(Number);
  return year && month && day
    ? new Date(year, month - 1, day).toLocaleDateString('es-CR')
    : date;
}

export default function Gastos() {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState('');
  const load = useCallback(
    () => Promise.all([gastosService.list(), dashboardService.profitability()]),
    [],
  );
  const { data, loading, error, setError, reload } = useResource(load, [load]);
  const [expenses = [], profitability] = data || [];

  function open(expense) {
    setEditing(expense || null);
    setModal(true);
    setError('');
  }

  async function save(form) {
    try {
      if (editing) await gastosService.update(editing.id, form);
      else await gastosService.create(form);
      setModal(false);
      setSuccess(editing ? 'Gasto actualizado.' : 'Gasto real registrado.');
      reload();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  async function remove() {
    try {
      await gastosService.remove(deleting.id);
      setDeleting(null);
      setSuccess('Gasto eliminado.');
      reload();
    } catch (removeError) {
      setDeleting(null);
      setError(removeError.message);
    }
  }

  const columns = [
    { key: 'fecha_gasto', label: 'Fecha', render: (expense) => formatDate(expense.fecha_gasto) },
    { key: 'categoria', label: 'Categoría', render: (expense) => categoryLabels[expense.categoria] || expense.categoria },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'monto', label: 'Monto', render: (expense) => formatCurrency(expense.monto) },
    { key: 'tipo', label: 'Registro', render: (expense) => expense.es_demo ? <span className="badge warning">Demostración</span> : <span className="badge real-badge">Real</span> },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (expense) => expense.es_demo
        ? <span className="muted">Solo lectura</span>
        : (
          <>
            <button className="link-button" onClick={() => open(expense)}>Editar</button>
            <button className="link-button danger-text" onClick={() => setDeleting(expense)}>Eliminar</button>
          </>
        ),
    },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="muted">Control financiero</p><h2>Gastos y ganancias</h2><p className="muted">Registra gastos operativos y revisa la rentabilidad de tus ventas pagadas.</p></div>
        <Button onClick={() => open(null)}>+ Registrar gasto</Button>
      </div>
      <ErrorMessage error={error} success={success} />
      {loading ? <Loading>Cargando información financiera...</Loading> : profitability && (
        <>
          <div className="stats-grid">
            <article className="stat-card"><div className="stat-icon">₡</div><div><p>Ingresos reales</p><strong>{formatCurrency(profitability.real.ingresos)}</strong><small>ventas pagadas no demo</small></div></article>
            <article className="stat-card orange"><div className="stat-icon">−</div><div><p>Costos de productos</p><strong>{formatCurrency(profitability.real.costo_productos)}</strong><small>según costo al vender</small></div></article>
            <article className="stat-card red"><div className="stat-icon">−</div><div><p>Gastos reales</p><strong>{formatCurrency(profitability.real.gastos)}</strong><small>gastos registrados</small></div></article>
            <article className={`stat-card ${!profitability.real.ganancia_completa ? 'orange' : profitability.real.ganancia_neta >= 0 ? 'green' : 'red'}`}><div className="stat-icon">=</div><div><p>Ganancia neta real</p><strong>{profitability.real.ganancia_completa ? formatCurrency(profitability.real.ganancia_neta) : 'Incompleta'}</strong><small>ingresos − costos − gastos</small></div></article>
          </div>
          <div className="panel">
            <div className="panel-heading"><div><h3>Datos de demostración</h3><p className="muted">Ejemplos separados; no se mezclan con la ganancia real.</p></div><span className="badge warning">DEMO</span></div>
            <div className="stats-grid">
              <article className="stat-card"><div><p>Ingresos demo</p><strong>{formatCurrency(profitability.demostracion.ingresos)}</strong></div></article>
              <article className="stat-card orange"><div><p>Costos demo</p><strong>{formatCurrency(profitability.demostracion.costo_productos)}</strong></div></article>
              <article className="stat-card red"><div><p>Gastos demo</p><strong>{formatCurrency(profitability.demostracion.gastos)}</strong></div></article>
              <article className={`stat-card ${profitability.demostracion.ganancia_neta >= 0 ? 'green' : 'red'}`}><div><p>Resultado demo</p><strong>{formatCurrency(profitability.demostracion.ganancia_neta)}</strong></div></article>
            </div>
            {profitability.real.lineas_sin_costo > 0 && <p className="feedback error">Hay {profitability.real.lineas_sin_costo} líneas de ventas reales sin costo de producto. Completa el costo unitario en Productos para calcular la ganancia con precisión.</p>}
            <p className="muted">{profitability.nota}</p>
          </div>
          <section className="panel">
            <div className="panel-heading"><div><h3>Registro de gastos</h3><p className="muted">Los ejemplos están protegidos contra edición y eliminación.</p></div></div>
            <DataTable columns={columns} rows={expenses} emptyMessage="Aún no hay gastos. Registra el primero para comenzar." />
          </section>
        </>
      )}
      {modal && <Modal title={editing ? 'Editar gasto' : 'Registrar gasto real'} onClose={() => setModal(false)}><GastoForm initialValues={editing || undefined} onSubmit={save} onCancel={() => setModal(false)} /></Modal>}
      {deleting && <ConfirmDialog onCancel={() => setDeleting(null)} onConfirm={remove}>¿Eliminar el gasto “{deleting.descripcion}” por {formatCurrency(deleting.monto)}?</ConfirmDialog>}
    </div>
  );
}
