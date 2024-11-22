// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Competition from './pages/Competition';
import CompetitionList from './pages/CompetitionList';
import CompetitionDetail from './pages/CompetitionDetail';
import Exam from './pages/Exam';
import Login from './pages/Login';
import Register from './pages/Register';
import Results from './pages/Results';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // 导入布局组件

const App = () => {
    return (
        <Router>
            <Routes>
                {/* 使用布局组件包装所有需要导航栏的路由 */}
                <Route path="/" element={<Layout />}>
                    {/* 首页 */}
                    <Route index element={<Home />} />

                    {/* 登录和注册页面 */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    {/* 受保护的路由 */}
                    <Route element={<ProtectedRoute />}>
                        {/* 比赛相关页面 */}
                        <Route path="competitions" element={<CompetitionList />} />
                        <Route path="competitions/:competitionId" element={<CompetitionDetail />} />
                        <Route path="exam/:competitionId" element={<Exam />} />
                        <Route path="results" element={<Results />} />
                        <Route path="competition" element={<Competition />} /> {/* 根据需要调整 */}
                    </Route>

                    {/* 404 页面 */}
                    <Route path="*" element={<h2>404 Not Found</h2>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;