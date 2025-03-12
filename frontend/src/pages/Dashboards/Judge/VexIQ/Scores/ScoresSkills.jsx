

// import { useState, useMemo } from "react";
// import { FaRedo, FaBullseye, FaTimes } from "react-icons/fa";

// const CalculatorSkills = ({ onCalculate, onClose, mode }) => {
//   const [switchCount, setSwitchCount] = useState(0);
//   const [goalCount, setGoalCount] = useState(0);

//   const getGoalPoints = (clearSwitch, goals) => {
//     let goalValue = mode === "auto" ? 6 : 4; 

//     if (clearSwitch === 4) goalValue = mode === "auto" ? 18 : 12;
//     else if (clearSwitch === 3) goalValue = mode === "auto" ? 14 : 10;
//     else if (clearSwitch === 2) goalValue = mode === "auto" ? 10 : 8;
    
//     return goalValue * goals;
//   };


//   const score = useMemo(() => {
//     return switchCount * (mode === "auto" ? 2 : 1) + getGoalPoints(switchCount, goalCount);
//   }, [switchCount, goalCount, mode]);

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
//           { label: "Switch", count: switchCount, setCount: setSwitchCount, icon: <FaRedo size={20} className="text-blue-500" /> },
//           { label: "Goal", count: goalCount, setCount: setGoalCount, icon: <FaBullseye size={20} className="text-green-500" /> }
//         ].map(({ label, count, setCount, icon }) => (
//           <div key={label} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3 shadow-sm">
//             <div className="flex items-center gap-2">
//               {icon}
//               <span className="font-semibold text-gray-700">{label}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCount(label === "Switch" ? Math.min(4, count + 1) : count + 1)}
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

// export default CalculatorSkills;

import { useState, useEffect, useMemo ,useRef} from "react";
import { FaRedo, FaBullseye, FaTimes, FaPlay, FaPause, FaSync } from "react-icons/fa";
import { BsSkipStartFill } from "react-icons/bs";
import { GiThreeBurningBalls } from "react-icons/gi";
import axios from "axios";
import Swal from "sweetalert2";


const CalculatorSkills = ({ onCalculate, onClose, mode,gameId }) => {
  // console.log(gameId);
   const [switchCount, setSwitchCount] = useState(0);
    const [goalCount, setGoalCount] = useState(0);
    const [passCount, setPassCount] = useState(0);
    const [remainingTime, setRemainingTime] = useState(60);
    const [gameActive, setGameActive] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const socketRef = useRef(null);
    const eventName = localStorage.getItem("selected_event_name");
    const [showControls, setShowControls] = useState(false);
    const token = localStorage.getItem("access_token");
  
 
  const getGoalPoints = (clearSwitch, goals) => {
    let goalValue = mode === "auto" ? 6 : 4;
    if (clearSwitch === 4) goalValue = mode === "auto" ? 18 : 12;
    else if (clearSwitch === 3) goalValue = mode === "auto" ? 14 : 10;
    else if (clearSwitch === 2) goalValue = mode === "auto" ? 10 : 8;
    return goalValue * goals;
  };

  const score = useMemo(() => {
    return switchCount * (mode === "auto" ? 2 : 1) + getGoalPoints(switchCount, goalCount);
  }, [switchCount, goalCount, mode]);

  const handleCalculate = () => {
   
    onCalculate(score || 0);
    onClose();
  };
// Establish WebSocket connection when the component mounts
  useEffect(() => {
    socketRef.current = new WebSocket(
      `ws://${process.env.REACT_APP_API_HOST}/ws/competition_event/${eventName}/game/${gameId}/`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "paused") {
        setGamePaused(true);
        return;
      }
      if (data.status === "resume") {
        setGamePaused(false);
        return;
      }
      if (data.remaining_time !== undefined) {
        setRemainingTime(Math.round(data.remaining_time));
        if (data.remaining_time <= 0) {
          setGameActive(false);
          setTimeUp(true);
        }
      }
    };

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("WebSocket connection closed");
      }
    };
  }, [eventName, gameId]);

  const startGame = () => {
    setGameActive(true);
    setGamePaused(false);
    setShowControls(true);
    setTimeUp(false);

    // Send a message to start the game via WebSocket
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({ action: "start_game", event_name: eventName, game_id: gameId })
      );
    }
  };

  const pauseGame = () => {
    if (!gameActive || gamePaused) return;
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({ action: "pause_game", event_name: eventName, game_id: gameId })
      );
    }
    setGamePaused(true);
  };

  const resumeGame = () => {
    if (!gameActive || !gamePaused) return;
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({ action: "resume_game", event_name: eventName, game_id: gameId })
      );
    }
    setGamePaused(false);
  };

  const restartGame = () => {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({ action: "restart_game", event_name: eventName, game_id: gameId })
      );
    }
    setRemainingTime(60);
    setGamePaused(false);
    setTimeUp(false);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Game Score</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

       {/* Score Display */}
        <div className="p-4 bg-gray-50">
          <div className="text-center text-2xl font-bold text-gray-800">
            Current Score: <span className="text-green-600">{score}</span>
          </div>
        </div>

        {/* Timer and Controls */}
                <div className="p-4">
                  <div className="flex justify-center space-x-4 mb-4">
                    {!showControls && (
                      <button
                        onClick={startGame}
                        disabled={gameActive}
                        className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaPlay size={18} />
                      </button>
                    )}
        
                    {showControls && (
                      <>
                        <button
                          onClick={pauseGame}
                          disabled={!gameActive || gamePaused}
                          className="bg-yellow-500 text-white p-3 rounded-full shadow-md hover:bg-yellow-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaPause size={18} />
                        </button>
                        <button
                          onClick={resumeGame}
                          disabled={!gamePaused}
                          className="bg-green-500 text-white p-3 rounded-full shadow-md hover:bg-green-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <BsSkipStartFill size={18} />
                        </button>
                        <button
                          onClick={restartGame}
                          disabled={!gameActive}
                          className="bg-red-500 text-white p-3 rounded-full shadow-md hover:bg-red-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaSync size={18} />
                        </button>
                      </>
                    )}
                  </div>
        
                  <div className="text-center text-lg font-bold text-red-600 bg-gray-100 p-2 rounded-lg shadow-sm">
                    {gamePaused
                      ? "Game Paused"
                      : timeUp
                      ? "Time's Up!"
                      : `Remaining Time: ${remainingTime} seconds`}
                  </div>
                </div>
       

        {/* Score Controls */}
         <div className="p-4">
        {[
          { label: "Switch", count: switchCount, setCount: setSwitchCount, icon: <FaRedo size={20} className="text-blue-500" /> },
          { label: "Goal", count: goalCount, setCount: setGoalCount, icon: <FaBullseye size={20} className="text-green-500" /> }
        ].map(({ label, count, setCount, icon }) => (
          <div key={label} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3 shadow-md">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-semibold text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCount(label === "Switch" ? Math.min(4, count + 1) : count + 1)}
                 disabled={!gameActive} // Disable if the game is not active
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="text-lg font-bold">{count}</span>
              <button
                onClick={() => setCount(Math.max(0, count - 1))}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!gameActive}
              >
                -
              </button>
            </div>
          </div>
        ))}

      </div>

         {/* Submit Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleCalculate}
            disabled={gameActive || !timeUp} // Disable if the game is active or time is not up
            className="w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {timeUp ? "Calculate & Submit Score" : "Submit Score (Time's Up)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorSkills;
