import { request } from './api';

export const gastosService = {
  list: () => request('/gastos'),
  create: (data) => request('/gastos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/gastos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/gastos/${id}`, { method: 'DELETE' }),
};
