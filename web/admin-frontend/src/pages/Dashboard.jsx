// src/pages/Dashboard.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    );
};

export default Dashboard;