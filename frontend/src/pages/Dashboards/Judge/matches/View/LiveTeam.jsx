import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

const LiveTeam = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const socketRef = useRef(null);
  const eventName = localStorage.getItem('selected_event_name');

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket(`ws://147.93.56.71:8000/ws/competition_event/${eventName}/`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Score Update:", data);

      if (data.game_id && data.score !== undefined) {
        // Update matches with new score
        setMatches(prevMatches => {
          const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);
          if (matchIndex === -1) {
            // Add new match if it doesn't exist
            return [...prevMatches, {
              code: data.game_id,
              team1: data.team1_name || 'Team 1',
              team2: data.team2_name || 'Team 2',
              score: data.score
            }];
          }

          // Update existing match
          const updatedMatches = [...prevMatches];
          updatedMatches[matchIndex] = {
            ...updatedMatches[matchIndex],
            score: data.score
          };
          return updatedMatches;
        });

        // Update last update time
        setLastUpdate(new Date());
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup WebSocket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [eventName]);

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaMedal className="text-yellow-400 text-xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaMedal className="text-yellow-700 text-xl" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Teamwork Matches</h1>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>


    
      {/* Recent Matches */}
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
  <h2 className="text-2xl font-bold text-center mb-4">Recent Matches</h2>

  {/* عرض الجدول في الشاشات الكبيرة */}
  <div className="hidden md:block">
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">Match Code</th>
          <th className="border border-gray-300 p-2">Team 1</th>
          <th className="border border-gray-300 p-2">Score</th>
          <th className="border border-gray-300 p-2">Team 2</th>
          <th className="border border-gray-300 p-2">Total Score</th>
        </tr>
      </thead>
      <tbody>
        {matches.map((match) => (
          <tr key={match.code} className="text-center">
            <td className="border border-gray-300 p-2">{match.code}</td>
            <td className="border border-gray-300 p-2">{match.team1}</td>
            <td className="border border-gray-300 p-2 text-blue-600 font-bold">{match.score || 0}</td>
            <td className="border border-gray-300 p-2">{match.team2}</td>
            <td className="border border-gray-300 p-2 bg-blue-100 text-blue-700 font-medium">{match.score || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* عرض البطاقات في الشاشات الصغيرة فقط */}
  <div className="block md:hidden">
    <div className="grid grid-cols-1 gap-4">
      {matches.map((match) => (
        <div
          key={match.code}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <div className="text-sm text-gray-500 mb-2 text-center">Match {match.code}</div>
          <div className="flex justify-between items-center">
            <div className="text-right flex-1">
              <div className="font-medium">{match.team1}</div>
              <div className="text-lg font-bold text-blue-600">{match.score || 0}</div>
            </div>
            <div className="mx-4 text-gray-400">vs</div>
            <div className="text-left flex-1">
              <div className="font-medium">{match.team2}</div>
              <div className="text-lg font-bold text-blue-600">{match.score || 0}</div>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
              Total Score: {match.score || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

        {/* Rankings Table */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Team Rankings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-4 text-left rounded-tl-lg">Rank</th>
                  <th className="py-3 px-4 text-left">Team</th>
                  <th className="py-3 px-4 text-center rounded-tr-lg">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr
                    key={team.name}
                    className={`border-b ${
                      index === 0
                        ? "bg-yellow-100"
                        : index === 1
                        ? "bg-gray-100"
                        : index === 2
                        ? "bg-yellow-50"
                        : "bg-white"
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      {getMedalIcon(index + 1)}
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-medium">{team.name}</td>
                    <td className="py-3 px-4 text-center font-bold">{team.total || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LiveTeam;
