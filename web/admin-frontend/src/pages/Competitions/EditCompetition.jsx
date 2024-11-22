// src/pages/Competitions/EditCompetition.jsx
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditCompetition = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [questions, setQuestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [compRes, questionsRes, usersRes] = await Promise.all([
                api.get('/admin/competitions'),
                api.get('/admin/questions'),
                api.get('/admin/users'),
            ]);
            const competition = compRes.data.find(c => c._id === id);
            if (competition) {
                setName(competition.name);
                setStartTime(competition.startTime.slice(0, 16)); // 格式化为 datetime-local 的格式
                setEndTime(competition.endTime.slice(0, 16));
                setSelectedQuestions(competition.questions.map(q => q._id));
                setSelectedUsers(competition.authorizedUsers.map(u => u._id));
            } else {
                setError('竞赛未找到。');
            }
            setQuestions(questionsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            setError(err.response?.data?.error || '获取数据失败。');
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.put(`/admin/competitions/${id}`, {
                name,
                startTime,
                endTime,
                questionIds: selectedQuestions,
                userIds: selectedUsers,
            });
            navigate('/dashboard/competitions');
        } catch (err) {
            setError(err.response?.data?.error || '更新竞赛失败。');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <h3>编辑竞赛</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name" className="mb-3">
                    <Form.Label>竞赛名称</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="输入竞赛名称"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="startTime" className="mb-3">
                    <Form.Label>开始时间</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="endTime" className="mb-3">
                    <Form.Label>结束时间</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="questions" className="mb-3">
                    <Form.Label>选择题目（按住 Ctrl 多选）</Form.Label>
                    <Form.Control
                        as="select"
                        multiple
                        value={selectedQuestions}
                        onChange={(e) =>
                            setSelectedQuestions(Array.from(e.target.selectedOptions, option => option.value))
                        }
                        required
                    >
                        {questions.map(q => (
                            <option key={q._id} value={q._id}>{q.title}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="users" className="mb-3">
                    <Form.Label>授权用户（按住 Ctrl 多选）</Form.Label>
                    <Form.Control
                        as="select"
                        multiple
                        value={selectedUsers}
                        onChange={(e) =>
                            setSelectedUsers(Array.from(e.target.selectedOptions, option => option.value))
                        }
                        required
                    >
                        {users.map(u => (
                            <option key={u._id} value={u._id}>{u.username}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" className="me-2">
                    更新
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard/competitions')}>
                    取消
                </Button>
            </Form>
        </Container>
    );
};

export default EditCompetition;