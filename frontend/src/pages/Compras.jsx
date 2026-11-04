import { useCallback, useState } from 'react';
import CompraForm from '../components/forms/CompraForm';
import RecepcionForm from '../components/forms/RecepcionForm';
import Button from '../components/ui/Button';
import DataTable from '../components/tables/DataTable';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import useResource from '../hooks/useResource';
import { comprasService } from '../services/comprasService';
import { productosService } from '../services/productosService';
import { proveedoresService } from '../services/proveedoresService';
import formatCurrency from '../utils/formatCurrency';

const stateLabels = { pendiente: 'Pendiente', recibida: 'Recibida', cancelada: 'Cancelada' };

function formatDate(value) {
  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split('-').map(Number);
  return year && month && day
    ? new Date(year, month - 1, day).toLocaleDateString('es-CR')
    : date;
}

export default function Compras() {
  const [purchaseForm, setPurchaseForm] = useState(false);
  const [receiving, setReceiving] = useState(null);
  const [success, setSuccess] = useState('');
  const load = useCallback(
    () => Promise.all([comprasService.list(), proveedoresService.list(), productosService.list()]),
    [],
  );
  const { data, loading, error, setError, reload } = useResource(load, [load]);
  const [purchases = [], suppliers = [], products = []] = data || [];

  async function create(form) {
    try {
      await comprasService.create(form);
      setPurchaseForm(false);
      setSuccess('Pedido creado. El inventario cambiará al registrar su recepción.');
      reload();
    } catch (createError) {
      setError(createError.message);
    }
  }

  async function receive(form) {
    try {
      const updated = await comprasService.receive(receiving.id, form);
      setReceiving(null);
      setSuccess(updated.estado === 'recibida'
        ? 'Pedido recibido; el inventario y los costos de producto fueron actualizados.'
        : 'Recepción parcial registrada; el pedido sigue pendiente.');
      reload();
    } catch (receiveError) {
      setError(receiveError.message);
    }
  }

  const columns = [
    { key: 'id', label: 'Pedido', render: (purchase) => `#${purchase.id}` },
    { key: 'fecha_pedido', label: 'Fecha', render: (purchase) => formatDate(purchase.fecha_pedido) },
    { key: 'proveedor_nombre', label: 'Proveedor' },
    { key: 'productos', label: 'Productos', render: (purchase) => purchase.productos.map((item) => `${item.nombre} · ${item.cantidad_recibida}/${item.cantidad}`).join(', ') },
    { key: 'total', label: 'Total', render: (purchase) => formatCurrency(purchase.total) },
    { key: 'estado', label: 'Estado', render: (purchase) => <span><span className={`badge ${purchase.estado === 'recibida' ? 'real-badge' : purchase.estado === 'pendiente' ? 'warning' : ''}`}>{stateLabels[purchase.estado]}</span>{purchase.es_demo && <small><span className="badge warning">DEMO · solo lectura</span></small>}</span> },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (purchase) => purchase.estado === 'pendiente' && !purchase.es_demo
        ? <Button variant="secondary" onClick={() => setReceiving(purchase)}>Registrar entrada</Button>
        : <span className="muted">—</span>,
    },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="muted">Abastecimiento e inventario</p><h2>Compras y reposición</h2><p className="muted">Crea pedidos de compra y registra recepciones completas o parciales.</p></div>
        <Button onClick={() => { setError(''); setPurchaseForm(true); }}>+ Nuevo pedido</Button>
      </div>
      <ErrorMessage error={error} success={success} />
      <section className="panel">
        {loading ? <Loading>Cargando pedidos...</Loading> : <DataTable columns={columns} rows={purchases} emptyMessage="No hay pedidos. Crea uno para registrar una reposición." />}
      </section>
      {purchaseForm && (
        <Modal title="Crear pedido a proveedor" onClose={() => setPurchaseForm(false)}>
          <CompraForm suppliers={suppliers} products={products} onSubmit={create} onCancel={() => setPurchaseForm(false)} />
        </Modal>
      )}
      {receiving && (
        <Modal title={`Entrada de inventario · Pedido #${receiving.id}`} onClose={() => setReceiving(null)}>
          <RecepcionForm purchase={receiving} onSubmit={receive} onCancel={() => setReceiving(null)} />
        </Modal>
      )}
    </div>
  );
}
