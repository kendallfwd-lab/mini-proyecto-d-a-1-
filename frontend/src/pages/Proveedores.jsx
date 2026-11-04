import ProveedorForm from '../components/forms/ProveedorForm';
import CrudPage from './CrudPage';
import { proveedoresService } from '../services/proveedoresService';

export default function Proveedores() {
  return <CrudPage title="Proveedores" entity="proveedor" subtitle="Gestiona los contactos de abastecimiento." fields={[['nombre', 'Nombre'], ['correo', 'Correo'], ['telefono', 'Teléfono'], ['direccion', 'Dirección']]} resource={proveedoresService} Form={ProveedorForm} />;
}
