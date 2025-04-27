// InterviewRankings.jsx
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaTrophy } from 'react-icons/fa';

const InterviewRankings = ({ apiUrl }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  const fetchRankings = async () => {
    if (!apiUrl) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'API endpoint not configured',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRankings(response.data);
      
      const rankingList = response.data.map((team, index) => 
        `<b>${index + 1}.</b> ${team.name} - ${team.interview_score} points`
      ).join('<br>');

      Swal.fire({
        title: `Interview Rankings`,
        html: rankingList || 'No rankings available yet',
        icon: 'scuccess',
        confirmButtonColor: '#4f46e5'
      });

    } catch (error) {
      console.error('Error fetching rankings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load rankings',
        text: error.response?.data?.message || 'Error fetching rankings',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={fetchRankings}
      disabled={loading}
      className={` px-6 py-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-lg flex items-center justify-center my-4 mx-auto transition-colors shadow-md hover:shadow-lg ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <span className="animate-spin">🌀</span>
      ) : (
        <>
          <FaTrophy className="mr-2" />
          Show Team Rankings
        </>
      )}
    </button>
  );
};

export default InterviewRankings;