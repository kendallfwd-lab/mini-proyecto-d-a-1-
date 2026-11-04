export default function StockAlert({ product }) {
  const depleted = Number(product.stock) === 0;
  return (
    <div className="alert-row">
      <span className={depleted ? 'alert-icon danger' : 'alert-icon'}>!</span>
      <div>
        <b>{product.nombre}</b>
        <small>{depleted ? 'Agotado' : `Solo quedan ${product.stock} unidades`}</small>
      </div>
    </div>
  );
}
