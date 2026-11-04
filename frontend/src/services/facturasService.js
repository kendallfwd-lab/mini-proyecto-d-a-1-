import { request } from './api';

export const facturasService = {
  list: () => request('/facturas'),
  get: (id) => request(`/facturas/${id}`),
};
