

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
  const hasEnded = useRef(false); 
  const intervalRef = useRef();

  useEffect(() => {
    if (seconds <= 0 && !hasEnded.current) {
      hasEnded.current = true;
      onEnd();
      return;
    }
  
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { // عند الوصول إلى 1، أوقف العد
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(intervalRef.current);
  }, [seconds, onEnd]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

  const percentage = ((durationInSeconds - seconds) / durationInSeconds) * 100;

  return { seconds, formattedTime, percentage };
};

export default useTimer;