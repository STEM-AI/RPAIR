import { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';

const useEventSchedules = (event_id, stage, ordering) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/core/event/${event_id}/schedule/`,
        {
          params: { ordering, stage },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSchedules(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  }, [event_id, ordering, stage, token]); 

  useEffect(() => {
    if (event_id) {
      fetchSchedules();
    }
  }, [event_id, fetchSchedules]); 

  return { schedules, loading, error, refetch: fetchSchedules };
};

export default useEventSchedules;