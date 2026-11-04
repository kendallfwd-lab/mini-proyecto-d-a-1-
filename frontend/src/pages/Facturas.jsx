import { useCallback, useState } from 'react';
import Button from '../components/ui/Button';
import DataTable from '../components/tables/DataTable';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import useResource from '../hooks/useResource';
import { facturasService } from '../services/facturasService';
import formatCurrency from '../utils/formatCurrency';

function formatDate(value) {
  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split('-').map(Number);
  return year && month && day
    ? new Date(year, month - 1, day).toLocaleDateString('es-CR')
    : date;
}

function whatsappLink(invoice) {
  const digits = String(invoice.telefono_cliente || '').replace(/\D/g, '');
  const number = digits.length === 8 ? `506${digits}` : digits.startsWith('00') ? digits.slice(2) : digits;
  if (number.length < 10 || number.length > 15) return null;

  const lines = invoice.productos
    .map((product) => `• ${product.nombre} x${product.cantidad}: ${formatCurrency(product.subtotal)}`)
    .join('\n');
  const message = [
    `Hola ${invoice.cliente}, gracias por tu compra en Drop_Zone CR.`,
    `Factura: ${invoice.numero_factura}`,
    `Fecha: ${formatDate(invoice.fecha_emision)}`,
    '',
    lines,
    '',
    `Total: ${formatCurrency(invoice.total)}`,
    '¡Gracias por preferirnos!',
  ].join('\n');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function InvoicePreview({ invoice, onClose }) {
  return (
    <Modal title={`Factura ${invoice.numero_factura}`} onClose={onClose}>
      <div className="invoice-actions">
        <Button type="button" variant="secondary" onClick={() => window.print()}>Imprimir / Guardar PDF</Button>
        {!invoice.es_demo && whatsappLink(invoice) && (
          <a className="button whatsapp-button" href={whatsappLink(invoice)} target="_blank" rel="noreferrer">
            Enviar por WhatsApp
          </a>
        )}
      </div>
      {invoice.es_demo && <p className="feedback warning-message">Factura de demostración. Es solo un ejemplo y no se puede enviar a WhatsApp.</p>}
      {!invoice.es_demo && !whatsappLink(invoice) && <p className="feedback error">No hay un número internacional válido guardado en esta factura.</p>}
      <article className="invoice-paper printable-invoice">
        <header className="invoice-brand">
          <div className="invoice-logo">DZ</div>
          <div><b>Drop_Zone CR</b><small>El Roble · Puntarenas, Costa Rica</small><small>Comprobante comercial de venta</small></div>
          {invoice.es_demo && <span className="badge warning">DEMO</span>}
        </header>
        <div className="invoice-number">
          <div><span>Número de factura</span><strong>{invoice.numero_factura}</strong></div>
          <div><span>Fecha de emisión</span><strong>{formatDate(invoice.fecha_emision)}</strong></div>
        </div>
        <div className="invoice-customer">
          <span>FACTURAR A</span>
          <strong>{invoice.cliente}</strong>
          <small>{invoice.telefono_cliente || 'Teléfono no registrado'}</small>
          <small>Canal de venta: {invoice.canal}</small>
        </div>
        <div className="table-wrap">
          <table className="invoice-table">
            <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Importe</th></tr></thead>
            <tbody>
              {invoice.productos.map((product) => (
                <tr key={product.producto_id}>
                  <td><b>{product.nombre}</b><small>{product.codigo}</small></td>
                  <td>{product.cantidad}</td>
                  <td>{formatCurrency(product.precio_unitario)}</td>
                  <td>{formatCurrency(product.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="invoice-total"><span>Total pagado</span><strong>{formatCurrency(invoice.total)}</strong></div>
        <footer className="invoice-thanks">
          <b>¡Gracias por tu compra!</b>
          <span>Conserva esta factura para cualquier consulta sobre tu pedido.</span>
          <small>Este comprobante comercial no sustituye una factura electrónica tributaria.</small>
        </footer>
      </article>
    </Modal>
  );
}

export default function Facturas() {
  const [selected, setSelected] = useState(null);
  const load = useCallback(() => facturasService.list(), []);
  const { data, loading, error } = useResource(load, [load]);
  const invoices = data || [];
  const realInvoices = invoices.filter((invoice) => !invoice.es_demo);
  const demoInvoices = invoices.filter((invoice) => invoice.es_demo);

  const columns = [
    { key: 'numero_factura', label: 'Factura', render: (invoice) => <b>{invoice.numero_factura}</b> },
    { key: 'fecha_emision', label: 'Fecha', render: (invoice) => formatDate(invoice.fecha_emision) },
    { key: 'cliente', label: 'Cliente', render: (invoice) => <span><b>{invoice.cliente}</b>{invoice.es_demo && <small><span className="badge warning">DEMO</span></small>}<small>{invoice.telefono_cliente || 'Teléfono pendiente'}</small></span> },
    { key: 'productos', label: 'Artículos', render: (invoice) => invoice.productos.map((product) => `${product.nombre} × ${product.cantidad}`).join(', ') },
    { key: 'total', label: 'Total', render: (invoice) => <b>{formatCurrency(invoice.total)}</b> },
    {
      key: 'estado',
      label: 'WhatsApp',
      render: (invoice) => invoice.es_demo
        ? <span className="muted">Solo ejemplo</span>
        : whatsappLink(invoice)
          ? <span className="badge real-badge">Teléfono listo</span>
          : <span className="badge warning">Falta teléfono</span>,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (invoice) => (
        <>
          <button className="link-button" onClick={() => setSelected(invoice)}>Ver factura</button>
          {!invoice.es_demo && whatsappLink(invoice) && (
            <a className="link-button whatsapp-link" href={whatsappLink(invoice)} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="muted">Comprobantes de venta</p><h2>Facturas</h2><p className="muted">Cada venta pagada crea su factura, lista para imprimir o compartir por WhatsApp.</p></div>
      </div>
      <ErrorMessage error={error} />
      <div className="stats-grid invoice-summary">
        <article className="stat-card green"><div className="stat-icon">▧</div><div><p>Facturas reales</p><strong>{realInvoices.length}</strong><small>ventas pagadas</small></div></article>
        <article className="stat-card"><div className="stat-icon">₡</div><div><p>Total facturado real</p><strong>{formatCurrency(realInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0))}</strong><small>sin ejemplos demo</small></div></article>
        <article className="stat-card orange"><div className="stat-icon">▤</div><div><p>Facturas de ejemplo</p><strong>{demoInvoices.length}</strong><small>solo demostración</small></div></article>
        <article className="stat-card"><div className="stat-icon">↗</div><div><p>Envío por WhatsApp</p><strong>Con tu permiso</strong><small>abre el chat con el mensaje preparado</small></div></article>
      </div>
      <section className="panel invoice-list-panel">
        <div className="panel-heading"><div><h3>Historial de facturas</h3><p className="muted">Al abrir WhatsApp, revisa y pulsa Enviar dentro de la aplicación.</p></div></div>
        {loading ? <Loading>Cargando facturas...</Loading> : <DataTable columns={columns} rows={invoices} emptyMessage="Registra una venta pagada y aquí aparecerá su factura." />}
      </section>
      {selected && <InvoicePreview invoice={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
