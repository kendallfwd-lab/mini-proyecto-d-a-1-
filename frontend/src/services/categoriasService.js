import { request } from './api';

export const categoriasService = {
  list: (search = '') => request(`/categorias${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: (data) => request('/categorias', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/categorias/${id}`, { method: 'DELETE' }),
};
