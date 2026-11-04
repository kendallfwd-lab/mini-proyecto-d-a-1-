import Button from './Button';
import Modal from './Modal';

export default function ConfirmDialog({ title = 'Confirmar eliminación', children, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="muted">{children}</p>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="button" variant="danger" onClick={onConfirm}>Eliminar</Button>
      </div>
    </Modal>
  );
}
