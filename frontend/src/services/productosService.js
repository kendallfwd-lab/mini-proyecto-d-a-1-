import { request } from './api';

export const productosService = {
  list: (query = '') => request(`/productos${query}`),
  get: (id) => request(`/productos/${id}`),
  create: (data) => request('/productos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/productos/${id}`, { method: 'DELETE' }),
};
