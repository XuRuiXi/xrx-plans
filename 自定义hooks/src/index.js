import React from 'react';
import { createRoot } from 'react-dom/client';
import './public.css';
import BaseLayout from '../layout/BaseLayout';

import Home from '@/pages/Home';
import User from '@/pages/User';
import CountDown from '@/pages/CountDown';

// 设置路由
import { BrowserRouter, useRoutes, Navigate } from 'react-router-dom';

// 路由表
const routes = [
  {
    path: '/',
    element: <Navigate to="/home" />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/countDown',
    element: <CountDown />,
  },
  {
    path: '/user',
    element: <User />,
  },
];

const Pages = () => {
  const element = useRoutes(routes);
  return element;
};


createRoot(document.querySelector('#app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BaseLayout>
        <Pages />
      </BaseLayout>
    </BrowserRouter>
  </React.StrictMode>
);
