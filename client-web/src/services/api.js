import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('neighborly_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract clean error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = '';
    if (error.response) {
      const status = error.response.status;
      const dataMsg = error.response.data?.message || error.response.data?.error;
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
        message = 'Unable to save data to database. Please try again.';
      }
    } else if (error.request) {
      message = 'Unable to connect to the server. Please check that the backend server on port 5000 is running.';
    }

    if (!message) {
      message = error.message || 'An error occurred. Please try again.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
