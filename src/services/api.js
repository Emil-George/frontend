import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  validateToken: (token) => api.post('/auth/validate', null, { params: { token } }),
};

// Admin API
export const adminAPI = {
  // Tenant management
  getTenants: (params) => api.get('/admin/tenants', { params }),
  getTenant: (id) => api.get(`/admin/tenants/${id}`),
  createTenant: (tenantData) => api.post('/admin/tenants', tenantData),
  updateTenant: (id, tenantData) => api.put(`/admin/tenants/${id}`, tenantData),
  deleteTenant: (id) => api.delete(`/admin/tenants/${id}`),
  
  // Payment management
  getPayments: (params) => api.get('/admin/payments', { params }),
  getPayment: (id) => api.get(`/admin/payments/${id}`),
  updatePaymentStatus: (id, status) => api.put(`/admin/payments/${id}/status`, { status }),
  
  // Maintenance requests
  getMaintenanceRequests: (params) => api.get('/admin/maintenance-requests', { params }),
  getMaintenanceRequest: (id) => api.get(`/admin/maintenance-requests/${id}`),
  assignMaintenanceRequest: (id, assignee) => api.put(`/admin/maintenance-requests/${id}/assign`, { assignedTo: assignee }),
  updateMaintenanceStatus: (id, status) => api.put(`/admin/maintenance-requests/${id}/status`, { status }),
  
  // Lease agreements
  getLeaseAgreements: (params) => api.get('/admin/lease-agreements', { params }),
  getLeaseAgreement: (id) => api.get(`/admin/lease-agreements/${id}`),
  createLeaseAgreement: (leaseData) => api.post('/admin/lease-agreements', leaseData),
  updateLeaseAgreement: (id, leaseData) => api.put(`/admin/lease-agreements/${id}`, leaseData),
  
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

// Tenant API
export const tenantAPI = {
  // Profile management
  getProfile: () => api.get('/tenant/profile'),
  updateProfile: (profileData) => api.put('/tenant/profile', profileData),
  
  // Payments
  getPayments: (params) => api.get('/tenant/payments', { params }),
  getPayment: (id) => api.get(`/tenant/payments/${id}`),
  submitPayment: (paymentData) => api.post('/tenant/payments', paymentData),
  
  // Maintenance requests
  getMaintenanceRequests: (params) => api.get('/tenant/maintenance-requests', { params }),
  getMaintenanceRequest: (id) => api.get(`/tenant/maintenance-requests/${id}`),
  createMaintenanceRequest: (requestData) => api.post('/tenant/maintenance-requests', requestData),
  updateMaintenanceRequest: (id, requestData) => api.put(`/tenant/maintenance-requests/${id}`, requestData),
  
  // Lease agreements
  getLeaseAgreements: (params) => api.get('/tenant/lease-agreements', { params }),
  getLeaseAgreement: (id) => api.get(`/tenant/lease-agreements/${id}`),
  signLeaseAgreement: (id) => api.post(`/tenant/lease-agreements/${id}/sign`),
  
  // Dashboard
  getDashboardStats: () => api.get('/tenant/dashboard/stats'),
};

// File API
export const fileAPI = {
  upload: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  download: (fileId) => api.get(`/files/${fileId}/download`, {
    responseType: 'blob',
  }),
  
  getFileUrl: (fileId) => `${API_BASE_URL}/files/${fileId}`,
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0,
        data: null,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null,
      };
    }
  },

  // Format API response
  formatResponse: (response) => {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  },

  // Create query string from params
  createQueryString: (params) => {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    
    return searchParams.toString();
  },

  // Download file from blob response
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default api;
