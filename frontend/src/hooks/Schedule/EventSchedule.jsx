import { useState, useEffect } from 'react';
import axios from 'axios';

const useEventSchedules = (eventName, stage = '' , ordering="id") => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/core/event/${eventName}/schedule/`,
          { params: { ordering, stage } } // Pass query parameters
        );
        setSchedules(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch schedules');
      } finally {
        setLoading(false);
      }
    };

    if (eventName) {
      fetchSchedules();
    } else {
      setError('Event name is required');
      setLoading(false);
    }
  }, [eventName, ordering, stage]);

  return { schedules, loading, error };
};

export default useEventSchedules;