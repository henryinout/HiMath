// src/utils/auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (error) {
        return null;
    }
};