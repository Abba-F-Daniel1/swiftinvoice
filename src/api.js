import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000', // Your backend URL
});

// Add a request interceptor to include the Clerk token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('clerkToken'); // Adjust this based on how you store the token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 