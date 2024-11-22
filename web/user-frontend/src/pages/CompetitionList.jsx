// src/pages/CompetitionList.jsx

import React, { useState, useEffect } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
// import { Link } from 'react-router-dom'; // 移除未使用的 'Link' 导入
import { useNavigate } from 'react-router-dom';

const CompetitionList = () => {
    const [competitions, setCompetitions] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/competitions', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await res.json();
                setCompetitions(data);
            } catch (error) {
                console.error('Error fetching competitions:', error);
                alert('无法获取比赛列表，请稍后再试！');
            }
        };
        if (token) {
            fetchCompetitions();
        }
    }, [token]);

    const handleEnterCompetition = (competitionId) => {
        navigate(`/exam/${competitionId}`);
    };

    return (
        <Container>
            <h2>比赛列表</h2>
            {competitions.map(comp => (
                <Card key={comp._id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{comp.name}</Card.Title>
                        <Card.Text>{comp.description}</Card.Text>
                        <Card.Text>
                            开始时间: {new Date(comp.startTime).toLocaleString()}<br />
                            结束时间: {new Date(comp.endTime).toLocaleString()}
                        </Card.Text>
                        {comp.hasAccess ? (
                            <Button variant="primary" onClick={() => handleEnterCompetition(comp._id)}>
                                进入比赛
                            </Button>
                        ) : (
                            <Button variant="secondary" disabled>
                                无权限参与
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default CompetitionList;