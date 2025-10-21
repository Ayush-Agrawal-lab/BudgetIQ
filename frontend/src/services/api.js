import axios from 'axios';

// ---------------------------
// Environment-based API URL
// ---------------------------
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// ---------------------------
// rrweb network logging helper
// ---------------------------
function rrEmitNetworkEvent(eventData) {
  try {
    if (!window.__rr || typeof window.__rr.addCustomEvent !== 'function') {
      return;
    }

    const safeStringify = (data) => {
      try {
        // Handle undefined/null cases
        if (data === undefined || data === null) {
          return '{}';
        }
        
        // If it's already a string, validate it's JSON-parseable
        if (typeof data === 'string') {
          try {
            JSON.parse(data);
            return data;
          } catch {
            // If string is not valid JSON, try to stringify it as a regular string
            return JSON.stringify(data);
          }
        }
        
        // For objects/arrays, safely stringify with fallback
        return JSON.stringify(data || {});
      } catch (e) {
        console.warn('Error in safeStringify:', e);
        return '{}';
      }
    };

    // Ensure eventData is an object with default values
    const safeEventData = {
      phase: 'unknown',
      api: 'axios',
      url: '',
      method: 'GET',
      timestamp: Date.now(),
      ...(typeof eventData === 'object' && eventData !== null ? eventData : {})
    };

    // Process and emit the network event
    window.__rr.addCustomEvent('network', {
      ...safeEventData,
      requestBody: safeStringify(safeEventData.requestBody),
      responseBody: safeStringify(safeEventData.responseBody),
      status: safeEventData.status || 0,
      statusText: safeEventData.statusText || '',
      headers: safeStringify(safeEventData.headers)
    });
  } catch (error) {
    console.warn('Error emitting network event:', error);
  }
}

// ---------------------------
// Retry mechanism
// ---------------------------
const withRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// ---------------------------
// Debounce utility
// ---------------------------
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// ---------------------------
// Axios instance
// ---------------------------
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000
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
      responseBody: response.data
    });
    return response;
  },
  (error) => {
    const config = error.config || {};
    
    // Safe event logging
    rrEmitNetworkEvent({
      phase: 'error',
      api: 'axios',
      url: config.url,
      method: config.method,
      message: error.message,
      stack: error.stack || '',
      status: error.response?.status,
      statusText: error.response?.statusText
    });

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error(`API Error ${error.response.status}:`, error.response.data);
      
      if (error.response.status === 401) {
        // Authentication error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.message);
      if (
        error.code === 'ERR_NETWORK' ||
        error.message.includes('certificate') ||
        error.message.includes('Network Error')
      ) {
        console.error(`Network/SSL error while calling API: ${config.url}`);
      }
    } else {
      // Error in request setup
      console.error('Request Setup Error:', error.message);
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
    // response.data may include { access_token, user }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    // response.data may include { access_token, user }
    return response.data;
  },

  getProfile: async (token) => {
    try {
      const response = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // { id, name, email }
    } catch (err) {
      // If /me is not implemented on server, return null instead of throwing
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// ---------------------------
// Accounts APIs
// ---------------------------
export const accounts = {
  getAll: async () => withRetry(async () => (await api.get('/api/accounts')).data),
  create: async (accountData) => withRetry(async () => (await api.post('/api/accounts', accountData)).data),
  delete: async (accountId) => withRetry(async () => (await api.delete(`/api/accounts/${accountId}`)).data),
  update: async (accountId, data) => withRetry(async () => (await api.put(`/api/accounts/${accountId}`, data)).data),
};

// ---------------------------
// Transactions APIs
// ---------------------------
export const transactions = {
  getAll: async () => withRetry(async () => (await api.get('/api/transactions')).data),
  create: async (transactionData) => withRetry(async () => (await api.post('/api/transactions', transactionData)).data),
  delete: async (transactionId) => withRetry(async () => (await api.delete(`/api/transactions/${transactionId}`)).data),
  update: async (transactionId, data) => withRetry(async () => (await api.put(`/api/transactions/${transactionId}`, data)).data),
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
