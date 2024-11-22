import React from "react";

const QuestionCard = ({ question }) => {
    if (!question) {
        return <p>请选择一个题目。</p>;
    }

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{question.title}</h5>
                <p className="card-text">{question.content}</p>
            </div>
        </div>
    );
};

export default QuestionCard;