

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function useGetScore(event_id, stage) {
  const [score, setScore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScores = useCallback(async () => {
    try {
    

      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/core/event/${event_id}/${stage}/games/`,
      );

      setScore(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [event_id, stage]);

  useEffect(() => {
    if (event_id) fetchScores();
    else setLoading(false);
  }, [event_id, stage, fetchScores]);

  return {
    score,
    loading,
    error,
    refetch: fetchScores,
  };
}
