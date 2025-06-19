

// import { useState, useEffect } from "react";

// const useTimer = (durationInSeconds, onEnd) => {
//   const [seconds, setSeconds] = useState(durationInSeconds);

//   useEffect(() => {
//     if (seconds <= 0) {
//       onEnd();
//       return;
//     }

//     const interval = setInterval(() => {
//       setSeconds(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [seconds, onEnd]);

//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

//   const percentage = ((durationInSeconds - seconds) / durationInSeconds) * 100;

//   return { seconds, formattedTime, percentage };
// };

// export default useTimer;


import { useState, useEffect, useRef } from "react";

const useTimer = (durationInSeconds, onEnd) => {
  const [seconds, setSeconds] = useState(durationInSeconds);
  const hasEnded = useRef(false); // Track if timer has ended

  useEffect(() => {
    if (seconds <= 0 && !hasEnded.current) {
      hasEnded.current = true; // Mark as ended
      onEnd(); // Call onEnd only once
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onEnd]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

  const percentage = ((durationInSeconds - seconds) / durationInSeconds) * 100;

  return { seconds, formattedTime, percentage };
};

export default useTimer;