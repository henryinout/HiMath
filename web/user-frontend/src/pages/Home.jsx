// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api'; // 使用 api.js 处理请求

const Home = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const response = await api.get('/competitions');
                // 过滤出 hasAccess 为 true 的比赛
                const accessibleCompetitions = response.data.filter(comp => comp.hasAccess);
                setCompetitions(accessibleCompetitions);
            } catch (err) {
                console.error(err);
                setError('无法加载比赛列表，请稍后再试。');
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitions();
    }, []);

    return (
        <Container className="mt-4">
            <h2>欢迎来到 HiMath</h2>
            <p>以下是您有权限参与的比赛列表：</p>

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
                    {competitions.map((competition) => (
                        <Col key={competition._id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{competition.name}</Card.Title>
                                    <Card.Text>
                                        开始时间：{new Date(competition.startTime).toLocaleString()} <br />
                                        结束时间：{new Date(competition.endTime).toLocaleString()}
                                    </Card.Text>
                                    <Button as={Link} to={`/competitions/${competition._id}`} variant="primary">
                                        进入比赛
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Home;