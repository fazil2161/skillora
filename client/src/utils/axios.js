import axios from 'axios';

// Create axios instance with default config
const instance = axios.create({
  baseURL: '/api',  // This will work both in development and production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance; 