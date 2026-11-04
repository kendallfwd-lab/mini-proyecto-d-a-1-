import CategoriaForm from '../components/forms/CategoriaForm';
import CrudPage from './CrudPage';
import { categoriasService } from '../services/categoriasService';

export default function Categorias() {
  return <CrudPage title="Categorías" entity="categoría" subtitle="Organiza tu catálogo por líneas de negocio." fields={[['nombre', 'Nombre'], ['descripcion', 'Descripción']]} resource={categoriasService} Form={CategoriaForm} />;
}
