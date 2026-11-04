import { request } from './api';

export const comprasService = {
  list: () => request('/compras'),
  create: (data) => request('/compras', { method: 'POST', body: JSON.stringify(data) }),
  receive: (id, data) => request(`/compras/${id}/recibir`, { method: 'POST', body: JSON.stringify(data) }),
};
