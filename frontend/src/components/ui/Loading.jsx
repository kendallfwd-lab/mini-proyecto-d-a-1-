export default function Loading({ children = 'Cargando...' }) {
  return <div className="loading" role="status">{children}</div>;
}
