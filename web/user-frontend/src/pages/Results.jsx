// src/pages/Results.jsx

import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Table } from 'react-bootstrap';
import api from '../services/api'; // 假设您已经创建了 api.js 来处理 API 请求

const Results = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get('/results'); // 根据实际 API 调整
                setResults(response.data);
            } catch (err) {
                console.error(err);
                setError('无法加载成绩，请稍后再试。');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">加载中...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (results.length === 0) {
        return (
            <Container className="mt-4">
                <Alert variant="info">当前没有成绩可显示。</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2>考试成绩</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>比赛名称</th>
                        <th>得分</th>
                        <th>提交时间</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map(result => (
                        <tr key={result._id}>
                            <td>{result.competitionName}</td>
                            <td>{result.score}</td>
                            <td>{new Date(result.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Results;