// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Exam from './pages/Exam';
import Login from './pages/Login';
import Register from './pages/Register';
import Results from './pages/Results';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* 登录和注册页面 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 考试页面 */}
                <Route path="/exam" element={
                    <ProtectedRoute>
                        <Exam />
                    </ProtectedRoute>
                } />

                {/* 成绩查询页面 */}
                <Route path="/results" element={
                    <ProtectedRoute>
                        <Results />
                    </ProtectedRoute>
                } />

                {/* 默认重定向 */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* 404 页面 */}
                <Route path="*" element={<h2>404 Not Found</h2>} />
            </Routes>
        </Router>
    );
};

export default App;