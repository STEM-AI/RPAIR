import { useState, useEffect } from 'react';
import axios from 'axios';

const useEventSchedules = (event_id, stage , ordering ) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  // 1. نقل الدالة خارج الـ useEffect
  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/core/event/${event_id}/schedule/`,
        {
          params: {
            ordering,
            stage
          }, 
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedules(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event_id) {
      fetchSchedules(); // 2. استدعاء الدالة هنا
    }
  }, [event_id, ordering, stage]);

  // 3. إرجاع الدالة كـ refetch
return { schedules, loading, error, refetch: fetchSchedules };
};

export default useEventSchedules;