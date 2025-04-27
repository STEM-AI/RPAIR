
import { useEffect, useRef, useState } from "react";

export const LiveWebSocket = (eventName) => {
  const [matches, setMatches] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const socketRef = useRef(null);

  useEffect(() => {
    if (!eventName) {
      console.error("No event name provided for WebSocket connection");
      return;
    }

    const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/teamwork/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("Teamwork WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Score Update:", data);

      if (data.game_id && data.score !== undefined) {
        setMatches(prevMatches => {
          const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);
          if (matchIndex === -1) {
            return [...prevMatches, {
              code: data.game_id,
              team1: data.team1_name || 'Team',
              score: data.score.driver
            }];
          }

          const updatedMatches = [...prevMatches];
          updatedMatches[matchIndex] = {
            ...updatedMatches[matchIndex],
            score: data.score.driver
          };
          return updatedMatches;
        });

        setLastUpdate(new Date());
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("Teamwork WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("Teamwork WebSocket connection closed");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [eventName]);

  return { matches, lastUpdate };
};