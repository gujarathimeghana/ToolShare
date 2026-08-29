import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000 // 15 seconds timeout
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('neighborly_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Request Error]:', error);
    }
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Error Details]:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    }

    // Check Network Error / Server Offline
    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Unable to connect to the backend server. Please check if the backend is running.'));
    }

    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    if (serverMessage) {
      return Promise.reject(new Error(serverMessage));
    }

    switch (status) {
      case 400:
        return Promise.reject(new Error('Invalid email, password, or registration details.'));
      case 401:
        return Promise.reject(new Error('Invalid email or password credentials.'));
      case 403:
        return Promise.reject(new Error('Access denied. You are not authorized for this action.'));
      case 404:
        return Promise.reject(new Error('Requested resource or endpoint not found.'));
      case 409:
        return Promise.reject(new Error('Email is already registered. Please login.'));
      case 500:
        return Promise.reject(new Error('Database or internal server error. Please try again later.'));
      default:
        return Promise.reject(new Error(`Server error (${status}). Please try again.`));
    }
  }
);

export default api;
