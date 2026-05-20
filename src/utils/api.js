import axios from 'axios';


// Get base URL dynamically and sanitize trailing slash
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || '';
  if (!envUrl) {
    return '/api';
  }
  return `${envUrl.replace(/\/$/, '')}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
