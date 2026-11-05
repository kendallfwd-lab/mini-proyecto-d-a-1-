import { request } from './api';

export const adminService = {
  list: () => request('/admin/usuarios'),
  create: (data) => request('/admin/usuarios', { method: 'POST', body: JSON.stringify(data) }),
  deactivate: (id) => request(`/admin/usuarios/${id}/desactivar`, { method: 'PATCH' }),
  revokeSessions: (id) => request(`/admin/usuarios/${id}/revocar-sesiones`, { method: 'PATCH' }),
  audit: () => request('/admin/auditoria?limit=20'),
};
