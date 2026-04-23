import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- NEW: Request Interceptor ---
// I need to make sure the token is attached to every single request automatically, 
// even after a full page refresh when memory variables are wiped.
api.interceptors.request.use(
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

// --- EXISTING: Response Interceptor ---
// I'm adding an interceptor to catch HTTP errors globally before they reach the components.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Global Error Routing based on HTTP status codes
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        // Unauthorized - Kick them to the 401/login page
        // I use window.location here because React Router hooks aren't accessible outside components
        window.location.href = '/login'; 
      } else if (error.response.status >= 500) {
        // Server crashed - Redirect to the 500 error page
        window.location.href = '/500';
      }
    }
    
    return Promise.reject(error);
  }
);