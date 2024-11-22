// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap 样式
import './styles/styles.css'; // 引入自定义样式
import App from './App'; // 引入主应用组件

// 创建根元素并渲染应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);