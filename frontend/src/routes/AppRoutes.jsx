import { Route, Routes } from 'react-router-dom';
import Categorias from '../pages/Categorias';
import Dashboard from '../pages/Dashboard';
import Clientes from '../pages/Clientes';
import Compras from '../pages/Compras';
import Gastos from '../pages/Gastos';
import Facturas from '../pages/Facturas';
import NotFound from '../pages/NotFound';
import Productos from '../pages/Productos';
import Proveedores from '../pages/Proveedores';
import Ventas from '../pages/Ventas';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/proveedores" element={<Proveedores />} />
      <Route path="/compras" element={<Compras />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/facturas" element={<Facturas />} />
      <Route path="/gastos" element={<Gastos />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
