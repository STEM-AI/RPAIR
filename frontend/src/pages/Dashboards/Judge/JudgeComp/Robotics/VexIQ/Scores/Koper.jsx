import React, { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { FaRedo, FaBullseye, FaTimes, FaPlay, FaPause, FaSync, FaPlus, FaMinus } from "react-icons/fa";
import { BsSkipStartFill } from "react-icons/bs";
import { GiThreeBurningBalls } from "react-icons/gi";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "../../../../../../../components/Alert/Alert";
import useSound from 'use-sound';

const Koper = ({ onCalculate, onClose, gameId, eventName ,eventId}) => {
  const [remainingTime, setRemainingTime] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const socketRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const token = localStorage.getItem("access_token");
  const prevTimeRef = useRef(remainingTime);

  // Counters
  const [cubeCount, setCubeCount] = useState(0);
  const [firajCount, setFirajCount] = useState(0);
  const [doubleGroupCount, setDoubleGroupCount] = useState(0);
  const [tripleGroupCount, setTripleGroupCount] = useState(0);
  const [circlePlayCount, setCirclePlayCount] = useState(0);
  const [unlockedCircles, setUnlockedCircles] = useState(0);

  const [playStart] = useSound('/sounds/Start.MP3', { volume: 1 });
  const [playEnd] = useSound('/sounds/End.mp3', { volume: 1 });
  const [playMiddle] = useSound('/sounds/Middle.MP3', { volume: 1 });

  // Calculate unlocked circles
  useEffect(() => {
    const totalUnlocks = firajCount + doubleGroupCount + tripleGroupCount;
    setUnlockedCircles(Math.min(totalUnlocks * 2, 6));
  }, [firajCount, doubleGroupCount, tripleGroupCount]);

  // Reset circle plays when unlocks drop below current count
  useEffect(() => {
    if (circlePlayCount > 0 && unlockedCircles < circlePlayCount ) {
      setCirclePlayCount(0);
    }
  }, [unlockedCircles, circlePlayCount]);

  const score = useMemo(() => {
    let totalScore = 0;
    totalScore += cubeCount;
    totalScore += doubleGroupCount * 10;
    totalScore += tripleGroupCount * 15;
    
        let circlePoints = 0;
    if (firajCount > 0) circlePoints = 2;
    if (doubleGroupCount > 0) circlePoints = 4;
    if (tripleGroupCount > 0) circlePoints = 6;
    
    totalScore += circlePlayCount * circlePoints ;
    
    return totalScore;
  }, [cubeCount, firajCount, doubleGroupCount, tripleGroupCount, circlePlayCount]);

  const handleCalculateAndSubmit = async () => {
    if (score === 0) {
      Alert.warning({
        title: 'Score is Zero',
        text: 'Are you sure you want to submit a score of zero?',
        confirmText: 'Yes, Submit',
        cancelText: 'Cancel',
        onConfirm: () => submitScore(),
      });
      return;
    }
    
    submitScore();
  };
  
  const submitScore = async () => {
    Alert.confirm({
      title: 'Submit Final Score?',
      html: `<p>You're about to submit your final score of <strong>${score}</strong> points.</p>`,
      confirmText: 'Confirm Submission',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/game/${gameId}/set-game-score/`,
            {
              event_id: eventId,
              score: score,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200 || response.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Score submitted successfully!",
              showConfirmButton: true,
              confirmButtonColor: "#28a745" 
            });
            EndGame();
            onCalculate(score);
            onClose();
          } else {
            throw new Error("Failed to submit score");
          }
        } catch (error) {
          console.error("Submission error:", error);
          Swal.fire("Error", "Failed to submit score", "error");
        }
      },
      onCancel: () => {
        Swal.fire('Cancelled', 'Submission was cancelled', 'info');
      }
    }); 
  };

  // WebSocket connection
  useEffect(() => {
    if (!eventName || !gameId) {
      Alert.error({
        title: "Missing Data",
        text: "Event name or Game ID is missing. Please check the configuration.",
      });
      return;
    }
    
    socketRef.current = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/game/${gameId}/`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "started") {
        setGameActive(true);
        setTimeUp(false);
      }
      if (data.remaining_time <= 0) {
        setGameActive(false);
        setTimeUp(true);
      }
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
    
    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [eventName, gameId]);

  const startGame = () => {
    playStart();
    setGameActive(true);
    setGamePaused(false);
    setShowControls(true);
    setTimeUp(false);

    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({ action: "start_game", event_name: eventName, game_id: gameId })
      );
    }
  };
  
  const EndGame = () => {
    setGameActive(false);
    setShowControls(false);
    setTimeUp(true);

    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({ action: "end_game", event_name: eventName, game_id: gameId })
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
    Alert.confirm({
      title: 'Restart Game?',
      html: 'This will reset all counters and the timer!',
      confirmText: 'Confirm Restart',
      cancelText: 'Cancel',
      onConfirm: () => {
        if (socketRef.current) {
          socketRef.current.send(
            JSON.stringify({ 
              action: "restart_game", 
              event_name: eventName, 
              game_id: gameId 
            })
          );
        }
        playStart();
        setRemainingTime(60);
        setCubeCount(0);
        setFirajCount(0);
        setDoubleGroupCount(0);
        setTripleGroupCount(0);
        setCirclePlayCount(0);
        setGamePaused(false);
        setTimeUp(false);
      },
      onCancel: () => {
        Swal.fire('Cancelled', 'Game restart was cancelled', 'info');
      }
    });
  };

  const handleCirclePlay = () => {
    if (circlePlayCount < 6) {
      setCirclePlayCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (remainingTime === 0) {
      playEnd();
    }
  }, [remainingTime, playEnd]);

  useEffect(() => {
    if (gameActive && !gamePaused) {
      if (
        (prevTimeRef.current >= 25 && remainingTime === 25) ||
        (prevTimeRef.current >= 35 && remainingTime === 35)
      ) {
        playMiddle();
      }
    }
    prevTimeRef.current = remainingTime;
  }, [remainingTime, gameActive, gamePaused, playMiddle]);

  // Calculate current circle point value
  const getCirclePointValue = () => {
    if (tripleGroupCount > 0) return 6;
    if (doubleGroupCount > 0) return 4;
    if (firajCount > 0) return 2;
    return 0;
  };

  // Calculate current points per circle play
  const currentCirclePoints = getCirclePointValue() ;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Koper Game Score</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Score Display */}
        <div className="p-4 bg-gray-50">
          <div className="text-center text-2xl font-bold text-gray-800 mb-2">
            Current Score: <span className="text-green-600">{score}</span>
          </div>
          <div className="text-center text-sm text-gray-600">
            Unlocked Circles: {unlockedCircles}/6
          </div>
          <div className="flex justify-center mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i}
                className={`w-4 h-4 rounded-full mx-1 ${
                  i < unlockedCircles ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
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

        {/* Counters */}
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            {/* Cube Counter */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
                <span className="font-medium">Cube (1 point each)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCubeCount(prev => Math.max(0, prev - 1))}
                  disabled={!gameActive || gamePaused}
                  className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaMinus size={14} />
                </button>
                <span className="font-bold w-8 text-center">{cubeCount}</span>
                <button 
                  onClick={() => setCubeCount(prev => prev + 1)}
                  disabled={!gameActive || gamePaused}
                  className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus size={14} />
                </button>
              </div>
            </div>
            
            {/* Firaj Counter (unlocks 2 circles) */}
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <GiThreeBurningBalls className="text-purple-500 mr-2" size={20} />
                <span className="font-medium">Firaj (unlocks 2 circles)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFirajCount(prev => prev === 0 ? 1 : 0)}
                  disabled={!gameActive || gamePaused}
                  className={`p-1 rounded-lg ${
                    firajCount === 1 
                      ? "bg-purple-500 text-white" 
                      : "bg-purple-200 text-purple-800"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {firajCount === 1 ? "✓" : <GiThreeBurningBalls size={18} />}
                </button>
              </div>
            </div>
            
            {/* Double Group Counter (10 points + unlocks 2 circles) */}
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <FaBullseye className="text-blue-500 mr-2" size={18} />
                <span className="font-medium">Double Group (10 points + unlocks 2 circles)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDoubleGroupCount(prev => prev === 0 ? 1 : 0)}
                  disabled={!gameActive || gamePaused}
                  className={`p-1 rounded-lg ${
                    doubleGroupCount === 1 
                      ? "bg-blue-500 text-white" 
                      : "bg-blue-200 text-blue-800"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {doubleGroupCount === 1 ? "✓" : <FaBullseye size={16} />}
                </button>
              </div>
            </div>
            
            {/* Triple Group Counter (15 points + unlocks 2 circles) */}
            <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <GiThreeBurningBalls className="text-red-500 mr-2" size={20} />
                <span className="font-medium">Triple Group (15 points + unlocks 2 circles)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTripleGroupCount(prev => prev === 0 ? 1 : 0)}
                  disabled={!gameActive || gamePaused}
                  className={`p-1 rounded-lg ${
                    tripleGroupCount === 1 
                      ? "bg-red-500 text-white" 
                      : "bg-red-200 text-red-800"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {tripleGroupCount === 1 ? "✓" : <GiThreeBurningBalls size={18} />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Circle Play Section - Only when circles are unlocked */}
          {unlockedCircles > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-lg text-center text-yellow-800 mb-3">
                Circle Plays ({currentCirclePoints} points per play)
              </h3>
              <div className="text-center mb-3">
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
                        i < circlePlayCount ? "bg-yellow-500" : "bg-gray-300"
                      }`}
                    >
                      <span className="font-bold text-white">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-yellow-700">
                  Current point value: {getCirclePointValue()} per circle
                  {firajCount > 0 && " (Firaj circles)"}
                  {doubleGroupCount > 0 && " (Double circles)"}
                  {tripleGroupCount > 0 && " (Triple circles)"}
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Total circle points: {circlePlayCount * currentCirclePoints}
                </p>
              </div>
              
              <button
                onClick={handleCirclePlay}
                disabled={!gameActive || gamePaused || circlePlayCount >= 6}
                className={`w-full py-2 rounded-lg font-semibold ${
                  circlePlayCount < 6 
                    ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                    : "bg-green-500 text-white"
                } transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {circlePlayCount < 6
                  ? `Play with ${unlockedCircles} Circles (${currentCirclePoints} points)` 
                  : "All Circle Plays Completed"}
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleCalculateAndSubmit}
            className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 transition-transform transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate & Submit Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default Koper;




// return (
//   <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
//     <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
//       {/* Header */}
//       <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//         <h2 className="text-xl font-bold flex items-center">
//           <GiThreeBurningBalls className="mr-2" /> Koper Game Score
//         </h2>
//         <button
//           onClick={onClose}
//           className="text-white hover:text-red-200 transition-colors"
//         >
//           <FaTimes size={24} />
//         </button>
//       </div>

//       {/* Score Display */}
//       <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-sm text-gray-600 font-medium">Current Score</div>
//             <div className="text-3xl font-bold text-gray-800">{score}</div>
//           </div>
          
//           <div className="text-right">
//             <div className="text-sm text-gray-600 font-medium">Unlocked Circles</div>
//             <div className="font-bold text-gray-800">{unlockedCircles}/6</div>
//           </div>
//         </div>
        
//         <div className="mt-3 flex justify-center">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div 
//               key={i}
//               className={`w-6 h-6 rounded-full mx-1 flex items-center justify-center ${
//                 i < unlockedCircles ? "bg-green-500" : "bg-gray-300"
//               } ${i < circlePlayCount ? "ring-2 ring-yellow-400" : ""}`}
//             >
//               {i < circlePlayCount && (
//                 <span className="text-xs font-bold text-white">{i+1}</span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Timer and Controls */}
//       <div className="p-4 bg-gray-50 border-b">
//         <div className={`text-center text-lg font-bold p-3 rounded-lg ${
//           gamePaused 
//             ? "bg-yellow-100 text-yellow-800" 
//             : timeUp 
//               ? "bg-red-100 text-red-800" 
//               : "bg-blue-100 text-blue-800"
//         }`}>
//           {gamePaused
//             ? "⏸ Game Paused"
//             : timeUp
//             ? "⏱ Time's Up!"
//             : `⏱ Remaining Time: ${remainingTime} seconds`}
//         </div>
        
//         <div className="flex justify-center space-x-3 mt-3">
//           {!showControls && (
//             <button
//               onClick={startGame}
//               disabled={gameActive}
//               className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <FaPlay className="mr-2" /> Start Game
//             </button>
//           )}

//           {showControls && (
//             <div className="flex flex-wrap justify-center gap-2">
//               <button
//                 onClick={pauseGame}
//                 disabled={!gameActive || gamePaused}
//                 className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaPause className="mr-2" /> Pause
//               </button>
//               <button
//                 onClick={resumeGame}
//                 disabled={!gamePaused}
//                 className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <BsSkipStartFill className="mr-2" /> Resume
//               </button>
//               <button
//                 onClick={restartGame}
//                 disabled={!gameActive}
//                 className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaSync className="mr-2" /> Restart
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Counters */}
//       <div className="p-4 max-h-[50vh] overflow-y-auto">
//         <div className="grid grid-cols-1 gap-3">
//           {/* Cube Counter */}
//           <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
//             <div className="flex justify-between items-center mb-2">
//               <div className="flex items-center">
//                 <div className="w-5 h-5 bg-blue-500 rounded mr-2"></div>
//                 <span className="font-medium text-gray-700">Cubes</span>
//               </div>
//               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
//                 1 point each
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <button 
//                 onClick={() => setCubeCount(prev => Math.max(0, prev - 1))}
//                 disabled={!gameActive || gamePaused}
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaMinus />
//               </button>
//               <span className="text-2xl font-bold w-12 text-center">{cubeCount}</span>
//               <button 
//                 onClick={() => setCubeCount(prev => prev + 1)}
//                 disabled={!gameActive || gamePaused}
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaPlus />
//               </button>
//             </div>
//           </div>
          
//           {/* Group Counters */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             {/* Firaj Counter */}
//             <div className="bg-white border border-purple-200 rounded-xl p-3 shadow-sm">
//               <div className="flex justify-between items-center mb-2">
//                 <div className="flex items-center">
//                   <GiThreeBurningBalls className="text-purple-500 mr-1" size={18} />
//                   <span className="font-medium text-gray-700">Firaj</span>
//                 </div>
//                 <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
//                   Unlocks 2 circles
//                 </div>
//               </div>
//               <button
//                 onClick={() => setFirajCount(prev => prev === 0 ? 1 : 0)}
//                 disabled={!gameActive || gamePaused}
//                 className={`w-full py-2 rounded-lg font-medium transition-all ${
//                   firajCount === 1 
//                     ? "bg-purple-600 text-white hover:bg-purple-700" 
//                     : "bg-purple-100 text-purple-800 hover:bg-purple-200"
//                 } disabled:opacity-50 disabled:cursor-not-allowed`}
//               >
//                 {firajCount === 1 ? "Active ✓" : "Activate"}
//               </button>
//             </div>
            
//             {/* Double Group Counter */}
//             <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-sm">
//               <div className="flex justify-between items-center mb-2">
//                 <div className="flex items-center">
//                   <FaBullseye className="text-blue-500 mr-1" size={16} />
//                   <span className="font-medium text-gray-700">Double</span>
//                 </div>
//                 <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//                   10 points
//                 </div>
//               </div>
//               <button
//                 onClick={() => setDoubleGroupCount(prev => prev === 0 ? 1 : 0)}
//                 disabled={!gameActive || gamePaused}
//                 className={`w-full py-2 rounded-lg font-medium transition-all ${
//                   doubleGroupCount === 1 
//                     ? "bg-blue-600 text-white hover:bg-blue-700" 
//                     : "bg-blue-100 text-blue-800 hover:bg-blue-200"
//                 } disabled:opacity-50 disabled:cursor-not-allowed`}
//               >
//                 {doubleGroupCount === 1 ? "Active ✓" : "Activate"}
//               </button>
//             </div>
            
//             {/* Triple Group Counter */}
//             <div className="bg-white border border-red-200 rounded-xl p-3 shadow-sm">
//               <div className="flex justify-between items-center mb-2">
//                 <div className="flex items-center">
//                   <GiThreeBurningBalls className="text-red-500 mr-1" size={18} />
//                   <span className="font-medium text-gray-700">Triple</span>
//                 </div>
//                 <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
//                   15 points
//                 </div>
//               </div>
//               <button
//                 onClick={() => setTripleGroupCount(prev => prev === 0 ? 1 : 0)}
//                 disabled={!gameActive || gamePaused}
//                 className={`w-full py-2 rounded-lg font-medium transition-all ${
//                   tripleGroupCount === 1 
//                     ? "bg-red-600 text-white hover:bg-red-700" 
//                     : "bg-red-100 text-red-800 hover:bg-red-200"
//                 } disabled:opacity-50 disabled:cursor-not-allowed`}
//               >
//                 {tripleGroupCount === 1 ? "Active ✓" : "Activate"}
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Circle Play Section */}
//         {unlockedCircles > 0 && (
//           <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 shadow-sm">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-bold text-lg text-yellow-800">
//                 Circle Plays
//               </h3>
//               <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
//                 {currentCirclePoints} pts/play
//               </div>
//             </div>
            
