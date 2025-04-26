import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal, FaSyncAlt, FaRobot, FaCar, FaListOl } from "react-icons/fa";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const LiveVex123 = () => {
  const [rankings, setRankings] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const eventName = 'vex_123';
  const URL = `${process.env.REACT_APP_API_URL}/vex-123/${eventName}/rank/`;
  const intervalRef = useRef();

  const fetchRankings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URL);
      setRankings(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
    intervalRef.current = setInterval(fetchRankings, 10000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="w-6 h-6 text-amber-400" />;
      case 2:
        return <FaMedal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <FaMedal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-600 font-medium">{rank}</span>;
    }
  };

  const handleRefresh = () => {
    if (!isLoading) {
      fetchRankings();
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Live-Robotics</title>
      </Helmet>
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          VEX 123 Challenge
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className={`hover:text-blue-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaSyncAlt className={`${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Rankings Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4">
          <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <FaTrophy />
            Skills Challenge Rankings
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((team, index) => (
                <tr
                  key={team.team}
                  className={`${
                    index === 0 ? "bg-amber-50" : 
                    index === 1 ? "bg-gray-50" : 
                    index === 2 ? "bg-amber-100" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getMedalIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{team.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.team_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      {team.total_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {team.total_time_taken}s
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

export default LiveVex123;