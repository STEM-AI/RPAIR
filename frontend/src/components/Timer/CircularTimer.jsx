// src/components/CircularTimer.jsx
import React, { useEffect } from "react";

const CircularTimer = ({ duration,remainingTime, onEnd, current, total }) => {

 const progress = (remainingTime / duration) * 100;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedTime = formatTime(remainingTime);
   const strokeDasharray = 283; // 2 * π * r (r = 45)
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;
  useEffect(() => {
    if (remainingTime <= 0 && onEnd) {
      onEnd();
    }
  }, [remainingTime, onEnd]);
  
   return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="#fb923c"
          strokeWidth="10"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-black">
        <span className="text-xl font-bold">{formattedTime}</span>
        <span className="text-sm text-gray-100">{`${current}/${total}`}</span>
      </div>
    </div>
  );
};

export default CircularTimer;