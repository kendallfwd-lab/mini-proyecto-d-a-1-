import { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import { Feedback } from '../components/Feedback';

const money = (value) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(value || 0);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const load = () => Promise.all([api.dashboard(), api.analytics()]).then(([dashboard, report]) => { setData(dashboard); setAnalytics(report); }).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  if (error) return <><Feedback error={error} /><button className="button primary" onClick={load}>Reintentar</button></>;
  if (!data || !analytics) return <div className="loading">Cargando resumen...</div>;
  const top = analytics.productos_mas_vendidos || [];
  return <div className="page">
    <div className="page-heading"><div><p className="muted">Vista general de tu operación</p><h2>Resumen del inventario</h2></div><button className="button secondary" onClick={load}>↻ Actualizar</button></div>
    <div className="stats-grid"><StatCard label="Productos" value={data.totales.productos} detail="registrados"/><StatCard label="Unidades" value={data.totales.unidades} detail="en inventario" tone="green"/><StatCard label="Valor inventario" value={money(data.totales.valor_inventario)} detail="valor estimado" tone="orange"/><StatCard label="Stock agotado" value={data.totales.agotados} detail="requieren atención" tone="red"/></div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-heading"><div><h3>Productos por categoría</h3><p className="muted">Distribución actual</p></div></div>{data.por_categoria.map((item) => <div className="bar-row" key={item.categoria}><span>{item.categoria}</span><div className="bar"><i style={{ width: `${Math.min(100, (item.productos / Math.max(...data.por_categoria.map((x) => x.productos), 1)) * 100)}%` }}/></div><b>{item.productos}</b></div>)}</section>
      <section className="panel"><div className="panel-heading"><div><h3>Alertas de inventario</h3><p className="muted">Productos que debes revisar</p></div><span className="badge warning">{data.alertas.length}</span></div>{data.alertas.length ? data.alertas.slice(0, 6).map((item) => <div className="alert-row" key={item.id}><span className={item.stock === 0 ? 'alert-icon danger' : 'alert-icon'}>!</span><div><b>{item.nombre}</b><small>{item.stock === 0 ? 'Agotado' : `Solo quedan ${item.stock} unidades`}</small></div></div>) : <div className="empty">No hay alertas pendientes.</div>}</section>
    </div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-heading"><div><h3>Analíticas de ventas</h3><p className="muted">Historial de prueba para controlar el negocio</p></div></div><div className="analytics-list"><p><b>Ventas pagadas:</b> {money(analytics.resumen.ventas_pagadas)}</p><p><b>Pedidos pagados:</b> {analytics.resumen.pedidos_pagados || 0}</p><p><b>Unidades vendidas:</b> {analytics.resumen.unidades_vendidas || 0}</p><p><b>Pendiente de cobro:</b> {money(analytics.resumen.ventas_pendientes)}</p></div></section>
      <section className="panel"><div className="panel-heading"><div><h3>Productos más vendidos</h3><p className="muted">Por unidades despachadas</p></div></div>{top.map((item) => <div className="alert-row" key={item.codigo}><div><b>{item.nombre}</b><small>{item.codigo} · {item.unidades_vendidas} unidades · {money(item.ingresos)}</small></div></div>)}</section>
    </div>
    <section className="panel"><div className="panel-heading"><div><h3>Productos agregados recientemente</h3><p className="muted">Últimos movimientos del catálogo</p></div></div><div className="table-wrap"><table><thead><tr><th>Producto</th><th>Código</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr></thead><tbody>{data.recientes.map((item) => <tr key={item.id}><td><b>{item.nombre}</b></td><td>{item.codigo}</td><td>{item.categoria}</td><td>{money(item.precio)}</td><td><span className={`stock ${item.stock === 0 ? 'out' : item.stock <= 5 ? 'low' : ''}`}>{item.stock}</span></td></tr>)}</tbody></table></div></section>
  </div>;
}
