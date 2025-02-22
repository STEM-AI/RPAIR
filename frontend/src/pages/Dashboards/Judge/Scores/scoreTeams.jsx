

// import { useState, useMemo } from "react";
// import { FaRedo, FaBullseye, FaTimes } from "react-icons/fa";
// import { GiThreeBurningBalls } from "react-icons/gi";

// const PassCalculator = ({ onCalculate, onClose }) => {
//   const [switchCount, setSwitchCount] = useState(0);
//   const [goalCount, setGoalCount] = useState(0);
//   const [passCount, setPassCount] = useState(0);

//   // حساب نقاط التمريرات حسب عدد المفاتيح الممسوحة
//   const getPassPoints = (switches) => {
//     switch (switches) {
//       case 4: return 12;
//       case 3: return 10;
//       case 2: return 8;
//       case 1: return 4;
//       default: return 1; // تمريرة بدون مفاتيح ممسوحة
//     }
//   };

//   // حساب النقاط الكلية
//   const score = useMemo(() => {
//     return (
//       goalCount * 1 + // كل هدف = 1 نقطة
//       switchCount * 1 + // كل مفتاح ممسوح = 1 نقطة
//       passCount * getPassPoints(switchCount) // حساب نقاط التمريرات
//     );
//   }, [switchCount, goalCount, passCount]);

//   const handleCalculate = () => {
//     onCalculate(score || 0);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="p-6 bg-white rounded-lg shadow-2xl max-w-md mx-auto relative">
//         <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={onClose}>
//           <FaTimes size={20} />
//         </button>

//         <div className="text-center text-xl font-bold text-gray-700 bg-gray-200 p-3 rounded-lg shadow-md mb-4">
//           Current Score: <span className="text-green-600">{score}</span>
//         </div>

//         {[
//           { label: "Switch", count: switchCount, setCount: setSwitchCount, icon: <FaRedo size={20} className="text-blue-500" />, max: 4 },
//           { label: "Goal", count: goalCount, setCount: setGoalCount, icon: <FaBullseye size={20} className="text-green-500" /> },
//           { label: "Pass", count: passCount, setCount: setPassCount, icon: <GiThreeBurningBalls size={20} className="text-orange-500" /> }
//         ].map(({ label, count, setCount, icon, max }) => (
//           <div key={label} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3 shadow-sm">
//             <div className="flex items-center gap-2">
//               {icon}
//               <span className="font-semibold text-gray-700">{label}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCount(max ? Math.min(max, count + 1) : count + 1)}
//                 className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
//               >
//                 +
//               </button>
//               <span className="text-lg font-bold">{count}</span>
//               <button
//                 onClick={() => setCount(Math.max(0, count - 1))}
//                 className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
//               >
//                 -
//               </button>
//             </div>
//           </div>
//         ))}

//         <button
//           onClick={handleCalculate}
//           className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 transition text-lg font-semibold shadow-md"
//         >
//           Calculate Score
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PassCalculator;

// import { useState, useEffect, useMemo } from "react";
// import { FaRedo, FaBullseye, FaTimes, FaPlay } from "react-icons/fa";
// import { GiThreeBurningBalls } from "react-icons/gi";

// const ScoreTeams = ({ onCalculate, onClose }) => {
//   const [switchCount, setSwitchCount] = useState(0);
//   const [goalCount, setGoalCount] = useState(0);
//   const [passCount, setPassCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [timerActive, setTimerActive] = useState(false);

//   useEffect(() => {
//     if (timerActive && timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeLeft === 0) {
//       setTimerActive(false);
//     }
//   }, [timeLeft, timerActive]);

//   const getPassPoints = (switches) => {
//     switch (switches) {
//       case 4: return 12;
//       case 3: return 10;
//       case 2: return 8;
//       case 1: return 4;
//       default: return 1;
//     }
//   };

//   const score = useMemo(() => {
//     return (
//       goalCount * 1 +
//       switchCount * 1 +
//       passCount * getPassPoints(switchCount)
//     );
//   }, [switchCount, goalCount, passCount]);

//   const handleCalculate = () => {
//     onCalculate(score || 0);
//     onClose();
//   };

//   const startTimer = () => {
//     setTimeLeft(60);
//     setTimerActive(true);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="p-8 bg-white rounded-lg shadow-2xl max-w-lg w-full relative">
//         <button
//           className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
//           onClick={onClose}
//         >
//           <FaTimes size={24} />
//         </button>

//         <div className="text-center text-2xl font-bold text-gray-700 bg-gray-200 p-4 rounded-lg shadow-md mb-5">
//           Current Score: <span className="text-green-600">{score}</span>
//         </div>

//         {!timerActive ? (
//           <button
//             onClick={startTimer}
//             className="w-full bg-blue-500 text-white py-3 rounded-lg text-xl font-semibold shadow-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
//           >
//             <FaPlay size={20} /> Start
//           </button>
//         ) : (
//           <div className="text-center text-xl font-bold text-red-600 bg-gray-100 p-3 rounded-lg shadow-sm mb-4">
//             Time Left: {timeLeft}s
//           </div>
//         )}

