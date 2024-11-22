// src/pages/Login.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:3000/api/login', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/exam'); // 登录成功后跳转到考试页面
        } catch (err) {
            setError(err.response?.data?.error || '登录失败，请重试。');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">用户登录</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                    <Form.Label>用户名</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="输入用户名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>密码</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    登录
                </Button>
            </Form>
        </Container>
    );
};

export default Login;