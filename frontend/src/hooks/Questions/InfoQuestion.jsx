

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useInfoQuestions(id, type = null ) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('Missing authentication token');
        
        const params = {};
        if (type) params.type = type;
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/programming/number-of-questions-time-limit/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params
          }
        );
        
        setQuestions(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuestions();
    else setLoading(false);
  }, [id, type]);

  return { questions, loading, error ,type};
}