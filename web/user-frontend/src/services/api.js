// src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // 根据实际情况调整
});

// 在请求拦截器中添加 Authorization 头部
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;