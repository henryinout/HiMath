// src/pages/Questions/AddQuestion.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddQuestion = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [answer, setAnswer] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        try {
            await api.post('/admin/questions', { title, content, answer, tags: tagsArray });
            navigate('/dashboard/questions');
        } catch (err) {
            setError(err.response?.data?.error || '添加题目失败。');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <h3>添加题目</h3>
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
                    提交
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard/questions')}>
                    取消
                </Button>
            </Form>
        </Container>
    );
};

export default AddQuestion;