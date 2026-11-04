import { Route, Routes } from 'react-router-dom';
import Categorias from '../pages/Categorias';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Productos from '../pages/Productos';
import Proveedores from '../pages/Proveedores';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/proveedores" element={<Proveedores />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
