import { request } from './api';

export const clientesService = {
  list: () => request('/clientes'),
  get: (id) => request(`/clientes/${id}`),
  create: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
