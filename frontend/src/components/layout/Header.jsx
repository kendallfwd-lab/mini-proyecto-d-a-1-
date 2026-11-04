import { useLocation } from 'react-router-dom';

const titles = {
  '/': 'Resumen',
  '/productos': 'Productos',
  '/categorias': 'Categorías',
  '/proveedores': 'Proveedores',
};

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <div><p className="eyebrow">DROP_ZONE CR · INVENTARIO</p><h1>{titles[pathname] || 'Página no encontrada'}</h1></div>
      <div className="user-chip"><span className="avatar">DZ</span><span><b>Administrador</b><small>Control de tienda</small></span></div>
    </header>
  );
}
