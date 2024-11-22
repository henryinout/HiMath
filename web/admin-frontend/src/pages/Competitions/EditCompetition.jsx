// src/pages/Admin/EditCompetition.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Spinner, Alert, Form, Button } from 'react-bootstrap';
import AppNavbar from '../../components/Navbar';
import api from '../../services/api';

const EditCompetition = () => {
    const { competitionId } = useParams();
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [redirect, setRedirect] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        endTime: '',
        questionIds: '',
        userIds: '',
    });

    useEffect(() => {
        const fetchCompetition = async () => {
            try {
                const response = await api.get(`/competitions/${competitionId}`);
                setCompetition(response.data.competition);
                setFormData({
                    name: response.data.competition.name,
                    startTime: response.data.competition.startTime.slice(0, 16), // 格式化为 input datetime-local
                    endTime: response.data.competition.endTime.slice(0, 16),
                    questionIds: response.data.competition.questions.join(','),
                    userIds: response.data.competition.authorizedUsers.join(','),
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
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 处理输入数据
        const updatedData = {
            name: formData.name,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            questionIds: formData.questionIds.split(',').map(id => id.trim()),
            userIds: formData.userIds.split(',').map(id => id.trim()),
        };

        try {
            await api.put(`/admin/competitions/${competitionId}`, updatedData);
            setSuccess('比赛信息已成功更新。');
            // 可选择重定向或其他操作
        } catch (err) {
            console.error(err);
            setError('更新比赛信息失败，请检查输入并重试。');
        }
    };

    if (redirect) {
        return <Navigate to="/competitions" replace />;
    }

    return (
        <>
            <AppNavbar />
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
                            <Form.Label>题目 IDs</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="输入题目 IDs，用逗号分隔"
                                name="questionIds"
                                value={formData.questionIds}
                                onChange={handleChange}
                                required
                            />
                            <Form.Text className="text-muted">
                                例如: 60d5f484f8d2e30a5c8e4b1a,60d5f484f8d2e30a5c8e4b1b
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUserIds">
                            <Form.Label>授权用户 IDs</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="输入用户 IDs，用逗号分隔"
                                name="userIds"
                                value={formData.userIds}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-muted">
                                仅管理员可以设置，留空表示所有用户。
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            更新比赛
                        </Button>
                    </Form>
                )}
            </Container>
        </>
    );
};

export default EditCompetition;