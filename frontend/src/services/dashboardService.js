import { request } from './api';

export const dashboardService = {
  summary: () => request('/dashboard/resumen'),
  analytics: () => request('/dashboard/analiticas'),
  profitability: () => request('/dashboard/rentabilidad'),
};
