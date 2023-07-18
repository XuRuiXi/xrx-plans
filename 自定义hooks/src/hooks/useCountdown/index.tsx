import { useState, useEffect, useRef, useCallback } from 'react';


interface CountdownProps {
  initialTime?: number;
  fixed?: 0 | 1 | 2 | 3;
  auto?: boolean;
  callback?: (num: number | string) => void;
}

interface CountdownReturn {
  timeLeft: number | string;
  stop: () => void;
  reStart: () => void;
  reset: () => void;
}

const Countdown = ({
  initialTime = 10,
  fixed = 0,
  auto = true,
  callback = () => {},
}: CountdownProps): CountdownReturn => {
  // 显示的时间
  const [timeLeft, setTimeLeft] = useState<number | string>(initialTime.toFixed(fixed));
  // 倒计时初始时间
  const initialTimeRef = useRef<number>(initialTime);
  // 用来计算的初始化当前时间
  const now = useRef(Date.now());
  // 用来存储动画的id
  const animateRef = useRef(0);


  const run = useCallback(() => {
    const timePassed = (Date.now() - now.current) / 1000;
    // 如果是取整，那么就要向上取整，如果是保留小数，怎么直接toFixed就行了
    let left: number | string = 0;
    if (fixed === 0) left = Math.ceil(Number(initialTimeRef.current) - timePassed); 
    if (fixed > 0) left = (Number(initialTimeRef.current) - timePassed).toFixed(fixed);

    // 当时间小于等于0时，停止动画同事设置为0
    if (Number(left) <= 0) {
      setTimeLeft((0).toFixed(fixed));
      callback(0);
      return;
    }

    setTimeLeft(left);
    animateRef.current = requestAnimationFrame(run);
  }, []);

  const stop = () => {
    cancelAnimationFrame(animateRef.current);
    callback(timeLeft);
  };

  const reStart = () => {
    /* 
      重新开始的时候，需要重新设置设置now为当前时间，上一次的时间为倒计时时间
    */
    now.current = Date.now();
    initialTimeRef.current = Number(timeLeft);
    animateRef.current = requestAnimationFrame(run);
  };

  const reset = () => {
    /* 
      重置的时候，需要重新设置设置now为当前时间，倒计时时间为初始时间
    */
    cancelAnimationFrame(animateRef.current);
    now.current = Date.now();
    initialTimeRef.current = initialTime;
    setTimeLeft(initialTime.toFixed(fixed));
    auto && (animateRef.current = requestAnimationFrame(run));
  };

  useEffect(() => {
    auto && (animateRef.current = requestAnimationFrame(run));
    return () => {
      cancelAnimationFrame(animateRef.current);
    };
  }, []);
  

  return {
    timeLeft,
    stop,
    reStart,
    reset,
  };
};

export default Countdown;