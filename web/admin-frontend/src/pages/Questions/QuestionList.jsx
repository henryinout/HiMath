// src/pages/Questions/QuestionList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');

    const fetchQuestions = async () => {
        try {
            const response = await api.get('/admin/questions');
            setQuestions(response.data);
        } catch (err) {
            setError(err.response?.data?.error || '获取题目列表失败。');
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('确定要删除该题目吗？')) return;
        try {
            await api.delete(`/admin/questions/${id}`);
            setQuestions(questions.filter(q => q._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || '删除题目失败。');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>题目管理</h3>
                <Button as={Link} to="/dashboard/questions/add" variant="primary">添加题目</Button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>标题</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map(question => (
                        <tr key={question._id}>
                            <td>{question.title}</td>
                            <td>{new Date(question.createdAt).toLocaleString()}</td>
                            <td>
                                <Button as={Link} to={`/dashboard/questions/edit/${question._id}`} variant="warning" size="sm" className="me-2">
                                    编辑
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(question._id)}>
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

export default QuestionList;