import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useGameID(team_id, event_id, stage) {
  const [GameID, setGameID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameID = async () => {
      try {
        const token = localStorage.getItem('access_token'); 
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/core/game-id/${team_id}/${event_id}/${stage}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setGameID(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (team_id) fetchGameID();
  }, [team_id, event_id, stage]);

  return { GameID, loading, error };
}