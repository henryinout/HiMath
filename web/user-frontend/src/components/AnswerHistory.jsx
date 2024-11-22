// src/components/AnswerHistory.jsx

import React from 'react';
import { ListGroup } from 'react-bootstrap';

const AnswerHistory = ({ history }) => {
    if (!history || history.length === 0) return <p>暂无答案提交记录。</p>;

    return (
        <div>
            <h4>提交记录</h4>
            <ListGroup>
                {history.map((ans, index) => (
                    <ListGroup.Item key={index}>
                        答案: {ans.answer} <br />
                        时间: {new Date(ans.timestamp).toLocaleString()}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default AnswerHistory;