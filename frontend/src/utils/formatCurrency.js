const currencyFormatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

export default function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}
