import React from 'react';
import useCountdown from '@/hooks/useCountdown';

const CountDown = () => {
  const {
    timeLeft,
    stop,
    reStart,
    reset,
  } = useCountdown({
    initialTime: 5,
    fixed: 1,
    auto: true,
    callback: (num) => {
      console.log('done', num);
    }
  });
  return (
    <div>
      倒计时：{timeLeft}
      <button style={{ display: 'block' }}>
        <span onClick={stop}>停止</span>
      </button>
      <button style={{ display: 'block' }}>
        <span onClick={reStart}>重启</span>
      </button>
      <button style={{ display: 'block' }}>
        <span onClick={reset}>重置</span>
      </button>
    </div>
  );
};

export default CountDown;
