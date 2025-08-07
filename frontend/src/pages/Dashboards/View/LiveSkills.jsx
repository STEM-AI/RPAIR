import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";
import axios from "axios";
import { Helmet } from 'react-helmet-async';


const LiveSkillsIQ = () => {
  const [rankings, setRankings] = useState([]);
  const [scores, setScores] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  
    const [showRankings, setShowRankings] = useState(false);
  const [activeRounds, setActiveRounds] = useState([1]); // Start with Round 1 only
  const socketRef = useRef(null);
  const eventName = localStorage.getItem('selected_event_name');
 

  const token = localStorage.getItem("access_token");

  const fetchRankings = async () => {
    if (!eventName) {
      console.error("No event name found");
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
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
      }
    }
  };


  useEffect(() => {
    socketRef.current = new WebSocket(`wss://rpair.org/ws/competition_event/${eventName}/`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

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
          return <FaMedal className="text-yellow-400 text-xl" />;
        case 2:
          return <FaMedal className="text-gray-400 text-xl" />;          
        default:
          return  <FaMedal className="text-yellow-700 text-xl" />;
      }
    };

  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col items-center">
 <Helmet>
              <title>Live Skills Matches</title>
            </Helmet>                 
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Skills Matches</h1>
        <p className="text-sm text-gray-600">Last updated: {lastUpdate.toLocaleTimeString()}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 w-full max-w-4xl">
        {activeRounds.map((round) => (
          <div key={round} className="bg-white rounded-lg shadow-lg p-10 w-full text-center">
            <h3 className="text-2xl font-bold mb-6">Round {round}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left text-lg">Match Code</th>
                    <th className="py-3 px-4 text-left text-lg">Team</th>
                    <th className="py-3 px-4 text-center text-lg">Auto</th>
                    <th className="py-3 px-4 text-center text-lg">Driver</th>
                    <th className="py-3 px-4 text-center text-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.filter(team => team.round === round).map((team) => (
                    <tr key={team.code} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-lg">{team.code}</td>
                      <td className="py-3 px-4 text-lg">{team.team1}</td>
                      <td className="py-3 px-4 text-center text-lg">
                        {team.score.autonomous > 0 ? (
                          <span className="text-green-600 font-medium">{team.score.autonomous}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-lg">
                        {team.score.driver > 0 ? (
                          <span className="text-blue-600 font-medium">{team.score.driver}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-lg font-bold">
                        {team.score.autonomous + team.score.driver > 0
                          ? team.score.autonomous + team.score.driver
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Show Rankings Button */}
           
             <div className="flex justify-center mt-6 mb-4">
              <button
                onClick={fetchRankings}
                className="inline-flex items-center px-4 py-2 text-sm sm:text-base font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors gap-2"
              >
                <FaTrophy className="text-lg" /> 
                <span>View Ranking</span>
              </button>
            </div>
      
            {/* Rankings Table */}
            {showRankings && (
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
                          <th className="py-3 px-4 text-center rounded-tr-lg">Average Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rankings.map((team, index) => (
                          <tr
                            key={team.team}
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
                            <td className="py-3 px-4 font-medium">{team.team__name}</td>
                            <td className="py-3 px-4 text-center font-bold">{team.total_score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default LiveSkillsIQ;









