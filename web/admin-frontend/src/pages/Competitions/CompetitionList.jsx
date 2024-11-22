// src/pages/Competitions/CompetitionList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const CompetitionList = () => {
    const [competitions, setCompetitions] = useState([]);
    const [error, setError] = useState('');

    const fetchCompetitions = async () => {
        try {
            const response = await api.get('/admin/competitions');
            setCompetitions(response.data);
        } catch (err) {
            setError(err.response?.data?.error || '获取竞赛列表失败。');
        }
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('确定要删除该竞赛吗？')) return;
        try {
            await api.delete(`/admin/competitions/${id}`);
            setCompetitions(competitions.filter(comp => comp._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || '删除竞赛失败。');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>竞赛管理</h3>
                <Button as={Link} to="/dashboard/competitions/add" variant="primary">添加竞赛</Button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>开始时间</th>
                        <th>结束时间</th>
                        <th>创建者</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {competitions.map(comp => (
                        <tr key={comp._id}>
                            <td>{comp.name}</td>
                            <td>{new Date(comp.startTime).toLocaleString()}</td>
                            <td>{new Date(comp.endTime).toLocaleString()}</td>
                            <td>{comp.createdBy.username}</td>
                            <td>
                                <Button as={Link} to={`/dashboard/competitions/edit/${comp._id}`} variant="warning" size="sm" className="me-2">
                                    编辑
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(comp._id)}>
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

export default CompetitionList;