//             <div className="mb-4">
//               <div className="flex justify-center mb-2">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                   <div 
//                     key={i}
//                     className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
//                       i < unlockedCircles 
//                         ? i < circlePlayCount 
//                           ? "bg-yellow-500 ring-2 ring-yellow-400" 
//                           : "bg-yellow-300" 
//                         : "bg-gray-200"
//                     }`}
//                   >
//                     {i < unlockedCircles && (
//                       <span className="font-bold text-xs text-white">
//                         {i + 1}
//                       </span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <div className="text-center text-sm text-yellow-700 mt-1">
//                 {circlePlayCount} of {unlockedCircles} plays used
//               </div>
//             </div>
            
//             <div className="text-center text-sm text-yellow-700 mb-3">
//               Current point value: {getCirclePointValue()} per circle
//             </div>
            
//             <button
//               onClick={handleCirclePlay}
//               disabled={!gameActive || gamePaused || circlePlayCount >= unlockedCircles}
//               className={`w-full py-3 rounded-xl font-bold text-white ${
//                 circlePlayCount < unlockedCircles 
//                   ? "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600" 
//                   : "bg-gradient-to-r from-green-500 to-emerald-500"
//               } transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
//             >
//               {circlePlayCount < unlockedCircles
//                 ? `Play Circle (+${currentCirclePoints} points)` 
//                 : "All Circles Played"}
//             </button>
//           </div>
//         )}
        
//         {/* Points Summary */}
//         <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
//           <h3 className="font-bold text-gray-700 mb-2">Points Breakdown</h3>
//           <div className="space-y-1 text-sm">
//             <div className="flex justify-between">
//               <span>Cubes:</span>
//               <span className="font-medium">{cubeCount} × 1 = {cubeCount} pts</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Double Group:</span>
//               <span className="font-medium">{doubleGroupCount} × 10 = {doubleGroupCount * 10} pts</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Triple Group:</span>
//               <span className="font-medium">{tripleGroupCount} × 15 = {tripleGroupCount * 15} pts</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Circle Plays:</span>
//               <span className="font-medium">{circlePlayCount} × {getCirclePointValue()} = {circlePlayCount * getCirclePointValue()} pts</span>
//             </div>
//             <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold">
//               <span>Total Score:</span>
//               <span>{score} pts</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="p-4 bg-gray-50 border-t">
//         <button
//           onClick={handleCalculateAndSubmit}
//           className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Submit Final Score
//         </button>
//       </div>
//     </div>
//   </div>
// );
// };

// export default Koper;
