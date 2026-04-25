import axios from 'axios';

const axiosInstance = axios.create({
  // URL updated to your live Render backend
  baseURL: 'https://workwave-backend-f286.onrender.com/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT to headers automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure there is exactly one space between Bearer and the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token expiration or unauthorized access
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401, the token is dead—clear it!
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optional: redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;