import React, { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { FaRedo, FaBullseye, FaTimes, FaPlay, FaPause, FaSync } from "react-icons/fa";
import { GiThreeBurningBalls } from "react-icons/gi";
import axios from "axios";

const ScoreTeams = ({ onCalculate, onClose , gameId}) => {
  const [switchCount, setSwitchCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const socketRef = useRef(null);
  const eventName = localStorage.getItem('selected_event_name');
  // const gameId = localStorage.getItem('gameId');
  console.log("gameId", gameId);
  const token = localStorage.getItem("access_token");
  

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

  const handleCalculateAndSubmit = async () => {
    if (!score) {
      alert("Please enter a valid score.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/game/${gameId}/set-game-score/`,
        {
          event_name: eventName,
          score: score
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Score submitted successfully:", response.data);
        alert("Score submitted successfully!");
        onCalculate(score);
        onClose();
      } else {
        throw new Error('Failed to submit score');
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      alert("Failed to submit score. Please try again.");
    }
  };

  const startGame = () => {
    setGameActive(true);
    setGamePaused(false);

    socketRef.current = new WebSocket(`ws://147.93.56.71:8000/ws/competition_event/${eventName}/game/${gameId}/`);

    socketRef.current.onopen = () => {
      socketRef.current.send(
        JSON.stringify({ action: "start_game", event_name: eventName, game_id: gameId })
      );
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
        }
      }
    };
  };

  const pauseGame = () => {
    if (!gameActive || gamePaused) return;
    socketRef.current.send(JSON.stringify({ action: "pause_game", event_name: eventName, game_id: gameId }));
    setGamePaused(true);
  };

  const resumeGame = () => {
    if (!gameActive || !gamePaused) return;
    socketRef.current.send(JSON.stringify({ action: "resume_game", event_name: eventName, game_id: gameId }));
    setGamePaused(false);
  };

  const restartGame = () => {
    socketRef.current.send(JSON.stringify({ action: "restart_game", event_name: eventName, game_id: gameId }));
    setRemainingTime(60);
    setGamePaused(false);
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-2xl max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <div className="timer-controls mb- text-center ">
          <div >
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-lg font-bold mx-1"
              onClick={startGame}
              disabled={gameActive}
            >
              Start Game
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-lg font-bold mx-1"
              onClick={pauseGame}
              disabled={!gameActive || gamePaused}
            >
              Pause
            </button>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-lg font-bold mx-1"
              onClick={resumeGame}
              disabled={!gamePaused}
            >
              Resume
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-lg font-bold mx-1"
              onClick={restartGame}
              disabled={!gameActive}
            >
              Restart
            </button>
          </div>
          <div style={{ fontSize: "1.5em", fontWeight: "bold", color: gamePaused ? '#ffc107' : '#000' }}>
            {gamePaused ? "Game Paused" : `Remaining Time: ${remainingTime} seconds`}
          </div>
        </div>

        <div className="mt-4 text-center text-xl font-bold text-gray-700 bg-gray-200 p-3 rounded-lg shadow-md mb-4">
          Current Score: <span className="text-green-600">{score}</span>
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
              >
                +
              </button>
              <span className="text-xl font-bold">{count}</span>
              <button
                onClick={() => setCount(Math.max(0, count - 1))}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-lg font-bold"
              >
                -
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleCalculateAndSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 transition mt-3"
        >
          Calculate & Submit Score
        </button>
      </div>
    </div>
  );
};

export default ScoreTeams;
