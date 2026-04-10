import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor - Extract data from { success: true, data: {...} } wrapper
api.interceptors.response.use(
  (response) => {
    // Extract data from the backend's response wrapper
    if (response.data && response.data.success && response.data.data !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
  create: (data) => api.post('/heroes', data),
  update: (id, data) => api.put(`/heroes/${id}`, data),
  delete: (id) => api.delete(`/heroes/${id}`),
};

// Service Services
export const serviceAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  getBySlug: (slug) => api.get(`/services/slug/${slug}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Value Services
export const valueAPI = {
  getAll: (params) => api.get('/values', { params }),
  getById: (id) => api.get(`/values/${id}`),
  create: (data) => api.post('/values', data),
  update: (id, data) => api.put(`/values/${id}`, data),
  delete: (id) => api.delete(`/values/${id}`),
};

// Product Services
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Partner Services
export const partnerAPI = {
  getAll: (params) => api.get('/partners', { params }),
  getById: (id) => api.get(`/partners/${id}`),
  getBySlug: (slug) => api.get(`/partners/slug/${slug}`),
  create: (data) => api.post('/partners', data),
  update: (id, data) => api.put(`/partners/${id}`, data),
  delete: (id) => api.delete(`/partners/${id}`),
};

// Client Services
export const clientAPI = {
  getAll: (params) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  getBySlug: (slug) => api.get(`/clients/slug/${slug}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// News Services
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  getBySlug: (slug) => api.get(`/news/slug/${slug}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  publish: (id) => api.put(`/news/${id}/publish`),
  delete: (id) => api.delete(`/news/${id}`),
};

// Event Services
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id) => api.get(`/events/${id}`),
  getBySlug: (slug) => api.get(`/events/slug/${slug}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
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

export default api;