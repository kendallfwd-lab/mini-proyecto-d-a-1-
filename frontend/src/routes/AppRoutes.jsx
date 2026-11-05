import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PublicOnly from '../components/auth/PublicOnly';
import RutaProtegida from '../components/auth/RutaProtegida';
import PrincipalOnly from '../components/auth/PrincipalOnly';
import Login from '../pages/Login';
import Administradores from '../pages/Administradores';
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

function PrivateLayout() { return <AppLayout><Outlet /></AppLayout>; }

export default function AppRoutes() {
  return <Routes>
    <Route element={<PublicOnly />}><Route path="/login" element={<Login />} /></Route>
    <Route element={<RutaProtegida />}><Route element={<PrivateLayout />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Dashboard />} />
      <Route path="/productos" element={<Productos />} /><Route path="/categorias" element={<Categorias />} /><Route path="/proveedores" element={<Proveedores />} />
      <Route path="/compras" element={<Compras />} /><Route path="/clientes" element={<Clientes />} /><Route path="/ventas" element={<Ventas />} />
      <Route path="/facturas" element={<Facturas />} /><Route path="/gastos" element={<Gastos />} />
      <Route element={<PrincipalOnly />}><Route path="/administradores" element={<Administradores />} /></Route>
    </Route></Route>
    <Route path="*" element={<NotFound />} />
  </Routes>;
}
