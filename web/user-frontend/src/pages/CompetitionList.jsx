// src/pages/CompetitionList.jsx

import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // 使用 api.js 处理请求

const CompetitionList = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const res = await api.get('/competitions');
                setCompetitions(res.data);
            } catch (error) {
                console.error('Error fetching competitions:', error);
                setError('无法获取比赛列表，请稍后再试！');
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            fetchCompetitions();
        }
    }, [token]);

    const handleEnterCompetition = (competitionId) => {
        navigate(`/competitions/${competitionId}`);
    };

    return (
        <Container className="mt-4">
            <h2>比赛列表</h2>
            <p>以下是您有权限参与的比赛：</p>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">加载中...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : competitions.length === 0 ? (
                <Alert variant="info">目前没有您有权限参与的比赛。</Alert>
            ) : (
                <Row>
                    {competitions.map(comp => (
                        <Col key={comp._id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{comp.name}</Card.Title>
                                    <Card.Text>{comp.description}</Card.Text>
                                    <Card.Text>
                                        开始时间: {new Date(comp.startTime).toLocaleString()}<br />
                                        结束时间: {new Date(comp.endTime).toLocaleString()}
                                    </Card.Text>
                                    {comp.hasAccess ? (
                                        <Button as={Link} to={`/competitions/${comp._id}`} variant="primary">
                                            进入比赛
                                        </Button>
                                    ) : (
                                        <Button variant="secondary" disabled>
                                            无权限参与
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default CompetitionList;