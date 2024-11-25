// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    );
};

export default Layout;