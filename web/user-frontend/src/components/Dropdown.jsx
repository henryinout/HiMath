// src/components/Dropdown.jsx

import React from 'react';
import { Form } from 'react-bootstrap';

const Dropdown = ({ questions, onSelectQuestion, selectedQuestionId }) => {
    const handleChange = (e) => {
        onSelectQuestion(e.target.value);
    };

    return (
        <Form.Group controlId="questionDropdown" className="mb-3">
            <Form.Label>选择题目</Form.Label>
            <Form.Control as="select" value={selectedQuestionId || ''} onChange={handleChange}>
                {questions.map(question => (
                    <option key={question._id} value={question._id}>
                        {question.title}
                    </option>
                ))}
            </Form.Control>
        </Form.Group>
    );
};

export default Dropdown;