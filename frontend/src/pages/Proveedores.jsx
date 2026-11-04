import CrudPage from './CrudPage';
export default function Proveedores() { return <CrudPage type="proveedores" title="Proveedores" subtitle="Gestiona los contactos de abastecimiento." fields={[['nombre','Nombre'],['correo','Correo'],['telefono','Teléfono'],['direccion','Dirección']]}/>; }
