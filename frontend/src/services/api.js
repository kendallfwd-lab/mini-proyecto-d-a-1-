const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';
export const AUTH_MODE = import.meta.env.VITE_AUTH_MODE || 'bearer';
let authToken = null;
let unauthorizedHandler = null;
let refreshInFlight = null;

export const setAuthToken = (token) => { authToken = token; };
export const setUnauthorizedHandler = (handler) => { unauthorizedHandler = handler; };
const csrfToken = () => document.cookie.split('; ').find((item) => item.startsWith('csrf_token='))?.split('=').slice(1).join('=');

async function rawRequest(path, fetchOptions) {
  return fetch(`${API_URL}${path}`, { ...fetchOptions, credentials: 'include' });
}

export async function request(path, options = {}) {
  const { skipUnauthorized, _retry, ...fetchOptions } = options;
  const headers = { 'Content-Type': 'application/json', ...fetchOptions.headers };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  if (AUTH_MODE === 'cookie' && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(fetchOptions.method)) {
    const csrf = csrfToken(); if (csrf) headers['X-CSRF-Token'] = decodeURIComponent(csrf);
  }
  const response = await rawRequest(path, { ...fetchOptions, headers });
  const body = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (response.status === 401 && AUTH_MODE === 'cookie' && !_retry && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
    refreshInFlight ||= request('/auth/refresh', { method: 'POST', skipUnauthorized: true, _retry: true });
    try { await refreshInFlight; refreshInFlight = null; return request(path, { ...options, _retry: true }); }
    catch (error) { refreshInFlight = null; if (!skipUnauthorized && unauthorizedHandler) unauthorizedHandler(); throw error; }
  }
  if (response.status === 401 && !skipUnauthorized && unauthorizedHandler) unauthorizedHandler();
  if (!response.ok || body.success === false) throw new Error(body.message || body.error || 'No se pudo completar la solicitud');
  return body.data;
}
