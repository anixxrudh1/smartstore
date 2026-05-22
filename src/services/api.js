import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage') 
    ? JSON.parse(localStorage.getItem('auth-storage')).state.token
    : null
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

export const authAPI = {
  signup: (email, password, storeName, confirmPassword) =>
    api.post('/auth/signup', { email, password, storeName, confirmPassword }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
}

export const productAPI = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getById: (id) => api.get(`/products/${id}`),
}

export const aiAPI = {
  generateDescription: (productId) =>
    api.post('/ai/generate-description', { productId }),
  generateTags: (productId) =>
    api.post('/ai/generate-tags', { productId }),
  generateCaption: (productId) =>
    api.post('/ai/generate-caption', { productId }),
  generatePricing: (productId) =>
    api.post('/ai/generate-pricing', { productId }),
  generateInsights: () =>
    api.post('/ai/generate-insights'),
}

export const salesAPI = {
  getRevenue: () => api.get('/sales/revenue'),
  getTopProducts: () => api.get('/sales/top-products'),
  getProductHistory: (productId) => api.get(`/sales/product-history/${productId}`),
  getSalesData: () => api.get('/sales/data'),
  getLowStockProducts: () => api.get('/sales/low-stock'),
}

export const adminAPI = {
  seedDemo: () => api.post('/admin/seed'),
}

export default api
