import axios from 'axios';

// Creamos una instancia base apuntando a nuestro backend
const api = axios.create({
    baseURL: 'https://gestion-escolar-backend-p49i.onrender.com',
});

// Interceptor: Antes de que cualquier petición salga, verificamos si hay un token guardado
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

export default api;