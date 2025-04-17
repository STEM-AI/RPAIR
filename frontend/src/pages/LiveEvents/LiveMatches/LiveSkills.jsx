

import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal, FaSyncAlt, FaRobot, FaCar } from "react-icons/fa";
import { BiSolidJoystick } from "react-icons/bi";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const LiveSkillsVex = () => {
  const [rankings, setRankings] = useState([]);
  const [scores, setScores] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showRankings, setShowRankings] = useState(false);
  const [activeRounds, setActiveRounds] = useState([1]);
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/event/${eventName}/teamwork-rank`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
              team1: data.team1_name || 'Team 1',
              team2: data.team2_name || 'Team 2',
              score: data.score,
              round: data.round || 1
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

        if (data.round && !activeRounds.includes(data.round)) {
          setActiveRounds(prevRounds => [...prevRounds, data.round]);
        }
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
  }, [eventName, activeRounds]);

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
                    <title>Live-Skills</title>
                  </Helmet>   
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          Skills Challenge
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <FaSyncAlt className="animate-spin" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Rounds Section - Now with two tables side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">


      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4">
            <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
              <BiSolidJoystick /> Driver Rounds
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.filter(team => team.round === 2).map((team) => (
                  <tr key={`driver-${team.code}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{team.team1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {team.score.driver > 0 ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-medium">
                          {team.score.driver}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Auto Rounds Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
            <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
              <FaRobot /> Auto Rounds
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.filter(team => team.round === 1).map((team) => (
                  <tr key={`auto-${team.code}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{team.team1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {team.score.autonomous > 0 ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                          {team.score.autonomous}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>

      {/* Rankings Section - Unchanged */}
      <div className="flex justify-center my-8">
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
          {isLoading ? 'Loading...' : 'View Skills Rankings'}
        </button>
      </div>

      {showRankings && (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Score</th>
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

export default LiveSkillsVex;