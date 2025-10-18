import axios from 'axios';

// ----------------------------
// Environment variables
// ----------------------------
const API_BASE = process.env.REACT_APP_BACKEND_URL;  // Use Render default backend URL
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("Using API Base:", API_BASE);

// ----------------------------
// Axios instance
// ----------------------------
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// JWT for Render backend, Anon key for Supabase
api.interceptors.request.use((config) => {
  // Supabase calls (if you ever call Supabase directly from frontend)
  if (config.baseURL === SUPABASE_URL) {
    config.headers.apikey = SUPABASE_ANON_KEY;
    config.headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  } else {
    // Backend calls
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------------
// Error handling
// ----------------------------
api.interceptors.response.use(
  res => res,
  err => {
    console.error("API Error:", err.message);

    // SSL / Network error alert
    if (err.code === "ERR_NETWORK" || err.message.includes("certificate")) {
      alert(`Network/SSL error. Check your API URL: ${API_BASE}`);
    }
    return Promise.reject(err);
  }
);

export default api;

// ----------------------------
// Auth APIs
// ----------------------------
export const auth = {
  signup: async (email, password) => {
    const response = await api.post("/api/auth/signup", { email, password });
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  },
  getProfile: async () => (await api.get("/api/auth/me")).data,
  logout: () => localStorage.removeItem("token"),
};

// ----------------------------
// Accounts APIs
// ----------------------------
export const accounts = {
  getAll: async () => (await api.get("/api/accounts")).data,
  create: async (accountData) => (await api.post("/api/accounts", accountData)).data,
  delete: async (accountId) => (await api.delete(`/api/accounts/${accountId}`)).data,
};

// ----------------------------
// Transactions APIs
// ----------------------------
export const transactions = {
  getAll: async () => (await api.get("/api/transactions")).data,
  create: async (transactionData) => (await api.post("/api/transactions", transactionData)).data,
  delete: async (transactionId) => (await api.delete(`/api/transactions/${transactionId}`)).data,
};

// ----------------------------
// Goals APIs
// ----------------------------
export const goals = {
  getAll: async () => (await api.get("/api/goals")).data,
  create: async (goalData) => (await api.post("/api/goals", goalData)).data,
  update: async (goalId, goalData) => (await api.put(`/api/goals/${goalId}`, goalData)).data,
  delete: async (goalId) => (await api.delete(`/api/goals/${goalId}`)).data,
};

// ----------------------------
// AI Insights APIs
// ----------------------------
export const insights = {
  getPrediction: async () => (await api.get("/api/insights/prediction")).data,
  getTips: async () => (await api.get("/api/insights/tips")).data,
  getScore: async () => (await api.get("/api/insights/score")).data,
};

// ----------------------------
// Dashboard APIs
// ----------------------------
export const dashboard = {
  getSummary: async () => (await api.get("/api/dashboard/summary")).data,
};
