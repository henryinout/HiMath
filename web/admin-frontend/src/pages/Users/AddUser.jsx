// src/pages/Users/AddUser.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/admin/users', { username, password, role });
            navigate('/dashboard/users');
        } catch (err) {
            setError(err.response?.data?.error || '添加用户失败。');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <h3>添加用户</h3>
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

                <Form.Group controlId="role" className="mb-3">
                    <Form.Label>角色</Form.Label>
                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="user">用户</option>
                        <option value="admin">管理员</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="me-2">
                    提交
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard/users')}>
                    取消
                </Button>
            </Form>
        </Container>
    );
};

export default AddUser;