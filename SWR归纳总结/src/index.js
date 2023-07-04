import React from 'react';
import { createRoot } from 'react-dom/client';
import './public.css';
import styles from './index.less';
import Home from '@/pages/Home';
import User from '@/pages/User';

const App = () => {
  return (
    <div className={styles.root}>
      <Home />
      <User />
    </div>
  );
};

createRoot(document.querySelector('#app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
