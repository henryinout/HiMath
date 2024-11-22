// src/pages/Results.jsx
import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Results = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert("您需要先登录！");
            navigate("/login");
        } else {
            fetchResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchResults = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/results', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResults(response.data);
        } catch (err) {
            setError('无法加载成绩，请稍后再试。');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-5">
            <h2>考试成绩</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>考试名称</th>
                        <th>分数</th>
                        <th>排名</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => (
                        <tr key={result.competitionId}>
                            <td>{result.competitionName}</td>
                            <td>{result.score}</td>
                            <td>{result.rank}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Results;