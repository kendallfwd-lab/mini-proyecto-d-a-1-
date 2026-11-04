const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const body = response.status === 204 ? {} : await response.json();

  if (!response.ok || body.success === false) {
    throw new Error(body.message || body.error || 'No se pudo completar la solicitud');
  }
  return body.data;
}
