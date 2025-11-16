export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  SALES_ORDER: '/sales-order',
  LOGIN: '/login',
  REGISTER: '/register',
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  processing: 'bg-blue-100 text-blue-800',
};

export const PAGINATION = {
  PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
};
