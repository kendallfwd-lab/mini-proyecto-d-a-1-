const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';
let authToken = null;
let unauthorizedHandler = null;
export const setAuthToken = (token) => { authToken = token; };
export const setUnauthorizedHandler = (handler) => { unauthorizedHandler = handler; };

export async function request(path, options = {}) {
  const { skipUnauthorized, ...fetchOptions } = options;
  const headers = { 'Content-Type': 'application/json', ...fetchOptions.headers };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });
  const body = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (response.status === 401 && !skipUnauthorized && unauthorizedHandler) unauthorizedHandler();

  if (!response.ok || body.success === false) {
    throw new Error(body.message || body.error || 'No se pudo completar la solicitud');
  }
  return body.data;
}
