import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
    const stored = localStorage.getItem('almaaz_user');
    if (stored) {
        const { token } = JSON.parse(stored);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default API;
