import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo-dropzone.png';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Resumen', icon: '▪' }, { to: '/productos', label: 'Productos', icon: '◇' },
  { to: '/categorias', label: 'Categorías', icon: '◈' }, { to: '/proveedores', label: 'Proveedores', icon: '♧' },
  { to: '/compras', label: 'Compras y reposición', icon: '↓' }, { to: '/clientes', label: 'Clientes', icon: '♧' },
  { to: '/ventas', label: 'Ventas', icon: '↗' }, { to: '/facturas', label: 'Facturas', icon: '▣' },
  { to: '/gastos', label: 'Gastos y ganancias', icon: '₡' },
];

export default function Sidebar() {
  const { user } = useAuth();
  return <aside className="sidebar"><div className="brand"><img className="brand-logo" src={logo} alt="Drop_Zone CR"/><span><b>Drop_Zone</b><small>Inventario CR</small></span></div><nav aria-label="Navegación principal">{links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/dashboard'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span aria-hidden="true">{link.icon}</span>{link.label}</NavLink>)}{user?.es_principal ? <NavLink to="/administradores" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span aria-hidden="true">♙</span>Administradores</NavLink> : null}</nav><div className="sidebar-foot"><span className="status-dot"/> Drop_Zone CR<br/><small>El Roble · Puntarenas</small></div></aside>;
}
