// src/components/Navbar.jsx

import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    // 获取用户信息（例如用户名），这里假设存储在 token 中
    const getUsername = () => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.username;
        } catch (e) {
            return null;
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">HiMath</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {token && (
                            <>
                                <Nav.Link as={Link} to="/competitions">比赛列表</Nav.Link>
                                <Nav.Link as={Link} to="/results">成绩查询</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {token ? (
                            <>
                                <Navbar.Text className="me-3">
                                    欢迎, {getUsername()}
                                </Navbar.Text>
                                <Nav.Link onClick={handleLogout}>登出</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">登录</Nav.Link>
                                <Nav.Link as={Link} to="/register">注册</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;