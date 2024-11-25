// src/components/Navbar.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'; // 使用命名导入

const Navbar = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [tokenExpiry, setTokenExpiry] = useState('');

    // 使用 useCallback 包裹 handleLogout，确保其稳定性并符合 ESLint 规则
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username || '未知用户');

                // `exp` 是以秒为单位的时间戳
                if (decoded.exp) {
                    const expiryDate = new Date(decoded.exp * 1000);
                    setTokenExpiry(expiryDate.toLocaleString());
                } else {
                    setTokenExpiry('未知');
                }

                // 检查 Token 是否已过期
                const currentTime = Date.now() / 1000; // 当前时间，单位为秒
                if (decoded.exp && decoded.exp < currentTime) {
                    // Token 已过期
                    handleLogout();
                }
            } catch (error) {
                console.error('Invalid token:', error);
                setUsername('未知用户');
                setTokenExpiry('未知');
            }
        } else {
            setUsername('未登录');
            setTokenExpiry('N/A');
        }
    }, [handleLogout]); // 添加 handleLogout 作为依赖

    return (
        <BootstrapNavbar bg="light" expand="lg">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/dashboard">管理员后台</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard/users">用户管理</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/questions">题目管理</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/competitions">竞赛管理</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto align-items-center">
                        <Nav.Item className="me-3">
                            <span>欢迎, {username}</span>
                        </Nav.Item>
                        <Nav.Item className="me-3">
                            <span>Token 过期时间: {tokenExpiry}</span>
                        </Nav.Item>
                        <Button variant="outline-danger" onClick={handleLogout}>退出</Button>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;