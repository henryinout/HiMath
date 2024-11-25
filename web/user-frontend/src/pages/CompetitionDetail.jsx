// src/pages/CompetitionDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Spinner, Alert, Card, Button, ListGroup } from 'react-bootstrap';
import api from '../services/api';

const CompetitionDetail = () => {
    const { competitionId } = useParams();
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hasAccess, setHasAccess] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const fetchCompetitionDetail = async () => {
            try {
                const response = await api.get(`/competitions/${competitionId}`);
                setCompetition(response.data.competition);
                setHasAccess(response.data.hasAccess);
                if (!response.data.hasAccess) {
                    setError('您没有权限参与此比赛。');
                }
            } catch (err) {
                console.error(err);
                setError('无法加载比赛详细信息，请稍后再试。');
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitionDetail();
    }, [competitionId]);

    const handleEnterCompetition = () => {
        // 导航到考试页面
        setRedirect(true);
    };

    if (redirect) {
        // 修正重定向路径，确保与路由配置匹配
        return <Navigate to={`/exam/${competitionId}`} replace />;
    }

    return (
        <Container className="mt-4">
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">加载中...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Card>
                    <Card.Body>
                        <Card.Title>{competition.name}</Card.Title>
                        <Card.Text>
                            开始时间：{new Date(competition.startTime).toLocaleString()} <br />
                            结束时间：{new Date(competition.endTime).toLocaleString()}
                        </Card.Text>
                        <hr />
                        <h4>题目列表</h4>
                        <ListGroup variant="flush">
                            {competition.questions.map((question, index) => (
                                <ListGroup.Item key={question._id}>
                                    <strong>题目 {index + 1}:</strong> {question.title}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <hr />
                        <Button
                            variant="primary"
                            onClick={handleEnterCompetition}
                            disabled={!hasAccess}
                        >
                            {hasAccess ? "开始考试" : "无权限参与"}
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default CompetitionDetail;