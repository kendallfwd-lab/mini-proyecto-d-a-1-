import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const titles = { '/dashboard': 'Resumen', '/productos': 'Productos', '/categorias': 'Categorías', '/proveedores': 'Proveedores', '/compras': 'Compras y reposición', '/clientes': 'Clientes', '/ventas': 'Ventas', '/facturas': 'Facturas', '/gastos': 'Gastos y ganancias' };

export default function Header() {
  const { pathname } = useLocation(); const { user, logout } = useAuth();
  return <header className="topbar"><div><p className="eyebrow">DROP_ZONE CR · INVENTARIO</p><h1>{titles[pathname] || 'Página no encontrada'}</h1></div><div className="user-chip"><span className="avatar">{user?.nombre?.slice(0, 2).toUpperCase() || 'DZ'}</span><span><b>{user?.nombre || 'Usuario'}</b><small>{user?.correo}</small></span><button className="link-button" onClick={logout}>Cerrar sesión</button></div></header>;
}