//         {[
//           { label: "Switch", count: switchCount, setCount: setSwitchCount, icon: <FaRedo size={24} className="text-blue-500" />, max: 4 },
//           { label: "Goal", count: goalCount, setCount: setGoalCount, icon: <FaBullseye size={24} className="text-green-500" /> },
//           { label: "Pass", count: passCount, setCount: setPassCount, icon: <GiThreeBurningBalls size={24} className="text-orange-500" /> }
//         ].map(({ label, count, setCount, icon, max }) => (
//           <div key={label} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-4 shadow-md text-xl">
//             <div className="flex items-center gap-3">
//               {icon}
//               <span className="font-semibold text-gray-700">{label}</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setCount(max ? Math.min(max, count + 1) : count + 1)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-lg font-bold"
//                 disabled={!timerActive}
//               >
//                 +
//               </button>
//               <span className="text-2xl font-bold">{count}</span>
//               <button
//                 onClick={() => setCount(Math.max(0, count - 1))}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-lg font-bold"
//                 disabled={!timerActive}
//               >
//                 -
//               </button>
//             </div>
//           </div>
//         ))}

//         <button
//           onClick={handleCalculate}
//           className="w-full bg-green-500 text-white py-3 rounded-lg text-xl font-semibold shadow-md hover:bg-green-600 transition mt-4"
//           disabled={timerActive}
//         >
//           Calculate Score
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ScoreTeams;

import { useState, useEffect, useMemo } from "react";
import { FaRedo, FaBullseye, FaTimes, FaPlay, FaPause, FaSync } from "react-icons/fa";
import { GiThreeBurningBalls } from "react-icons/gi";

const ScoreTeams = ({ onCalculate, onClose }) => {
  const [switchCount, setSwitchCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (timerActive && !paused && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, timerActive, paused]);

  const getPassPoints = (switches) => {
    switch (switches) {
      case 4: return 12;
      case 3: return 10;
      case 2: return 8;
      case 1: return 4;
      default: return 1;
    }
  };

  const score = useMemo(() => {
    return (
      goalCount * 1 +
      switchCount * 1 +
      passCount * getPassPoints(switchCount)
    );
  }, [switchCount, goalCount, passCount]);

  const handleCalculate = () => {
    if (!timerActive && timeLeft === 60) {
      alert("⏳ Please start the timer first before calculating the score!");
      return;
    }
    onCalculate(score || 0);
    onClose();
  };

  const startTimer = () => {
    setTimerActive(true);
    setPaused(false);
  };

  const pauseTimer = () => {
    setPaused(!paused);
  };

  const restartTimer = () => {
    setTimeLeft(60);
    setTimerActive(true);
    setPaused(false);
    setSwitchCount(0);
    setGoalCount(0);
    setPassCount(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-2xl max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center text-xl font-bold text-gray-700 bg-gray-200 p-3 rounded-lg shadow-md mb-4">
          Current Score: <span className="text-green-600">{score}</span>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          {!timerActive ? (
            <button
              onClick={startTimer}
              className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition"
            >
              <FaPlay size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={pauseTimer}
                className="bg-yellow-500 text-white p-3 rounded-full shadow-md hover:bg-yellow-600 transition"
              >
                {paused ? <FaPlay size={18} /> : <FaPause size={18} />}
              </button>
              <button
                onClick={restartTimer}
                className="bg-red-500 text-white p-3 rounded-full shadow-md hover:bg-red-600 transition"
              >
                <FaSync size={18} />
              </button>
            </>
          )}
        </div>

        <div className="text-center text-lg font-bold text-red-600 bg-gray-100 p-2 rounded-lg shadow-sm mb-3">
          Time Left: {timeLeft}s
        </div>

        {[
          { label: "Switch", count: switchCount, setCount: setSwitchCount, icon: <FaRedo size={20} className="text-blue-500" />, max: 4 },
          { label: "Goal", count: goalCount, setCount: setGoalCount, icon: <FaBullseye size={20} className="text-green-500" /> },
          { label: "Pass", count: passCount, setCount: setPassCount, icon: <GiThreeBurningBalls size={20} className="text-orange-500" /> }
        ].map(({ label, count, setCount, icon, max }) => (
          <div key={label} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3 shadow-md text-lg">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-semibold text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCount(max ? Math.min(max, count + 1) : count + 1)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-lg font-bold"
                disabled={!timerActive || paused}
              >
                +
              </button>
              <span className="text-xl font-bold">{count}</span>
              <button
                onClick={() => setCount(Math.max(0, count - 1))}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-lg font-bold"
                disabled={!timerActive || paused}
              >
                -
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleCalculate}
          className="w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 transition mt-3"
          disabled={timeLeft === 60}
        >
          Calculate Score
        </button>
      </div>
    </div>
  );
};

export default ScoreTeams;
