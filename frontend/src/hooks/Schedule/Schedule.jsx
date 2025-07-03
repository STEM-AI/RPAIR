// // useSchedule.js
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const useSchedule = (scheduleId) => {
//   const [schedule, setSchedule] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     const fetchSchedule = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/core/event/schedule/${scheduleId}/`,
//          {
//     headers: { // التصحيح هنا
//       Authorization: `Bearer ${token}`,
//     },
//   }
//         );
//         setSchedule(response.data);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch schedule details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (scheduleId) {
//       fetchSchedule();
//     } else {
//       setError('Schedule ID is required');
//       setLoading(false);
//     }
//   }, [scheduleId]);

//   return { schedule, loading, error };
// };

// export default useSchedule;


// useSchedule.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useSchedule = (scheduleId) => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/core/event/schedule/${scheduleId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedule(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch schedule details');
    } finally {
      setLoading(false);
    }
  }, [scheduleId, token]);

  useEffect(() => {
    if (scheduleId) {
      fetchSchedule();
    } else {
      setError('Schedule ID is required');
      setLoading(false);
    }
  }, [scheduleId, fetchSchedule]);

  return { 
    schedule, 
    loading, 
    error,
    refetch: fetchSchedule // أضف هذه الدالة
  };
};

export default useSchedule;