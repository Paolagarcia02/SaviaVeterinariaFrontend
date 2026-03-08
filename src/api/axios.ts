import axios from 'axios';

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
const normalizedBaseUrl = rawBaseUrl
  ? (rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/+$/, '')}/api`)
  : 'http://saviaveterinaria.retocsv.es';

export const publicApi = axios.create({
  baseURL: normalizedBaseUrl
});

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
