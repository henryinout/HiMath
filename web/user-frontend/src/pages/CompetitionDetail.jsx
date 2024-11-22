// src/pages/CompetitionDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api'; // 假设您已经创建了 api.js 来处理 API 请求

const CompetitionDetail = () => {
    const { competitionId } = useParams();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompetitionDetail = async () => {
            try {
                const response = await api.get(`/competitions/${competitionId}`);
                setCompetition(response.data);
            } catch (err) {
                console.error(err);
                setError('无法加载比赛详情，请稍后再试。');
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitionDetail();
    }, [competitionId]);

    const handleStartExam = () => {
        navigate(`/exam/${competitionId}`);
    };

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

    if (!competition) {
        return (
            <Container className="mt-4">
                <Alert variant="info">没有找到该比赛。</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <Card.Title>{competition.name}</Card.Title>
                    <Card.Text>{competition.description}</Card.Text>
                    <Card.Text>
                        开始时间：{new Date(competition.startTime).toLocaleString()} <br />
                        结束时间：{new Date(competition.endTime).toLocaleString()}
                    </Card.Text>
                    <Button variant="primary" onClick={handleStartExam}>
                        开始考试
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CompetitionDetail;