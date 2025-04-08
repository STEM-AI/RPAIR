import { useState, useEffect } from 'react';

const useTimer = (initialTime, onTimeEnd) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeEnd]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);
  const reset = (newTime) => {
    setIsRunning(false);
    setTimeLeft(newTime || initialTime);
  };

  return { timeLeft, formattedTime: formatTime(timeLeft), pause, resume, reset };
};

export default useTimer;