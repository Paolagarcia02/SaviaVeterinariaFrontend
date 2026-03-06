import axios from 'axios';

// Creamos una instancia de axios configurada para nuestro backend
const api = axios.create({
  baseURL: 'http://localhost:8407/api' // URL base del backend
});

// Interceptor: añade automáticamente el token JWT a todas las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Añadimos el token en el header Authorization
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;