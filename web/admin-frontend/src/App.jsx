// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserList from './pages/Users/UserList';
import AddUser from './pages/Users/AddUser';
import EditUser from './pages/Users/EditUser';
import QuestionList from './pages/Questions/QuestionList';
import AddQuestion from './pages/Questions/AddQuestion';
import EditQuestion from './pages/Questions/EditQuestion';
import CompetitionList from './pages/Competitions/CompetitionList';
import AddCompetition from './pages/Competitions/AddCompetition';
import EditCompetition from './pages/Competitions/EditCompetition';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Dashboard/Home';
import Layout from './components/Layout'; // 引入布局组件

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 登录页面 */}
        <Route path="/login" element={<Login />} />

        {/* 仪表盘及其子路由 */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout /> {/* 使用布局组件 */}
          </ProtectedRoute>
        }>
          {/* 仪表盘首页 */}
          <Route index element={<Home />} />

          {/* 用户管理 */}
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />

          {/* 题目管理 */}
          <Route path="questions" element={<QuestionList />} />
          <Route path="questions/add" element={<AddQuestion />} />
          <Route path="questions/edit/:id" element={<EditQuestion />} />

          {/* 竞赛管理 */}
          <Route path="competitions" element={<CompetitionList />} />
          <Route path="competitions/add" element={<AddCompetition />} />
          <Route path="competitions/edit/:competitionId" element={<EditCompetition />} />
        </Route>

        {/* 重定向根路径 */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* 404 页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;