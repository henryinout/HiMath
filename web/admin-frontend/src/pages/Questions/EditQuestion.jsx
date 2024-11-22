// src/pages/Questions/EditQuestion.jsx
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [answer, setAnswer] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get('/admin/questions');
                const question = response.data.find(q => q._id === id);
                if (question) {
                    setTitle(question.title);
                    setContent(question.content);
                    setAnswer(question.answer);
                    setTags(question.tags.join(', '));
                } else {
                    setError('题目未找到。');
                }
            } catch (err) {
                setError(err.response?.data?.error || '获取题目信息失败。');
            }
        };
        fetchQuestion();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        try {
            await api.put(`/admin/questions/${id}`, { title, content, answer, tags: tagsArray });
            navigate('/dashboard/questions');
        } catch (err) {
            setError(err.response?.data?.error || '更新题目失败。');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <h3>编辑题目</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title" className="mb-3">
                    <Form.Label>标题</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="输入题目标题"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="content" className="mb-3">
                    <Form.Label>内容</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="输入题目内容"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="answer" className="mb-3">
                    <Form.Label>答案</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="输入题目答案"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="tags" className="mb-3">
                    <Form.Label>标签（逗号分隔）</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="如：代数, 几何, 微积分"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="me-2">
                    更新
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard/questions')}>
                    取消
                </Button>
            </Form>
        </Container>
    );
};

export default EditQuestion;