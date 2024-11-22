// src/components/QuestionCard.jsx

import React from 'react';
import { Card } from 'react-bootstrap';

const QuestionCard = ({ question }) => {
    if (!question) return null;

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{question.title}</Card.Title>
                <Card.Text>{question.content}</Card.Text>
                {/* 如果需要展示题目标签 */}
                {question.tags && question.tags.length > 0 && (
                    <div>
                        {question.tags.map(tag => (
                            <span key={tag} className="badge bg-secondary me-1">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default QuestionCard;