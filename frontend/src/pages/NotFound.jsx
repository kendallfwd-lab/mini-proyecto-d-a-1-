import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page empty-page">
      <h2>Página no encontrada</h2>
      <p className="muted">La dirección que buscas no existe.</p>
      <Link className="button primary" to="/">Volver al resumen</Link>
    </section>
  );
}
