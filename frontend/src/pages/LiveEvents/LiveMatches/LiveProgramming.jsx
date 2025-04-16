import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal, FaSyncAlt, FaUserGraduate } from "react-icons/fa";
import axios from "axios";

const LiveProgramming = () => {
  const [rankings, setRankings] = useState([]);
  const [scores, setScores] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const [showRankings, setShowRankings] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);
  const eventName = localStorage.getItem('selected_event_name');
  const token = localStorage.getItem("access_token");

  const fetchRankings = async () => {
    setIsLoading(true);
    if (!eventName) {
      console.error("No event name found");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/event/${eventName}/student-rank`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRankings(response.data);
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
    
    socketRef.current = new WebSocket(`wss://rpair.org/ws/competition_event/${eventName}/`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Score Update:", data);

      if (data.game_id && data.score !== undefined) {
        setMatches(prevMatches => {
          const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);
          if (matchIndex === -1) {
            return [...prevMatches, {
              code: data.game_id,
              student1: data.student1_name || 'Student 1',
              student2: data.student2_name || 'Student 2',
              score: data.score
            }];
          }
          const updatedMatches = [...prevMatches];
          updatedMatches[matchIndex] = {
            ...updatedMatches[matchIndex],
            score: data.score
          };
          return updatedMatches;
        });

        setLastUpdate(new Date());
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [eventName]);

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaMedal className="text-yellow-500 text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-2xl" />;
      case 3:
        return <FaMedal className="text-amber-600 text-2xl" />;
      default:
        return <span className="text-gray-500 font-medium">{rank}</span>;
    }
  };

  const getStudentRanking = (studentName) => {
    const student = rankings.find(s => s.student__name === studentName);
    return student ? rankings.indexOf(student) + 1 : '-';
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Programming Competition
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <FaSyncAlt className="animate-spin" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Student Matches Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4">
          <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <FaUserGraduate />
            Live Student Matches
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches.map((match) => (
                <React.Fragment key={match.code}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" rowSpan="2">
                      {match.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <span className="inline-block w-8 h-8 rounded-full bg-purple-100 text-purple-800  items-center justify-center">
                        {match.student1.charAt(0)}
                      </span>
                      {match.student1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
                        {match.score?.total || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStudentRanking(match.student1)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-800  items-center justify-center">
                        {match.student2.charAt(0)}
                      </span>
                      {match.student2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
                        {match.score?.total || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStudentRanking(match.student2)}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Rankings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4">
          <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <FaTrophy />
            Student Rankings
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((student, index) => (
                <tr
                  key={student.student}
                  className={`${
                    index === 0 ? "bg-amber-50" : 
                    index === 1 ? "bg-gray-50" : 
                    index === 2 ? "bg-amber-25" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getMedalIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-800  items-center justify-center">
                      {student.student__name.charAt(0)}
                    </span>
                    {student.student__name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                      {student.avg_score?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveProgramming;