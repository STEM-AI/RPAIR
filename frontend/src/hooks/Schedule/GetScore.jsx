// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function useGetScore(event_id, stage) {
//   const [score, setScore] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchScores = async () => {
//       try {
//         const token = localStorage.getItem('access_token');
//         if (!token) throw new Error('Missing authentication token');
        
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/core/event/${event_id}/${stage}/games/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
        
//         setScore(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (event_id) fetchScores();
//     else setLoading(false);
//   }, [event_id, stage]);

//   return { score, loading, error };
// }



import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useGetScore(event_id, stage) {
  const [score, setScore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScores = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Missing authentication token');
      
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/core/event/${event_id}/${stage}/games/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  // Return the refetch function along with other values
  return { 
    score, 
    loading, 
    error, 
    refetch: fetchScores 
  };
}