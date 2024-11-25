// src/pages/Register.jsx

import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // 假设您已经创建了 api.js 来处理 API 请求

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('两次密码输入不一致。');
            return;
        }
        try {
            await api.post('/register', { username, password });
            setSuccess('注册成功！请登录。');
            setError('');
            navigate('/login'); // 注册成功后跳转到登录页面
        } catch (err) {
            console.error(err);
            setError('注册失败，请重试。');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '400px' }}>
            <h2>注册</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleRegister}>
                <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label>用户名</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="请输入用户名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>密码</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                    <Form.Label>确认密码</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="再次输入密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    注册
                </Button>
            </Form>
            <p className="mt-3">
                已有账号？ <Link to="/login">登录</Link>
            </p>
        </Container>
    );
};

export default Register;