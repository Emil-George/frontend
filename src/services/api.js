import axios from 'axios';

// --- 1. API Configuration ---
// Create a single, central axios instance. This will be used for all API calls.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // 10-second timeout
  headers: {
    'Content-Type': 'application/json',
  },
} );

// --- 2. Interceptors (Your existing code is perfect) ---

// Request Interceptor: Automatically add the JWT token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or wherever you store your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized errors globally (e.g., token expired).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Redirect to the login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// --- 3. API Function Definitions ---
// Group all API functions into logical objects. They all use the single `api` instance defined above.

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  validateToken: (token) => api.post('/auth/validate', null, { params: { token } }),
};

export const adminAPI = {
  // Tenant management
  getTenants: (params) => api.get('/tenants', { params }),
  getTenant: (id) => api.get(`/tenants/${id}`),
  createTenant: (tenantData) => api.post('/tenants', tenantData),
  updateTenant: (id, tenantData) => api.put(`/tenants/${id}`, tenantData),
  deleteTenant: (id) => api.delete(`/tenants/${id}`),
  
  // Payment management
  getPayments: (params) => api.get('/admin/payments', { params }),
  updatePaymentStatus: (id, status) => api.put(`/admin/payments/${id}/status`, { status }),
  createStripeConnectAccount: () => api.post('/stripe/create-connect-account'),
  
  // Maintenance requests
  getMaintenanceRequests: (params) => api.get('/maintenance', { params }), // Corrected from /admin/maintenance-requests
  updateMaintenanceStatus: (id, updateData) => api.put(`/maintenance/${id}/status`, updateData),
  
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

export const tenantAPI = {
  // Profile management
  getProfile: () => api.get('/tenant/profile'),
  updateProfile: (profileData) => api.put('/tenant/profile', profileData),
  
  // Payments
  getPayments: (params) => api.get('/tenant/payments', { params }),
  submitPayment: (paymentData) => api.post('/tenant/payments', paymentData),
  
  // Maintenance requests
  getMyMaintenanceRequests: (params) => api.get('/maintenance/my-requests', { params }),
  createMaintenanceRequest: (requestData) => api.post('/maintenance', requestData),
  deleteMaintenanceRequest: (id) => api.delete(`/maintenance/${id}`),
  
  // Dashboard
  // CORRECTED: This now correctly uses the `api` constant defined in this file.
  getTenantDashboardData: () => api.get('/dashboard/tenant'),
};

export const fileAPI = {
  upload: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  download: (fileId) => api.get(`/files/${fileId}/download`, { responseType: 'blob' }),
  getFileUrl: (fileId) => `${API_BASE_URL}/files/${fileId}`,
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Note: There is no need for a default export. 
// Components should import the specific object they need, like `import { tenantAPI } from '...'`.
