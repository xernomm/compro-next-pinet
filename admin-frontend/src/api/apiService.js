import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper to handle FormData headers
const createConfig = (data) => (data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Company Services
export const companyAPI = {
  getInfo: () => api.get('/company'),
  updateInfo: (data) => api.put('/company', data),
  uploadLogo: (formData) => api.post('/company/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Hero Services
export const heroAPI = {
  getAll: (params) => api.get('/heroes', { params }),
  getById: (id) => api.get(`/heroes/${id}`),
  create: (data) => api.post('/heroes', data, createConfig(data)),
  update: (id, data) => api.put(`/heroes/${id}`, data, createConfig(data)),
  delete: (id) => api.delete(`/heroes/${id}`),
};

// Service Services
export const serviceAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  getBySlug: (slug) => api.get(`/services/slug/${slug}`),
  create: (data) => api.post('/services', data, createConfig(data)),
  update: (id, data) => api.put(`/services/${id}`, data, createConfig(data)),
  delete: (id) => api.delete(`/services/${id}`),
};

// Value Services
export const valueAPI = {
  getAll: (params) => api.get('/values', { params }),
  getById: (id) => api.get(`/values/${id}`),
  create: (data) => api.post('/values', data, createConfig(data)),
  update: (id, data) => api.put(`/values/${id}`, data, createConfig(data)),
  delete: (id) => api.delete(`/values/${id}`),
};

// Product Services
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  create: (data) => api.post('/products', data, createConfig(data)),
  update: (id, data) => api.put(`/products/${id}`, data, createConfig(data)),
  delete: (id) => api.delete(`/products/${id}`),
};

// Partner Services
export const partnerAPI = {
  getAll: (params) => api.get('/partners', { params }),
  getById: (id) => api.get(`/partners/${id}`),
  getBySlug: (slug) => api.get(`/partners/slug/${slug}`),
  create: (data) => api.post('/partners', data, createConfig(data)),
  update: (id, data) => api.put(`/partners/${id}`, data, createConfig(data)),
  delete: (id) => api.delete(`/partners/${id}`),
};

// Client Services
export const clientAPI = {
  getAll: (params) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  getBySlug: (slug) => api.get(`/clients/slug/${slug}`),
  create: (data) => api.post('/clients', data, createConfig(data)),
  update: (id, data) => api.put(`/clients/${id}`, data, createConfig(data)),
  delete: (id) => api.delete(`/clients/${id}`),
};

// News Services
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  getBySlug: (slug) => api.get(`/news/slug/${slug}`),
  create: (data) => api.post('/news', data, createConfig(data)),
  update: (id, data) => api.put(`/news/${id}`, data, createConfig(data)),
  publish: (id) => api.put(`/news/${id}/publish`),
  delete: (id) => api.delete(`/news/${id}`),
};

// Event Services
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id) => api.get(`/events/${id}`),
  getBySlug: (slug) => api.get(`/events/slug/${slug}`),
  create: (data) => api.post('/events', data, createConfig(data)),
  update: (id, data) => api.put(`/events/${id}`, data, createConfig(data)),
  updateStatus: (id, status) => api.put(`/events/${id}/status`, { status }),
  delete: (id) => api.delete(`/events/${id}`),
};

// Career Services
export const careerAPI = {
  getAll: (params) => api.get('/careers', { params }),
  getOpen: () => api.get('/careers/open'),
  getById: (id) => api.get(`/careers/${id}`),
  getBySlug: (slug) => api.get(`/careers/slug/${slug}`),
  create: (data) => api.post('/careers', data),
  update: (id, data) => api.put(`/careers/${id}`, data),
  updateStatus: (id, status) => api.put(`/careers/${id}/status`, { status }),
  delete: (id) => api.delete(`/careers/${id}`),
};

// Contact Services
export const contactAPI = {
  getAll: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post('/contacts', data),
  updateStatus: (id, data) => api.put(`/contacts/${id}/status`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// Backup Services
export const backupAPI = {
  create: () => api.post('/backup'),
};

export default api;