import React, { useEffect, useState, useRef ,useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { TiStopwatch } from "react-icons/ti";
import { FaTrophy, FaMedal, FaSyncAlt, FaRobot, FaCar, FaListOl } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";


const LiveProgramming = () => {
  const [rankings, setRankings] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const eventName = searchParams.get('eventName');
  const id = searchParams.get('id');


   

  const URL = `${process.env.REACT_APP_API_URL}/${eventName}/${id}/rank/`;
  const intervalRef = useRef(null);

  // Memoized fetch function
  const fetchRankings = useCallback(async () => {
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
  }, [URL]); // URL is dependency as it uses eventName

  // Setup interval and initial fetch
  useEffect(() => {
    fetchRankings();
    intervalRef.current = setInterval(fetchRankings, 60000); // 60 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchRankings]); // Re-run when fetchRankings changes

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1: return <FaTrophy className="w-6 h-6 text-amber-400" />;
      case 2: return <FaMedal className="w-6 h-6 text-gray-400" />;
      case 3: return <FaMedal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-gray-600 font-medium">{rank}</span>;
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
        <title>{eventName} Competition</title>
      </Helmet>

      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FaRobot className="w-12 h-12 text-blue-600" />
          <h1 className="text-3xl md:text-4xl  py-4 font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            {eventName} Live Challenge
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <FaSyncAlt 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''} cursor-pointer`}
              onClick={handleRefresh}
            />
            <span>
              Last updated: {lastUpdate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <FaListOl className="text-blue-600" />
            <span className="text-sm text-blue-800">
              {rankings.length} Teams Competing
            </span>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="border rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Team</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((team, index) => (
                <tr
                  key={team.team}
                  className={`${
                    index === 0 ? 'bg-amber-50/50 hover:bg-amber-50' :
                    index === 1 ? 'bg-gray-50/50 hover:bg-gray-50' :
                    index === 2 ? 'bg-amber-100/50 hover:bg-amber-100' : 
                    'hover:bg-gray-50'
                  } transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getMedalIcon(index + 1)}
                      {index < 3 && (
                        <span className={`text-xs font-semibold ${
                          index === 0 ? 'text-amber-600' :
                          index === 1 ? 'text-gray-600' :
                          'text-amber-700'
                        }`}>
                          {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : '2nd Runner-up'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">#{team.team}</span>
                      <span className="text-sm text-gray-500">{team.team_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 font-bold">
                      <FaTrophy className="w-4 h-4 mr-2" />
                      {team.score || 0} 
                    </span>
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rankings.length === 0 && !isLoading && (
          <div className="text-center py-8 bg-gray-50">
            <p className="text-gray-500">No rankings available yet</p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center">
          <FaSyncAlt className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default LiveProgramming;
