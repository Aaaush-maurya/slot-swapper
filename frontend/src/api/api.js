import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// attach token except for auth endpoints
client.interceptors.request.use(config => {
  const url = config.url || '';
  const isAuthEndpoint = url.includes('/auth/');
  if (!isAuthEndpoint) {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers && config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

export default client;
