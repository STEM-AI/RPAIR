// src/components/CircularTimer.jsx
import React from "react";
import  useTimer  from "../../hooks/UseTime/UseTimer";

const CircularTimer = ({ duration, onEnd, current, total }) => {
  const { seconds, formattedTime, percentage } = useTimer(duration, onEnd);

  const strokeDasharray = 283; // 2 * π * r (r = 45)
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

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

