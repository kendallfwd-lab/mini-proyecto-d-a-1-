import { request } from './api';
export const authService = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data), skipUnauthorized: true }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
};
