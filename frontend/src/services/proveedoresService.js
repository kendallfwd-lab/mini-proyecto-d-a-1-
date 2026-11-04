import { request } from './api';

export const proveedoresService = {
  list: (search = '') => request(`/proveedores${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: (data) => request('/proveedores', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/proveedores/${id}`, { method: 'DELETE' }),
};
