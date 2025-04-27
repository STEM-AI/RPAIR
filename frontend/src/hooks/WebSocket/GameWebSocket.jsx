// src/hooks/useGameWebSocket.js
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export const useGameWebSocket = (eventName, gameId, initialTime) => {
  const [remainingTime, setRemainingTime] = useState(initialTime || 300);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const socketRef = useRef(null);
  const reconnectInterval = useRef(null);

  const handleMessage = (data) => {
    switch (data.action) {
      case 'restart':
        setRemainingTime(data.initial_time);
        setGameActive(false);
        setTimeUp(false);
        break;
      case 'status_update':
        setGameActive(data.status === "started");
        setGamePaused(data.status === "paused");
        if (data.remaining_time !== undefined) {
          setRemainingTime(Math.round(data.remaining_time));
          setTimeUp(data.remaining_time <= 0);
        }
        break;
      default:
        console.log("Unhandled message type:", data);
    }
  };

  const setupWebSocket = () => {
    if (!eventName || !gameId) return;

    socketRef.current = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/game/${gameId}/`
    );

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleMessage(data);
    };

    socketRef.current.onclose = (e) => {
      if (e.code !== 1000) {
        reconnectInterval.current = setInterval(() => {
          setupWebSocket();
        }, 5000);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  useEffect(() => {
    setupWebSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
    };
  }, [eventName, gameId, initialTime]);

  const sendWebSocketMessage = (action, data = {}) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action,
          ...data,
          event_name: eventName,
          game_id: gameId
        })
      );
    }
  };

  return {
    remainingTime,
    gameActive,
    gamePaused,
    timeUp,
    sendWebSocketMessage
  };
};