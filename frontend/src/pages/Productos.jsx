import { useCallback, useState } from 'react';
import ProductoForm from '../components/forms/ProductoForm';
import DataTable from '../components/tables/DataTable';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import useDebounce from '../hooks/useDebounce';
import useResource from '../hooks/useResource';
import { categoriasService } from '../services/categoriasService';
import { productosService } from '../services/productosService';
import { proveedoresService } from '../services/proveedoresService';
import formatCurrency from '../utils/formatCurrency';
import stockStatus from '../utils/stockStatus';

const dropZoneImages = [
  'airpods-pro-3.webp', 'airpods-pro-2.webp', 'airpods-3.webp', 'airpods-4.webp',
  'airpods-max-azul-medianoche.webp', 'apple-pencil.webp', 'estuche-azul-oscuro.webp',
  'estuche-iphone-azul-oscuro.webp', 'galaxy-buds3-pro.webp', 'samsung-cargador-45w.webp',
  'samsung-adaptador-45w-sin-cable.webp', 'cable-usb-c-60w-1m.webp',
  'apple-adaptador-usb-c-35w.webp', 'earpods-usb-c-premium.webp',
  'kit-cargador-apple-35w-cable.webp', 'adaptador-audio-usb-c.webp',
  'bateria-magnetica-5000mah.webp', 'cable-samsung-usbc-negro.webp',
  'cable-apple-usbc-lightning-1m.webp', 'cable-apple-lightning-usb-1m.png',
];

function imageFor(product) {
  if (product.imagen_url) return product.imagen_url;
  if (product.codigo?.startsWith('DZ-')) {
    return `/products/${dropZoneImages[Number(product.codigo.slice(3)) - 1] || ''}`;
  }
  return '';
}

export default function Productos() {
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput);
  const [filters, setFilters] = useState({ categoria_id: '', disponibilidad: '' });
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState('');
  const query = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filters.categoria_id) params.set('categoria_id', filters.categoria_id);
    if (filters.disponibilidad) params.set('disponibilidad', filters.disponibilidad);
    return params.size ? `?${params}` : '';
  }, [search, filters.categoria_id, filters.disponibilidad]);
  const load = useCallback(
    () => Promise.all([
      productosService.list(query()),
      categoriasService.list(),
      proveedoresService.list(),
    ]),
    [query],
  );
  const { data, loading, error, setError, reload } = useResource(load, [load]);
  const [items = [], categories = [], suppliers = []] = data || [];

  function open(product) {
    setEditing(product || null);
    setModal(true);
    setError('');
  }

  async function save(form) {
    try {
      if (editing) await productosService.update(editing.id, form);
      else await productosService.create(form);
      setModal(false);
      setSuccess(editing ? 'Producto actualizado.' : 'Producto creado.');
      reload();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  async function remove() {
    try {
      await productosService.remove(deleting.id);
      setDeleting(null);
      setSuccess('Producto eliminado.');
      reload();
    } catch (removeError) {
      setDeleting(null);
      setError(removeError.message);
    }
  }

  const columns = [
    {
      key: 'product',
      label: 'Producto',
      render: (product) => {
        const image = imageFor(product);
        return (
          <div className="product-cell">
            {image ? <img className="product-thumb" src={image} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /> : <span className="product-placeholder" aria-hidden="true">{product.nombre.charAt(0)}</span>}
            <span><b>{product.nombre}</b><small>{product.proveedor_nombre}</small></span>
          </div>
        );
      },
    },
    { key: 'codigo', label: 'Código' },
    { key: 'categoria_nombre', label: 'Categoría' },
    { key: 'precio', label: 'Precio', render: (product) => formatCurrency(product.precio) },
    { key: 'stock', label: 'Stock', render: (product) => <span className={`stock ${stockStatus(product.stock)}`}>{product.stock}</span> },
    {
      key: 'actions',
      label: 'Acciones',
      render: (product) => (
        <>
          <button className="link-button" onClick={() => open(product)}>Editar</button>
          <button className="link-button danger-text" onClick={() => setDeleting(product)}>Eliminar</button>
        </>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="muted">Catálogo y existencias</p><h2>Productos</h2></div>
        <Button onClick={() => open(null)}>+ Nuevo producto</Button>
      </div>
      <ErrorMessage error={error} success={success} />
      <section className="panel">
        <div className="filters">
          <input aria-label="Buscar productos" placeholder="Buscar por nombre o código…" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          <select aria-label="Filtrar por categoría" value={filters.categoria_id} onChange={(event) => setFilters({ ...filters, categoria_id: event.target.value })}>
            <option value="">Todas las categorías</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}
          </select>
          <select aria-label="Filtrar por disponibilidad" value={filters.disponibilidad} onChange={(event) => setFilters({ ...filters, disponibilidad: event.target.value })}>
            <option value="">Cualquier stock</option><option value="disponible">Disponible</option><option value="bajo">Stock bajo</option><option value="agotado">Agotado</option>
          </select>
        </div>
        {loading ? <Loading /> : <DataTable columns={columns} rows={items} emptyMessage="No se encontraron productos." />}
      </section>
      {modal && (
        <Modal title={editing ? 'Editar producto' : 'Nuevo producto'} onClose={() => setModal(false)}>
          <ProductoForm initialValues={editing || undefined} categories={categories} suppliers={suppliers} onSubmit={save} onCancel={() => setModal(false)} />
        </Modal>
      )}
      {deleting && <ConfirmDialog onCancel={() => setDeleting(null)} onConfirm={remove}>¿Deseas eliminar “{deleting.nombre}”? Esta acción no se puede deshacer.</ConfirmDialog>}
    </div>
  );
}
