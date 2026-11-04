import { request } from './api';

export const ventasService = {
  list: () => request('/ventas'),
  create: (data) => request('/ventas', { method: 'POST', body: JSON.stringify(data) }),
};
