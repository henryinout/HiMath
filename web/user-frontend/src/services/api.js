// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// 添加请求拦截器，自动在每个请求中添加 Authorization 头
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;