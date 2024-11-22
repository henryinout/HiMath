// src/components/AnswerHistory.jsx
import React from "react";

const AnswerHistory = ({ history }) => {
    if (!history || history.length === 0) {
        return <p>暂无提交记录。</p>;
    }

    return (
        <div className="answer-history">
            <h6>提交记录：</h6>
            <ul className="list-group">
                {history.map((entry, index) => (
                    <li key={index} className="list-group-item">
                        <strong>答案：</strong> {entry.answer} <br />
                        <strong>时间：</strong> {new Date(entry.timestamp).toLocaleTimeString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnswerHistory;