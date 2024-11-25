// src/pages/Competitions/EditCompetition.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Form, Button } from 'react-bootstrap';
import api from '../../services/api';
import { format, parseISO } from 'date-fns'; // 使用 date-fns 进行日期处理

const EditCompetition = () => {
    const { competitionId } = useParams();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [redirect, setRedirect] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        endTime: '',
        questionIds: [],
        userIds: [],
    });

    useEffect(() => {
        console.log('EditCompetition - competitionId:', competitionId); // 验证 competitionId
        if (!competitionId) {
            setError('比赛 ID 无效。');
            setLoading(false);
            return;
        }

        const fetchCompetition = async () => {
            try {
                const response = await api.get(`/competitions/${competitionId}`);
                const comp = response.data.competition;
                setCompetition(comp);
                setFormData({
                    name: comp.name,
                    startTime: format(parseISO(comp.startTime), "yyyy-MM-dd'T'HH:mm"), // 格式化为 input datetime-local
                    endTime: format(parseISO(comp.endTime), "yyyy-MM-dd'T'HH:mm"),
                    questionIds: comp.questions.map(q => q._id),
                    userIds: comp.authorizedUsers.map(u => u._id),
                });
            } catch (err) {
                console.error(err);
                setError('无法加载比赛信息，请稍后再试。');
            } finally {
                setLoading(false);
            }
        };

        fetchCompetition();
    }, [competitionId]);

    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if (name === 'questionIds' || name === 'userIds') {
            const selectedValues = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData(prev => ({
                ...prev,
                [name]: selectedValues,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 验证时间逻辑
        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);
        if (isNaN(start) || isNaN(end)) {
            setError('开始时间和结束时间格式不正确。');
            return;
        }
        if (start >= end) {
            setError('开始时间必须早于结束时间。');
            return;
        }

        const updatedData = {
            name: formData.name,
            startTime: new Date(formData.startTime).toISOString(), // 转换为 UTC
            endTime: new Date(formData.endTime).toISOString(),
            questionIds: formData.questionIds,
            userIds: formData.userIds,
        };

        console.log('Submitting updated data:', updatedData);

        try {
            await api.put(`/admin/competitions/${competitionId}`, updatedData);
            setSuccess('比赛信息已成功更新。');
            setRedirect(true);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('更新比赛信息失败，请检查输入并重试。');
            }
        }
    };

    if (redirect) {
        return <Navigate to="/dashboard/competitions" replace />;
    }

    return (
        <Container className="mt-4">
            <h2>编辑比赛信息</h2>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">加载中...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Form onSubmit={handleSubmit}>
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form.Group className="mb-3" controlId="formCompetitionName">
                        <Form.Label>比赛名称</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="输入比赛名称"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formStartTime">
                        <Form.Label>开始时间</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEndTime">
                        <Form.Label>结束时间</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formQuestionIds">
                        <Form.Label>选择题目（按住 Ctrl 多选）</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            name="questionIds"
                            value={formData.questionIds}
                            onChange={handleChange}
                            required
                        >
                            {competition.questions.map(q => (
                                <option key={q._id} value={q._id}>{q.title}</option>
                            ))}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            按住 Ctrl 多选。
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formUserIds">
                        <Form.Label>授权用户（按住 Ctrl 多选）</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            name="userIds"
                            value={formData.userIds}
                            onChange={handleChange}
                            required
                        >
                            {competition.authorizedUsers.map(u => (
                                <option key={u._id} value={u._id}>{u.username}</option>
                            ))}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            按住 Ctrl 多选。
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="me-2">
                        更新比赛
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/dashboard/competitions')}>
                        取消
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default EditCompetition;