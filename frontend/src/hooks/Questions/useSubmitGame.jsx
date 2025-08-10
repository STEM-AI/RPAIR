import { useState, useCallback } from 'react';
import axios from 'axios';

// Custom hook for game submission
export default function useSubmitGame (id) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitGame = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Missing authentication token');
      
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/programming/submit/${id}/`,
        {}, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ');
    } finally {
      setIsSubmitting(false);
    }
  }, [id]);

  return { submitGame, isSubmitting, error, success };
};
