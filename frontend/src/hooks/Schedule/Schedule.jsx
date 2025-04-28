// useSchedule.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useSchedule = (scheduleId) => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/core/event/schedule/${scheduleId}/`
        );
        setSchedule(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch schedule details');
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchSchedule();
    } else {
      setError('Schedule ID is required');
      setLoading(false);
    }
  }, [scheduleId]);

  return { schedule, loading, error };
};

export default useSchedule;