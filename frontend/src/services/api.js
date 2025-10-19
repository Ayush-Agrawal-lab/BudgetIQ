import axios from 'axios';

// ---------------------------
// Environment-based API URL
// ---------------------------
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// ---------------------------
// rrweb network logging helper
// ---------------------------
function rrEmitNetworkEvent(eventData) {
  if (window.__rr && typeof window.__rr.addCustomEvent === 'function') {
    window.__rr.addCustomEvent('network', {
      ...eventData,
      timestamp: Date.now(),
    });
  }
}

// ---------------------------
// Axios instance
// ---------------------------
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

  rrEmitNetworkEvent({
    phase: 'start',
    api: 'axios',
    url: config.url,
    method: config.method,
    headers: config.headers,
    requestBody: JSON.stringify(config.data || {}),
  });

  return config;
});

api.interceptors.response.use(
  (response) => {
    rrEmitNetworkEvent({
      phase: 'end',
      api: 'axios',
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      responseBody: JSON.stringify(response.data || {}),
    });
    return response;
  },
  (error) => {
    const config = error.config || {};
    rrEmitNetworkEvent({
      phase: 'error',
      api: 'axios',
      url: config.url,
      method: config.method,
      message: error.message,
      stack: error.stack || '',
    });

    console.error('API Error:', error.message);

    if (
      error.code === 'ERR_NETWORK' ||
      error.message.includes('certificate') ||
      error.message.includes('Network Error')
    ) {
      alert(
        `Network/SSL error while calling API: ${config.url}\n` +
          `Check your backend URL and SSL certificate.`
      );
    }

    return Promise.reject(error);
  }
);

// ---------------------------
// Auth APIs
// ---------------------------
export const auth = {
  signup: async (name, email, password) => {
    const response = await api.post('/api/auth/signup', { name, email, password });
    return response.data; // { access_token }
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data; // { access_token }
  },

  getProfile: async (token) => {
    const response = await api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { id, name, email }
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// ---------------------------
// Accounts APIs
// ---------------------------
export const accounts = {
  getAll: async () => (await api.get('/api/accounts')).data,
  create: async (accountData) => (await api.post('/api/accounts', accountData)).data,
  delete: async (accountId) => (await api.delete(`/api/accounts/${accountId}`)).data,
};

// ---------------------------
// Transactions APIs
// ---------------------------
export const transactions = {
  getAll: async () => (await api.get('/api/transactions')).data,
  create: async (transactionData) => (await api.post('/api/transactions', transactionData)).data,
  delete: async (transactionId) => (await api.delete(`/api/transactions/${transactionId}`)).data,
};

// ---------------------------
// Goals APIs
// ---------------------------
export const goals = {
  getAll: async () => (await api.get('/api/goals')).data,
  create: async (goalData) => (await api.post('/api/goals', goalData)).data,
  update: async (goalId, goalData) => (await api.put(`/api/goals/${goalId}`, goalData)).data,
  delete: async (goalId) => (await api.delete(`/api/goals/${goalId}`)).data,
};

// ---------------------------
// AI Insights APIs
// ---------------------------
export const insights = {
  getPrediction: async () => (await api.get('/api/insights/prediction')).data,
  getTips: async () => (await api.get('/api/insights/tips')).data,
  getScore: async () => (await api.get('/api/insights/score')).data,
};

// ---------------------------
// Dashboard APIs
// ---------------------------
export const dashboard = {
  getSummary: async () => (await api.get('/api/dashboard/summary')).data,
};

export default api;
