// src/pages/Users/UserList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || '获取用户列表失败。');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('确定要删除该用户吗？')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || '删除用户失败。');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>用户管理</h3>
                <Button as={Link} to="/dashboard/users/add" variant="primary">添加用户</Button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>用户名</th>
                        <th>角色</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{new Date(user.createdAt).toLocaleString()}</td>
                            <td>
                                <Button as={Link} to={`/dashboard/users/edit/${user._id}`} variant="warning" size="sm" className="me-2">
                                    编辑
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>
                                    删除
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default UserList;