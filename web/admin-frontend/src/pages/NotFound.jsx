// src/pages/NotFound.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Container className="mt-5 text-center">
            <h1>404</h1>
            <p>页面未找到。</p>
            <Link to="/dashboard">返回首页</Link>
        </Container>
    );
};

export default NotFound;