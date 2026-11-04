import { useCallback } from 'react';
import StockAlert from '../components/dashboard/StockAlert';
import StatCard from '../components/dashboard/StatCard';
import DataTable from '../components/tables/DataTable';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loading from '../components/ui/Loading';
import useResource from '../hooks/useResource';
import { dashboardService } from '../services/dashboardService';
import formatCurrency from '../utils/formatCurrency';
import stockStatus from '../utils/stockStatus';

export default function Dashboard() {
  const load = useCallback(
    () => Promise.all([dashboardService.summary(), dashboardService.analytics()]),
    [],
  );
  const { data, loading, error, reload } = useResource(load, [load]);

  if (loading) return <Loading>Cargando resumen...</Loading>;
  if (error) return <div className="page"><ErrorMessage error={error} /><Button onClick={reload}>Reintentar</Button></div>;
  if (!data) return null;

  const [summary, analytics] = data;
  const topProducts = analytics.productos_mas_vendidos || [];
  const recentColumns = [
    { key: 'nombre', label: 'Producto', render: (item) => <b>{item.nombre}</b> },
    { key: 'codigo', label: 'Código' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'precio', label: 'Precio', render: (item) => formatCurrency(item.precio) },
    { key: 'stock', label: 'Stock', render: (item) => <span className={`stock ${stockStatus(item.stock)}`}>{item.stock}</span> },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="muted">Vista general de tu operación</p><h2>Resumen del inventario</h2></div>
        <Button variant="secondary" onClick={reload}>↻ Actualizar</Button>
      </div>
      <div className="stats-grid">
        <StatCard label="Productos" value={summary.totales.productos} detail="registrados" />
        <StatCard label="Unidades" value={summary.totales.unidades} detail="en inventario" tone="green" />
        <StatCard label="Valor inventario" value={formatCurrency(summary.totales.valor_inventario)} detail="valor estimado" tone="orange" />
        <StatCard label="Stock agotado" value={summary.totales.agotados} detail="requieren atención" tone="red" />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading"><div><h3>Productos por categoría</h3><p className="muted">Distribución actual</p></div></div>
          {summary.por_categoria.map((item) => (
            <div className="bar-row" key={item.categoria}>
              <span>{item.categoria}</span>
              <div className="bar"><i style={{ width: `${Math.min(100, (item.productos / Math.max(...summary.por_categoria.map((row) => row.productos), 1)) * 100)}%` }} /></div>
              <b>{item.productos}</b>
            </div>
          ))}
          {!summary.por_categoria.length && <div className="empty">No hay categorías registradas.</div>}
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h3>Alertas de inventario</h3><p className="muted">Productos que debes revisar</p></div><span className="badge warning">{summary.alertas.length}</span></div>
          {summary.alertas.length
            ? summary.alertas.slice(0, 6).map((product) => <StockAlert key={product.id} product={product} />)
            : <div className="empty">No hay alertas pendientes.</div>}
        </section>
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading"><div><h3>Analíticas de ventas</h3><p className="muted">Historial para controlar el negocio</p></div></div>
          <div className="analytics-list">
            <p><b>Ventas pagadas:</b> {formatCurrency(analytics.resumen.ventas_pagadas)}</p>
            <p><b>Pedidos pagados:</b> {analytics.resumen.pedidos_pagados || 0}</p>
            <p><b>Unidades vendidas:</b> {analytics.resumen.unidades_vendidas || 0}</p>
            <p><b>Pendiente de cobro:</b> {formatCurrency(analytics.resumen.ventas_pendientes)}</p>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h3>Productos más vendidos</h3><p className="muted">Por unidades despachadas</p></div></div>
          {topProducts.length
            ? topProducts.map((item) => <div className="alert-row" key={item.codigo}><div><b>{item.nombre}</b><small>{item.codigo} · {item.unidades_vendidas} unidades · {formatCurrency(item.ingresos)}</small></div></div>)
            : <div className="empty">No hay ventas registradas.</div>}
        </section>
      </div>
      <section className="panel">
        <div className="panel-heading"><div><h3>Productos agregados recientemente</h3><p className="muted">Últimos movimientos del catálogo</p></div></div>
        <DataTable columns={recentColumns} rows={summary.recientes} emptyMessage="No hay productos registrados." />
      </section>
    </div>
  );
}
