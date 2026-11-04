export default function EmptyState({ children = 'No hay registros todavía.' }) {
  return <div className="empty">{children}</div>;
}
