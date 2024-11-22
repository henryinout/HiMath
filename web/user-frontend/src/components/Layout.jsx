// src/components/Layout.jsx

import React from 'react';
import AppNavbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <AppNavbar />
            <Outlet />
        </>
    );
};

export default Layout;