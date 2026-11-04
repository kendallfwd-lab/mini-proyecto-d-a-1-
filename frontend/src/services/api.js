const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) throw new Error(body.message || body.error || 'No se pudo completar la solicitud');
  return body.data;
}

export const api = {
  dashboard: () => request('/dashboard/resumen'),
  analytics: () => request('/dashboard/analiticas'),
  productos: (query = '') => request(`/productos${query}`),
  producto: (id) => request(`/productos/${id}`),
  crearProducto: (data) => request('/productos', { method: 'POST', body: JSON.stringify(data) }),
  actualizarProducto: (id, data) => request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminarProducto: (id) => request(`/productos/${id}`, { method: 'DELETE' }),
  categorias: () => request('/categorias'),
  crearCategoria: (data) => request('/categorias', { method: 'POST', body: JSON.stringify(data) }),
  actualizarCategoria: (id, data) => request(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminarCategoria: (id) => request(`/categorias/${id}`, { method: 'DELETE' }),
  proveedores: () => request('/proveedores'),
  crearProveedor: (data) => request('/proveedores', { method: 'POST', body: JSON.stringify(data) }),
  actualizarProveedor: (id, data) => request(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminarProveedor: (id) => request(`/proveedores/${id}`, { method: 'DELETE' })
};
