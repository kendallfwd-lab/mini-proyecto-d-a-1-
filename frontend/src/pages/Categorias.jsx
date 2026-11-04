import CrudPage from './CrudPage';
export default function Categorias() { return <CrudPage type="categorias" title="Categorías" subtitle="Organiza tu catálogo por líneas de negocio." fields={[['nombre','Nombre'],['descripcion','Descripción']]}/>; }
