import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Link to="/countdown">倒计时</Link>
      <br />
      <Link to="/user">用户</Link>
    </div>
  );
};

export default Home;
