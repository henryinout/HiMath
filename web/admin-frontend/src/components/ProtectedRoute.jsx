// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (getUserRole() !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;