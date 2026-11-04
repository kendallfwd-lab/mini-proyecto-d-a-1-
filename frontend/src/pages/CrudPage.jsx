import { useCallback, useState } from 'react';
import DataTable from '../components/tables/DataTable';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import useResource from '../hooks/useResource';

export default function CrudPage({ title, entity, subtitle, fields, resource, Form }) {
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [success, setSuccess] = useState('');
  const load = useCallback(() => resource.list(), [resource]);
  const { data: items, loading, error, setError, reload } = useResource(load, [load]);

  function open(item) {
    setEditing(item || null);
    setModal(true);
    setError('');
  }

  async function save(form) {
    try {
      if (editing) await resource.update(editing.id, form);
      else await resource.create(form);
      setModal(false);
      setSuccess(editing ? 'Registro actualizado.' : 'Registro creado.');
      reload();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  async function remove() {
    try {
      await resource.remove(deleting.id);
      setDeleting(null);
      setSuccess('Registro eliminado.');
      reload();
    } catch (removeError) {
      setDeleting(null);
      setError(removeError.message);
    }
  }

  const columns = [
    ...fields.map(([key, label]) => ({ key, label, render: (item) => <b>{item[key] || '—'}</b> })),
    { key: 'fecha_creacion', label: 'Creado', render: (item) => item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString('es-CR') : '—' },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item) => (
        <>
          <button className="link-button" onClick={() => open(item)}>Editar</button>
          <button className="link-button danger-text" onClick={() => setDeleting(item)}>Eliminar</button>
        </>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div><p className="muted">Catálogo auxiliar</p><h2>{title}</h2><p className="muted">{subtitle}</p></div>
        <Button onClick={() => open(null)}>+ {entity === 'categoría' ? 'Nueva' : 'Nuevo'} {entity}</Button>
      </div>
      <ErrorMessage error={error} success={success} />
      <section className="panel">
        {loading ? <Loading /> : <DataTable columns={columns} rows={items || []} emptyMessage="No hay registros todavía." />}
      </section>
      {modal && (
        <Modal title={`${editing ? 'Editar' : entity === 'categoría' ? 'Nueva' : 'Nuevo'} ${entity}`} onClose={() => setModal(false)}>
          <Form initialValues={editing || undefined} onSubmit={save} onCancel={() => setModal(false)} />
        </Modal>
      )}
      {deleting && <ConfirmDialog onCancel={() => setDeleting(null)} onConfirm={remove}>¿Deseas eliminar “{deleting.nombre}”? Esta acción no se puede deshacer.</ConfirmDialog>}
    </div>
  );
}
