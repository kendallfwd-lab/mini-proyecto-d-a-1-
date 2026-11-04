import { NavLink, useLocation } from 'react-router-dom';

const links = [{ to: '/', label: 'Resumen', icon: '▦' }, { to: '/productos', label: 'Productos', icon: '▤' }, { to: '/categorias', label: 'Categorías', icon: '◇' }, { to: '/proveedores', label: 'Proveedores', icon: '♙' }];

export default function Layout({ children }) {
  const location = useLocation();
  const title = links.find((link) => link.to === location.pathname)?.label || 'Resumen';
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><img className="brand-logo" src="/logo-dropzone.png" alt="Drop_Zone CR"/><span><b>Drop_Zone</b><small>Inventario CR</small></span></div><nav>{links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>{link.icon}</span>{link.label}</NavLink>)}</nav><div className="sidebar-foot"><span className="status-dot"/> Drop_Zone CR<br/><small>El Roble · Puntarenas</small></div></aside><main className="main-content"><header className="topbar"><div><p className="eyebrow">DROP_ZONE CR · INVENTARIO</p><h1>{title}</h1></div><div className="user-chip"><span className="avatar">DZ</span><span><b>Administrador</b><small>Control de tienda</small></span></div></header>{children}</main></div>;
}
