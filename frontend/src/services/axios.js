import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// I'm adding an interceptor to catch HTTP errors globally before they reach the components.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Global Error Routing based on HTTP status codes
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        // Unauthorized - Kick them to the 401 page
        window.location.href = '/401';
      } else if (error.response.status >= 500) {
        // Server crashed - Redirect to the 500 error page
        window.location.href = '/500';
      }
    }
    
    return Promise.reject(error);
  }
);