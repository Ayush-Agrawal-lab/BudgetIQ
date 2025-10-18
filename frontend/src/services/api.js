import axios from 'axios';

const API_URL = "https://budgetiq-backend.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------
// Auth APIs
// ---------------------------
export const auth = {
  signup: async (email, password) => {
    const response = await api.post('/api/auth/signup', { email, password });
    // Save token
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    // Save token
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// ---------------------------
// Accounts APIs
// ---------------------------
export const accounts = {
  getAll: async () => {
    const response = await api.get('/api/accounts');
    return response.data;
  },

  create: async (accountData) => {
    const response = await api.post('/api/accounts', accountData);
    return response.data;
  },

  delete: async (accountId) => {
    const response = await api.delete(`/api/accounts/${accountId}`);
    return response.data;
  },
};

// ---------------------------
// Transactions APIs
// ---------------------------
export const transactions = {
  getAll: async () => {
    const response = await api.get('/api/transactions');
    return response.data;
  },

  create: async (transactionData) => {
    const response = await api.post('/api/transactions', transactionData);
    return response.data;
  },

  delete: async (transactionId) => {
    const response = await api.delete(`/api/transactions/${transactionId}`);
    return response.data;
  },
};

// ---------------------------
// Goals APIs
// ---------------------------
export const goals = {
  getAll: async () => {
    const response = await api.get('/api/goals');
    return response.data;
  },

  create: async (goalData) => {
    const response = await api.post('/api/goals', goalData);
    return response.data;
  },

  update: async (goalId, goalData) => {
    const response = await api.put(`/api/goals/${goalId}`, goalData);
    return response.data;
  },

  delete: async (goalId) => {
    const response = await api.delete(`/api/goals/${goalId}`);
    return response.data;
  },
};

// ---------------------------
// AI Insights APIs
// ---------------------------
export const insights = {
  getPrediction: async () => {
    const response = await api.get('/api/insights/prediction');
    return response.data;
  },

  getTips: async () => {
    const response = await api.get('/api/insights/tips');
    return response.data;
  },

  getScore: async () => {
    const response = await api.get('/api/insights/score');
    return response.data;
  },
};

// ---------------------------
// Dashboard APIs
// ---------------------------
export const dashboard = {
  getSummary: async () => {
    const response = await api.get('/api/dashboard/summary');
    return response.data;
  },
};

export default api;
