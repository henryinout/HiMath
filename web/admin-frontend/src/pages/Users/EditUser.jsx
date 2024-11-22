// src/pages/Users/EditUser.jsx
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/admin/users`);
                const user = response.data.find(u => u._id === id);
                if (user) {
                    setUsername(user.username);
                    setRole(user.role);
                } else {
                    setError('用户未找到。');
                }
            } catch (err) {
                setError(err.response?.data?.error || '获取用户信息失败。');
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const updateData = { username, role };
        if (password) updateData.password = password;

        try {
            await api.put(`/admin/users/${id}`, updateData);
            navigate('/dashboard/users');
        } catch (err) {
            setError(err.response?.data?.error || '更新用户失败。');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <h3>编辑用户</h3>
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
                    <Form.Label>密码（留空表示不修改）</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="输入新密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    更新
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard/users')}>
                    取消
                </Button>
            </Form>
        </Container>
    );
};

export default EditUser;