import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal, FaSyncAlt } from "react-icons/fa";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import useGetScore from "../../../../../hooks/Schedule/GetScore";

const LiveTeamVex = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [showRankings, setShowRankings] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);
  const [searchParams] = useSearchParams();
  const eventName = searchParams.get('eventName');
  const eventId = searchParams.get('eventId');


   const { 
      score: serverScores, 
      refetch: refetchScores 
    } = useGetScore(eventId, "teamwork");
  
    // Initialize matches from serverScores
    useEffect(() => {
      if (serverScores) {
        setMatches(serverScores);
      }
    }, [serverScores]);
  const fetchRankings = async () => {
    setIsLoading(true);
    if (!eventName || !eventId) {
      console.error("No event name found");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/event/${eventId}/teamwork-rank`, {
      
      });
      setRankings(response.data);
      setShowRankings(true);
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
   

    socketRef.current = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/teamwork/`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.game_id && data.score !== undefined) {
        setMatches(prevMatches => {
          let updatedMatches;

          const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);
          if (matchIndex === -1) {
            updatedMatches = [...prevMatches, {
              code: data.game_id || data.id,
              team1: data.team1_name || 'Team 1',
              team2: data.team2_name || 'Team 2',
              score: data.score
            }];
          } else {
            updatedMatches = [...prevMatches];
            updatedMatches[matchIndex] = {
              ...updatedMatches[matchIndex],
              score: data.score
            };
          }

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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Live-Team</title>
      </Helmet>


      {/* Header Section */}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          Teamwork Challenge
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <FaSyncAlt className="animate-spin" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Recent Matches Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4">
          <h2 className="text-xl font-bold text-white text-center">Recent Matches</h2>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team 1</th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team 2</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches.map((match) => (
                <tr key={match.code} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{match.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{match.team1}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-blue-600">{match.score || 0}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">{match.team2}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold bg-blue-50 text-blue-700 rounded-lg mx-2">
                    {match.score || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden">
          <div className="grid grid-cols-1 gap-4 p-4">
            {matches.map((match) => (
              <div
                key={match.code || match.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="text-center text-sm font-medium text-gray-500 mb-3">Match {match.code || match.id}</div>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="font-medium text-gray-700">{match.team1}</div>
                  </div>
                  <div className="mx-2 text-center">
                    <div className="text-2xl font-bold text-blue-600">{match.score || 0}</div>
                    <div className="text-xs text-gray-400">Teamwork Score</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="font-medium text-gray-700">{match.team2}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings Section */}
      <div className="flex justify-center mb-6">
        <button
          onClick={fetchRankings}
          disabled={isLoading}
          className={`inline-flex items-center px-6 py-3 rounded-full font-medium text-white shadow-lg ${
            isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
          } transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2`}
        >
          {isLoading ? (
            <FaSyncAlt className="animate-spin mr-2" />
          ) : (
            <FaTrophy className="mr-2" />
          )}
          {isLoading ? 'Loading...' : 'View Teamwork Rankings'}
        </button>
      </div>

      {showRankings && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4">
            <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
              <FaTrophy />
              Teamwork Challenge Rankings
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.map((team, index) => (
                  <tr
                    key={team.team}
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
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.team__name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                        {team.avg_score.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTeamVex;