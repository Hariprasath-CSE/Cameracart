import axios from 'axios';
import toast from 'react-hot-toast';

// create an axios instance with the base url for the backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token invalid/expired or no permission
      localStorage.clear();
      toast.error('Session expired or unauthorized. Redirecting to login...');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
