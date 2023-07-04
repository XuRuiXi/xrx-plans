import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    console.log('home');
    return () => {
      console.log('home unmount');
    };
  }, []);
  return (
    <div>
      home
    </div>
  );
};

export default Home;
