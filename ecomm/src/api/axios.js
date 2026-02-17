import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials)
};

// Product endpoints
export const productAPI = {
  getAll: () => api.get('/products'),
  search: (query) => api.get(`/products/search?q=${query}`),
  getById: (id) => api.get(`/products/${id}`)
};

// Cart endpoints
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId) => api.post('/cart', { productId }),
  updateQuantity: (productId, quantity) => api.put('/cart', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart')
};

// Order endpoints
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (orderId) => api.get(`/orders/${orderId}`)
};

export default api;
