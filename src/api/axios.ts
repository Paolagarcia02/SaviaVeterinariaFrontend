import axios from 'axios';

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
const normalizedBaseUrl = rawBaseUrl
  ? (rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/+$/, '')}/api`)
  : 'http://aa978f882b8a44c19884d6a4c8843bdf-1625304351.us-east-1.elb.amazonaws.com/api';

// Creamos una instancia de axios configurada para nuestro backend
const api = axios.create({
  baseURL: normalizedBaseUrl
});

// Interceptor: añade automáticamente el token JWT a todas las peticiones
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        // Añadimos el token en el header Authorization
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
