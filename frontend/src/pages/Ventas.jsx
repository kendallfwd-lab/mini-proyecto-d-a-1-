import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import VentaForm from '../components/forms/VentaForm';
import Button from '../components/ui/Button';
import DataTable from '../components/tables/DataTable';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import useResource from '../hooks/useResource';
import { productosService } from '../services/productosService';
import { clientesService } from '../services/clientesService';
import { ventasService } from '../services/ventasService';
import formatCurrency from '../utils/formatCurrency';

function formatDate(value) {
  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split('-').map(Number);
  return year && month && day
    ? new Date(year, month - 1, day).toLocaleDateString('es-CR')
    : date;
}

export default function Ventas() {
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState('');
  const load = useCallback(
    () => Promise.all([ventasService.list(), productosService.list(), clientesService.list()]),
    [],
  );
  const { data, loading, error, setError, reload } = useResource(load, [load]);
  const [sales = [], products = [], clients = []] = data || [];
  const realSales = sales.filter((sale) => !sale.es_demo);
  const sampleSales = sales.filter((sale) => sale.es_demo);

  async function save(form) {
    try {
      const result = await ventasService.create(form);
      setModal(false);
      setSuccess(`Venta registrada y stock actualizado. Factura ${result.numero_factura} lista para enviar.`);
      reload();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  const columns = [
    { key: 'fecha_venta', label: 'Fecha', render: (sale) => formatDate(sale.fecha_venta) },
    { key: 'cliente', label: 'Cliente', render: (sale) => <span><b>{sale.cliente}</b>{sale.es_demo && <small><span className="badge warning">DEMO · solo lectura</span></small>}<small>{sale.telefono_cliente || sale.telefono || 'Teléfono no disponible'}</small></span> },
    { key: 'canal', label: 'Canal', render: (sale) => sale.canal.charAt(0).toUpperCase() + sale.canal.slice(1) },
    { key: 'productos', label: 'Productos', render: (sale) => sale.productos.map((product) => `${product.nombre} × ${product.cantidad}`).join(', ') },
    { key: 'total', label: 'Total', render: (sale) => formatCurrency(sale.total) },
    { key: 'estado', label: 'Estado', render: (sale) => <span className={`badge ${sale.estado === 'pagada' ? 'real-badge' : 'warning'}`}>{sale.estado === 'pagada' ? 'Pagada' : 'Pendiente'}</span> },
    { key: 'factura', label: 'Factura', render: (sale) => sale.numero_factura ? <Link className="link-button" to="/facturas">{sale.numero_factura}</Link> : <span className="muted">—</span> },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="muted">Ingresos del negocio</p><h2>Ventas</h2><p className="muted">Consulta los ejemplos del catálogo y registra ventas reales con su factura.</p></div>
        <Button onClick={() => { setError(''); setModal(true); }}>+ Registrar venta</Button>
      </div>
      <ErrorMessage error={error} success={success} />
      {!loading && !clients.length && <div className="feedback error">Registra un cliente antes de crear ventas para que queden en su historial. <a href="/clientes">Ir a Clientes</a></div>}
      <div className="stats-grid sales-summary">
        <article className="stat-card green"><div className="stat-icon">₡</div><div><p>Ventas reales</p><strong>{realSales.length}</strong><small>{formatCurrency(realSales.reduce((sum, sale) => sum + Number(sale.total), 0))}</small></div></article>
        <article className="stat-card orange"><div className="stat-icon">▤</div><div><p>Ejemplos de venta</p><strong>{sampleSales.length}</strong><small>registros DEMO, no contables</small></div></article>
        <article className="stat-card"><div className="stat-icon">▧</div><div><p>Facturas</p><strong>{sales.filter((sale) => sale.numero_factura).length}</strong><small>consulta e impresión</small></div></article>
        <article className="stat-card"><div className="stat-icon">↗</div><div><p>WhatsApp</p><strong>Listo</strong><small>envío manual con confirmación</small></div></article>
      </div>
      <section className="panel">
        <div className="panel-heading"><div><h3>Historial de ventas</h3><p className="muted">Los ejemplos están identificados y nunca cuentan como operaciones reales.</p></div><Link className="button secondary" to="/facturas">Ver facturas</Link></div>
        {loading ? <Loading>Cargando ventas...</Loading> : <DataTable columns={columns} rows={sales} emptyMessage="Todavía no hay ventas ni ejemplos cargados." />}
      </section>
      {modal && (
        <Modal title="Registrar venta pagada" onClose={() => setModal(false)}>
          <VentaForm products={products} clients={clients.filter((client) => !client.es_demo)} onSubmit={save} onCancel={() => setModal(false)} />
        </Modal>
      )}
    </div>
  );
}
