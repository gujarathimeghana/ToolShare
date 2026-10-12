import axios from 'axios';

// Live Public HTTPS Backend Domain for Mobile & Production
const LIVE_BACKEND_API_URL = 'https://server-ten-kappa-66.vercel.app/api';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  if (typeof window !== 'undefined') {
    // If native Capacitor Android mobile app
    if (window.Capacitor) {
      return LIVE_BACKEND_API_URL;
    }
    // If running in local web browser
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    return LIVE_BACKEND_API_URL;
  }

  return LIVE_BACKEND_API_URL;
};

const API_BASE_URL = getApiBaseUrl();
console.log(`[API Service] Active Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token & Log Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('neighborly_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const fullUrl = (config.baseURL || '') + (config.url || '');
    console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract clean error messages & Log Failures
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status ${response.status}`);
    return response.data;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase() || 'HTTP';
    const url = (error.config?.baseURL || '') + (error.config?.url || '');
    let message = '';

    if (error.response) {
      const status = error.response.status;
      const dataMsg = error.response.data?.message || error.response.data?.error;
      console.error(`[API Error Response] ${method} ${url} - Status ${status}:`, error.response.data);
      if (dataMsg) {
        message = dataMsg;
      } else if (status === 401) {
        message = 'Your session has expired. Please log in again.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status === 400) {
        message = 'Invalid request. Please check all form fields.';
      } else if (status >= 500) {
        message = 'Server error occurred. Please try again later.';
      }
    } else if (error.request) {
      console.error(`[API Network Error] ${method} ${url} - Request failed to reach server. Error:`, error.message);
      message = 'Unable to connect to the server. Please check your network connection or server status.';
    } else {
      console.error(`[API Error] ${method} ${url}:`, error.message);
    }

    if (!message) {
      message = error.message || 'An error occurred. Please try again.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
