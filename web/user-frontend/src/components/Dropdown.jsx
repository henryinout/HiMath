// src/components/Dropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import './Dropdown.css'; // 导入自定义样式
import PropTypes from 'prop-types';

const Dropdown = ({ questions, onSelectQuestion, selectedQuestionId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 切换菜单的展开/收起状态
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // 点击菜单项时选择题目并关闭菜单
    const handleSelect = (questionId) => {
        onSelectQuestion(questionId);
        setIsOpen(false);
    };

    // 点击菜单外部时关闭菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <button
                className={`custom-dropdown-toggle ${isOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls="dropdown-menu"
            >
                选择题目
                <span className={`arrow ${isOpen ? 'up' : 'down'}`}></span>
            </button>
            <div className={`dropdown-menu ${isOpen ? 'show' : ''}`} id="dropdown-menu">
                {questions && questions.length > 0 ? (
                    <div className="dropdown-items">
                        {questions.map((question, index) => (
                            <div
                                key={question._id}
                                className={`dropdown-item ${
                                    selectedQuestionId === question._id ? 'selected' : ''
                                }`}
                                onClick={() => handleSelect(question._id)}
                            >
                                {index + 1}. {question.title}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="dropdown-item disabled">暂无题目</div>
                )}
            </div>
        </div>
    );
};

Dropdown.propTypes = {
    questions: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSelectQuestion: PropTypes.func.isRequired,
    selectedQuestionId: PropTypes.string,
};

export default Dropdown;