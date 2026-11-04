import { useCallback, useState } from 'react';
import ClienteForm from '../components/forms/ClienteForm';
import Button from '../components/ui/Button';
import DataTable from '../components/tables/DataTable';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import useResource from '../hooks/useResource';
import { clientesService } from '../services/clientesService';
import formatCurrency from '../utils/formatCurrency';

function formatDate(value) {
  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split('-').map(Number);
  return year && month && day
    ? new Date(year, month - 1, day).toLocaleDateString('es-CR')
    : date;
}

export default function Clientes() {
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const load = useCallback(() => clientesService.list(), []);
  const { data, loading, error, setError, reload } = useResource(load, [load]);
  const clients = data || [];

  function open(client) {
    setEditing(client || null);
    setError('');
    setModal(true);
  }

  async function save(form) {
    try {
      if (editing) await clientesService.update(editing.id, form);
      else await clientesService.create(form);
      setModal(false);
      setSuccess(editing ? 'Cliente actualizado.' : 'Cliente registrado.');
      reload();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  async function showHistory(client) {
    setHistoryLoading(true);
    setHistory(null);
    setError('');
    try {
      setHistory(await clientesService.get(client.id));
    } catch (historyError) {
      setError(historyError.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  const columns = [
    { key: 'nombre', label: 'Cliente', render: (client) => <span><b>{client.nombre}</b>{client.es_demo ? <small><span className="badge warning">DEMO · solo lectura</span></small> : null}</span> },
    { key: 'correo', label: 'Correo', render: (client) => client.correo || '—' },
    { key: 'telefono', label: 'Teléfono', render: (client) => client.telefono || '—' },
    { key: 'ventas_reales', label: 'Ventas reales', render: (client) => client.ventas_reales || 0 },
    { key: 'ventas_demo', label: 'Ventas demo', render: (client) => client.ventas_demo || 0 },
    { key: 'total_real', label: 'Total real', render: (client) => formatCurrency(client.total_real) },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (client) => (
        <>
        {client.es_demo
          ? <span className="muted">Solo lectura · </span>
          : <button className="link-button" onClick={() => open(client)}>Editar</button>}
          <button className="link-button" onClick={() => showHistory(client)}>Historial</button>
        </>
      ),
    },
  ];

  const historyColumns = [
    { key: 'fecha_venta', label: 'Fecha', render: (sale) => formatDate(sale.fecha_venta) },
    { key: 'canal', label: 'Canal', render: (sale) => sale.canal },
    { key: 'productos', label: 'Productos', render: (sale) => sale.productos.map((item) => `${item.nombre} × ${item.cantidad}`).join(', ') || '—' },
    { key: 'total', label: 'Total', render: (sale) => formatCurrency(sale.total) },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="muted">Relación con clientes</p><h2>Clientes</h2><p className="muted">Guarda datos de contacto y consulta las ventas reales asociadas.</p></div>
        <Button onClick={() => open(null)}>+ Nuevo cliente</Button>
      </div>
      <ErrorMessage error={error} success={success} />
      <section className="panel">
        {loading ? <Loading>Cargando clientes...</Loading> : <DataTable columns={columns} rows={clients} emptyMessage="No hay clientes todavía. Registra uno para asociarlo a tus ventas." />}
      </section>
      {modal && (
        <Modal title={editing ? 'Editar cliente' : 'Registrar cliente'} onClose={() => setModal(false)}>
          <ClienteForm initialValues={editing || undefined} onSubmit={save} onCancel={() => setModal(false)} />
        </Modal>
      )}
      {(history || historyLoading) && (
        <Modal title={`Historial de ${history?.nombre || 'cliente'}`} onClose={() => setHistory(null)}>
          {historyLoading ? <Loading>Cargando historial...</Loading> : (
            <>
              <div className="customer-contact">
                <span>{history.correo || 'Sin correo'}</span>
                <span>{history.telefono || 'Sin teléfono'}</span>
                {history.direccion && <span>{history.direccion}</span>}
                {history.es_demo && <span className="badge warning">CLIENTE DE DEMOSTRACIÓN · solo lectura</span>}
              </div>
              <DataTable columns={historyColumns} rows={history.ventas} emptyMessage="Este cliente aún no tiene ventas reales asociadas." />
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
