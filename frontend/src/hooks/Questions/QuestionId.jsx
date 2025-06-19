// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Questions({ id=26, type='python' }) {
//     const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//       const fetchQuestions = async () => {
//         const token = localStorage.getItem('accessToken');
//         try {
//             const params = {
//                 type: type,
//             };
        

//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/programming/questions/${id}/`,
//                       {
//                           headers: { Authorization: `Bearer ${token}` },
//                           params
//                       }
//             );
        
//         setQuestions(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (competitionEventId) fetchQuestions();
//   }, [id]);

//   return { questions, loading, error };
// }


import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useQuestion(id) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem('access_token'); // احصل على التوكن من التخزين المحلي
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/programming/question/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setQuestion(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuestion();
  }, [id]);

  return { question, loading, error };
}