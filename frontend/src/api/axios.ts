import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // La URL de tu backend
});

// Este código adjunta el Token JWT automáticamente en cada llamada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
