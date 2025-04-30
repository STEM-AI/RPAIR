import React, { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { FaRedo, FaBullseye, FaTimes, FaPlay, FaPause, FaSync } from "react-icons/fa";
import { BsSkipStartFill } from "react-icons/bs";
import { GiThreeBurningBalls } from "react-icons/gi";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "../../../../../../../components/Alert/Alert";
import useSound from 'use-sound';

const ScoreTeams = ({ onCalculate, onClose, gameId ,eventName}) => {
  const [switchCount, setSwitchCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const socketRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const token = localStorage.getItem("access_token");
  const prevTimeRef = useRef(remainingTime);

const [playStart] = useSound('/sounds/Start.MP3', { volume: 1 });
const [playEnd] = useSound('/sounds/End.mp3', { volume: 1 });
const [playMiddle] = useSound('/sounds/Middle.MP3', { volume: 1 });
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
    return goalCount * 1 + switchCount * 1 + passCount * getPassPoints(switchCount);
  }, [switchCount, goalCount, passCount]);

const handleCalculateAndSubmit = async () => {
  if (!score) {
    alert("Please enter a valid score.");
    return;
  }
  
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
            event_name: eventName,
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
          EndGame()
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

  // Establish WebSocket connection when the component mounts
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
          setGameActive(false); // إضافة تحديث الحالة
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
        playStart(); // تشغيل الصوت هنا
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
  const EndGame = () => {
      setGameActive(false);
      setShowControls(false);
      setTimeUp(true);
  
      // Send a message to start the game via WebSocket
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
      playStart(); // تشغيل الصوت هنا
    setRemainingTime(60);
    setGamePaused(false);
    setTimeUp(false);
     setSwitchCount(0);
  setGoalCount(0);
  setPassCount(0);
  },
      onCancel: () => {
        Swal.fire('Cancelled', 'Game restart was cancelled', 'info');
      }
    });
  };
  
  useEffect(() => {
  if (remainingTime === 0) {
    playEnd();
  }
}, [remainingTime, playEnd]);

// تشغيل playMiddle عند الوصول إلى 25 أو 35 ثانية
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

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
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

        {/* Counters */}
        <div className="p-4">
          {[
            { label: "Switch", count: switchCount, setCount: setSwitchCount, icon: <FaRedo size={20} className="text-blue-500" />, max: 4 },
            { label: "Goal", count: goalCount, setCount: setGoalCount, icon: <FaBullseye size={20} className="text-green-500" /> },
            { label: "Pass", count: passCount, setCount: setPassCount, icon: <GiThreeBurningBalls size={20} className="text-orange-500" /> },
          ].map(({ label, count, setCount, icon, max }) => (
            <div key={label} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3 shadow-md">
              <div className="flex items-center gap-2">
                {icon}
                <span className="font-semibold text-gray-700">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCount(max ? Math.min(max, count + 1) : count + 1)}
                  disabled={!gameActive} // Disable if the game is not active
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className="text-xl font-bold">{count}</span>
                <button
                  onClick={() => setCount(Math.max(0, count - 1))}
                  disabled={!gameActive} // Disable if the game is not active
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
            onClick={handleCalculateAndSubmit}
            // disabled={gameActive || !timeUp} // Disable if the game is active or time is not up
            className="w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate & Submit Score
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default ScoreTeams;