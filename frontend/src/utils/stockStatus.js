export default function stockStatus(stock, limit = 5) {
  if (Number(stock) === 0) return 'out';
  if (Number(stock) <= limit) return 'low';
  return 'available';
}
