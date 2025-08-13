import React, { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import {  FaBullseye, FaTimes, FaPlay, FaPause, FaSync, FaPlus, FaMinus } from "react-icons/fa";
import { BsSkipStartFill } from "react-icons/bs";
import { GiThreeBurningBalls } from "react-icons/gi";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "../../../../../../../components/Alert/Alert";
import useSound from 'use-sound';

const Koper = ({ onCalculate, onClose, gameId, eventName, eventId, activeTab }) => {
  const [remainingTime, setRemainingTime] = useState();
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const socketRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const token = localStorage.getItem("access_token");
  const prevTimeRef = useRef(remainingTime);
  const [circlePlays, setCirclePlays] = useState(Array(6).fill(null));
  const [cubeCount, setCubeCount] = useState(0);
  const [firajCount, setFirajCount] = useState(0);
  const [doubleGroupCount, setDoubleGroupCount] = useState(0);
  const [tripleGroupCount, setTripleGroupCount] = useState(0);
  const [unlockedCircles, setUnlockedCircles] = useState(0);

  const [playStart] = useSound('/sounds/Start.MP3', { volume: 1 });
  const [playEnd] = useSound('/sounds/End.mp3', { volume: 1 });
  const [playMiddle] = useSound('/sounds/Middle.MP3', { volume: 1 });

  useEffect(() => {
    if (activeTab === "teamwork") {
      setRemainingTime(60);
    } else {
      setRemainingTime(90);
    }
  }, [activeTab]);

  // Calculate unlocked circles
  useEffect(() => {
    const totalUnlocks = firajCount + doubleGroupCount + tripleGroupCount;
    setUnlockedCircles(Math.min(totalUnlocks * 2, 6));
  }, [firajCount, doubleGroupCount, tripleGroupCount]);

  // Reset circle plays when unlocks drop below current count
 useEffect(() => {
  const playedCirclesCount = circlePlays.filter(points => points !== null).length;
  
  if (playedCirclesCount > 0 && unlockedCircles < playedCirclesCount) {
    setCirclePlays(Array(6).fill(null));
  }
}, [unlockedCircles, circlePlays]);


  const score = useMemo(() => {
    let totalScore = 0;
    totalScore += cubeCount;
    totalScore += doubleGroupCount * 10;
    totalScore += tripleGroupCount * 15;
    totalScore += circlePlays.reduce((sum, points) => sum + points, 0);
    return totalScore;
  }, [cubeCount, firajCount, doubleGroupCount, tripleGroupCount, circlePlays]);


   useEffect(() => {
    let totalUnlocks = 0;
    if (activeTab === 'auto') {
      totalUnlocks = (firajCount * 2) + doubleGroupCount + tripleGroupCount;
    } else {
      totalUnlocks = (firajCount + doubleGroupCount + tripleGroupCount) * 2;
    }
    setUnlockedCircles(Math.min(totalUnlocks, 6));
  }, [firajCount, doubleGroupCount, tripleGroupCount, activeTab]);


  
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
        setCirclePlays(Array(6).fill(null));
        setGamePaused(false);
        setTimeUp(false);
      },
      onCancel: () => {
        Swal.fire('Cancelled', 'Game restart was cancelled', 'info');
      }
    });
  };
