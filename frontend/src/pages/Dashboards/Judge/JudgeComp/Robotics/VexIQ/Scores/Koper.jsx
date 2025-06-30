import React, { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { FaRedo, FaBullseye, FaTimes, FaPlay, FaPause, FaSync, FaPlus, FaMinus } from "react-icons/fa";
import { BsSkipStartFill } from "react-icons/bs";
import { GiThreeBurningBalls } from "react-icons/gi";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "../../../../../../../components/Alert/Alert";
import useSound from 'use-sound';

const Koper = ({ onCalculate, onClose, gameId, eventName }) => {
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
    
    // 1. Cubes (1 point each)
    totalScore += cubeCount;
    
    // 2. Double Group (10 points)
    totalScore += doubleGroupCount * 10;
    
    // 3. Triple Group (15 points)
    totalScore += tripleGroupCount * 15;
    
    // 4. Circle plays (points based on current unlock state)
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
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Compact Header */}
        <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
          <h2 className="text-lg font-bold">Koper Game</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Compact Score Display */}
        <div className="p-3 bg-gray-100 border-b">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-700">Score:</div>
            <div className="text-xl font-bold text-green-600">{score}</div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-600">Circles: {unlockedCircles}/6</div>
            <div className="flex">
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full mx-0.5 ${
                    i < unlockedCircles ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Compact Timer and Controls */}
        <div className="p-3 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-semibold">
              {gamePaused ? "PAUSED" : timeUp ? "TIME'S UP" : `${remainingTime}s`}
            </div>
            <div className="flex space-x-1">
              {!showControls ? (
                <button
                  onClick={startGame}
                  disabled={gameActive}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
                  title="Start"
                >
                  <FaPlay size={12} />
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseGame}
                    disabled={!gameActive || gamePaused}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 disabled:opacity-50"
                    title="Pause"
                  >
                    <FaPause size={12} />
                  </button>
                  <button
                    onClick={resumeGame}
                    disabled={!gamePaused}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-50"
                    title="Resume"
                  >
                    <BsSkipStartFill size={12} />
                  </button>
                  <button
                    onClick={restartGame}
                    disabled={!gameActive}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                    title="Restart"
                  >
                    <FaSync size={12} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Compact Counters */}
        <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
          {/* Cube Counter */}
          <div className="flex items-center justify-between p-1 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span>Cubes</span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setCubeCount(prev => Math.max(0, prev - 1))}
                disabled={!gameActive || gamePaused}
                className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                <FaMinus size={10} />
              </button>
              <span className="font-bold w-6 text-center">{cubeCount}</span>
              <button 
                onClick={() => setCubeCount(prev => prev + 1)}
                disabled={!gameActive || gamePaused}
                className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                <FaPlus size={10} />
              </button>
            </div>
          </div>
          
          {/* Firaj Counter */}
          <div className="flex items-center justify-between p-1 text-sm">
            <div className="flex items-center">
              <GiThreeBurningBalls className="text-purple-500 mr-2" size={16} />
              <span>Firaj</span>
            </div>
            <button
              onClick={() => setFirajCount(prev => prev === 0 ? 1 : 0)}
              disabled={!gameActive || gamePaused}
              className={`p-1 rounded ${firajCount === 1 ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-800"} disabled:opacity-50`}
            >
              {firajCount === 1 ? "✓" : <GiThreeBurningBalls size={14} />}
            </button>
          </div>
          
          {/* Double Group Counter */}
          <div className="flex items-center justify-between p-1 text-sm">
            <div className="flex items-center">
              <FaBullseye className="text-blue-500 mr-2" size={14} />
              <span>Double Group</span>
            </div>
            <button
              onClick={() => setDoubleGroupCount(prev => prev === 0 ? 1 : 0)}
              disabled={!gameActive || gamePaused}
              className={`p-1 rounded ${doubleGroupCount === 1 ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"} disabled:opacity-50`}
            >
              {doubleGroupCount === 1 ? "✓" : <FaBullseye size={12} />}
            </button>
          </div>
          
          {/* Triple Group Counter */}
          <div className="flex items-center justify-between p-1 text-sm">
            <div className="flex items-center">
              <GiThreeBurningBalls className="text-red-500 mr-2" size={16} />
              <span>Triple Group</span>
            </div>
            <button
              onClick={() => setTripleGroupCount(prev => prev === 0 ? 1 : 0)}
              disabled={!gameActive || gamePaused}
              className={`p-1 rounded ${tripleGroupCount === 1 ? "bg-red-500 text-white" : "bg-red-100 text-red-800"} disabled:opacity-50`}
            >
              {tripleGroupCount === 1 ? "✓" : <GiThreeBurningBalls size={14} />}
            </button>
          </div>
          
          {/* Circle Plays - Only when unlocked */}
          {unlockedCircles > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-yellow-800">
                  Circles ({currentCirclePoints}pts)
                </span>
                <span className="text-xs font-bold">
                  {circlePlayCount}/6
                </span>
              </div>
              <div className="flex justify-center mb-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`w-4 h-4 rounded-full mx-0.5 flex items-center justify-center text-xs ${
                      i < circlePlayCount ? "bg-yellow-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {i < circlePlayCount ? i+1 : ""}
                  </div>
                ))}
              </div>
              <button
                onClick={handleCirclePlay}
                disabled={!gameActive || gamePaused || circlePlayCount >= 6}
                className={`w-full py-1 text-xs rounded font-medium ${
                  circlePlayCount < 6 
                    ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                    : "bg-green-500 text-white"
                } disabled:opacity-50`}
              >
                {circlePlayCount < 6 ? "Add Circle Play" : "Completed"}
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-3 bg-gray-100">
          <button
            onClick={handleCalculateAndSubmit}
            className="w-full bg-green-500 text-white py-2 rounded text-sm font-semibold hover:bg-green-600 disabled:opacity-50"
          >
            Submit Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default Koper;