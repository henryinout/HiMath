// src/pages/Register.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:3000/api/register', { username, password });
            alert('注册成功，请登录！');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || '注册失败，请重试。');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">用户注册</h2>
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

                <Button variant="success" type="submit" className="w-100">
                    注册
                </Button>
            </Form>
        </Container>
    );
};

export default Register;