const handleRemoveCirclePlay = (index) => {
  if (!gameActive || gamePaused) return;
  
  const newCirclePlays = [...circlePlays];
  newCirclePlays[index] = null;
  setCirclePlays(newCirclePlays);
};
  const handleCirclePlay = () => {
      const emptyIndex = circlePlays.findIndex(points => points === null);
      if (emptyIndex !== -1) {
        const newCirclePlays = [...circlePlays];
        newCirclePlays[emptyIndex] = getCirclePointValue();
        setCirclePlays(newCirclePlays);
      }
    };

  // Calculate current circle point value
  const getCirclePointValue = () => {
    if (tripleGroupCount > 0) return 6;
    if (doubleGroupCount > 0) return 4;
    if (firajCount > 0) return 2;
    return 0;
  };

  useEffect(() => {
    
 if (activeTab === "teamwork") {
      if (gameActive && !gamePaused) {
      if (remainingTime === 35 || remainingTime === 25) {
        playMiddle();
      }
    }
    } else {
      if (gameActive && !gamePaused) {
      if (remainingTime === 40 || remainingTime === 50) {
        playMiddle();
      }
    }
    }
    
    prevTimeRef.current = remainingTime;
  }, [remainingTime, gameActive, gamePaused, playMiddle, activeTab]);

  useEffect(() => {
    if (remainingTime === 0) {
      playEnd();
    }
  }, [remainingTime, playEnd]);

  // Calculate current points per circle play
  const currentCirclePoints = getCirclePointValue();

 const handleDoubleGroup = () => {
    if (activeTab === 'auto') {
      
      if (doubleGroupCount < 2) {
        setDoubleGroupCount(prev => prev + 1);
      }
    } else {
      setDoubleGroupCount(prev => prev === 0 ? 1 : 0);
    }
  };

  
  const handleTripleGroup = () => {
    if (activeTab === 'auto') {
    
      if (tripleGroupCount < 2) {
        setTripleGroupCount(prev => prev + 1);
      }
    } else {
      setTripleGroupCount(prev => prev === 0 ? 1 : 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
         <div className="flex-grow overflow-y-auto">
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
            
            {/* Double Group Counter */}
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <FaBullseye className="text-blue-500 mr-2" size={18} />
                  <span className="font-medium">
                    {activeTab === 'auto' 
                      ? "Double Group (10 points + unlocks 1 circle)" 
                      : "Double Group (10 points + unlocks 2 circles)"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDoubleGroup}
                    disabled={!gameActive || gamePaused }
                    className={`p-1 rounded-lg ${
                      doubleGroupCount > 0 
                        ? "bg-blue-500 text-white" 
                        : "bg-blue-200 text-blue-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {activeTab === 'auto' 
                      ?doubleGroupCount==2 ? "✓" : `${doubleGroupCount}/2` 
                      : doubleGroupCount > 0 ? "✓" : <FaBullseye size={16} />}
                  </button>
                </div>
              </div>
              
              {/* Triple Group Counter */}
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <GiThreeBurningBalls className="text-red-500 mr-2" size={20} />
                  <span className="font-medium">
                    {activeTab === 'auto' 
                      ? "Triple Group (15 points + unlocks 1 circle)" 
                      : "Triple Group (15 points + unlocks 2 circles)"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleTripleGroup}
                    disabled={!gameActive || gamePaused }
                    className={`p-1 rounded-lg ${
                      tripleGroupCount > 0 
                        ? "bg-red-500 text-white" 
                        : "bg-red-200 text-red-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {activeTab === 'auto' 
                      ? `${tripleGroupCount}/2` 
                      : tripleGroupCount > 0 ? "✓" : <GiThreeBurningBalls size={18} />}
                  </button>
                </div>
              </div>
          </div>
          
          {/* Circle Play Section - Only when circles are unlocked */}
          {unlockedCircles > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-lg text-center text-yellow-800 mb-3">
              Circle Plays ({currentCirclePoints} points for new plays)
            </h3>
            <div className="text-center mb-3">
              <div className="flex justify-center mb-2">
                {circlePlays.map((points, i) => (
                  <button
                    key={i}
                    onClick={() => points !== null && handleRemoveCirclePlay(i)}
                    className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
                      points !== null 
                        ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer" 
                        : "bg-gray-300"
                    }`}
                    disabled={points === null}
                  >
                    <span className="font-bold text-white">
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-yellow-700">
                Current point value: {getCirclePointValue()} per circle
                {firajCount > 0 && " (Firaj circles)"}
                {doubleGroupCount > 0 && " (Double circles)"}
                {tripleGroupCount > 0 && " (Triple circles)"}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Total circle points: {circlePlays.reduce((sum, points) => sum + points, 0)}
              </p>
            </div>
            
            <button
              onClick={handleCirclePlay}
              disabled={!gameActive || gamePaused || circlePlays.every(p => p !== null)}
              className={`w-full py-2 rounded-lg font-semibold ${
                circlePlays.length < 6 
                  ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                  : "bg-green-500 text-white"
              } transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {circlePlays.some(p => p === null)
                ? `Play with ${unlockedCircles} Circles (${currentCirclePoints} points)` 
                : "All Circle Plays Completed"}
            </button>
          </div>
        )}
        </div>

        {/* Submit Button */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
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