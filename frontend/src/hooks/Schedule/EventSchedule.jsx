import { useState, useEffect } from 'react';
import axios from 'axios';

const useEventSchedules = (eventName, stage = '', ordering = "-id") => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  // 1. نقل الدالة خارج الـ useEffect
  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/core/event/${eventName}/schedule/`,
        {
          params: { ordering, stage }, // الباراميترات
          headers: { // إضافة الهيدر المطلوب
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
    if (eventName) {
      fetchSchedules(); // 2. استدعاء الدالة هنا
    }
  }, [eventName, ordering, stage]);

  // 3. إرجاع الدالة كـ refetch
return { schedules, loading, error, refetch: fetchSchedules };
};

export default useEventSchedules;