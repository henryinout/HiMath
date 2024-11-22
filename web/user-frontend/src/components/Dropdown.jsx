// src/components/Dropdown.jsx
import React from "react";
import "./Dropdown.css"; // 可选：为组件添加独立样式

const Dropdown = ({ questions, onSelectQuestion }) => {
    return (
        <div className="dropdown-container">
            <button className="dropdown-btn btn btn-primary">
                选择题目 <span className="arrow-down">▼</span>
            </button>
            <div className="dropdown-menu">
                {Object.keys(questions).map((id) => (
                    <div
                        key={id}
                        className="menu-item"
                        onClick={() => onSelectQuestion(id)}
                    >
                        题目 {id}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;