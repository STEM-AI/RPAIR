import React, { useState, useEffect } from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

const LiveSkills = () => {
  const [rankings, setRankings] = useState([]);
  const [scores, setScores] = useState({});
  const [expandedRounds, setExpandedRounds] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Function to load data from localStorage
  const loadData = () => {
    const savedRankings = JSON.parse(localStorage.getItem("skillsRankingTable")) || [];
    const savedScores = JSON.parse(localStorage.getItem("skillsScores")) || {};
    const savedExpanded = JSON.parse(localStorage.getItem("skillsExpandedRounds")) || {};

    setRankings(savedRankings);
    setScores(savedScores);
    setExpandedRounds(savedExpanded);
    setLastUpdate(new Date());
  };

  // Load data initially and set up auto-refresh
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Get medal icon based on rank
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

  // Add this new function to get team scores for a specific round
  const getTeamScoresForRound = (round, teamId) => {
    const roundScores = scores[round]?.[teamId] || { auto: 0, driver: 0 };
    return {
      auto: roundScores.auto || 0,
      driver: roundScores.driver || 0,
      total: (roundScores.auto || 0) + (roundScores.driver || 0)
    };
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header with last update time */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Skills Matches</h1>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>

      {/* Rankings Table */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Current Rankings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-4 text-left rounded-tl-lg">Rank</th>
                  <th className="py-3 px-4 text-left">Team</th>
                  <th className="py-3 px-4 text-center">Matches</th>
                  <th className="py-3 px-4 text-center">Avg Auto</th>
                  <th className="py-3 px-4 text-center">Avg Driver</th>
                  <th className="py-3 px-4 text-center rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((team) => (
                  <tr
                    key={team.id}
                    className={`border-b ${
                      team.style === "gold"
                        ? "bg-yellow-100"
                        : team.style === "silver"
                        ? "bg-gray-100"
                        : team.style === "bronze"
                        ? "bg-yellow-50"
                        : "bg-white"
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      {getMedalIcon(team.rank)}
                      {team.rank}
                    </td>
                    <td className="py-3 px-4 font-medium">{team.name}</td>
                    <td className="py-3 px-4 text-center">{team.matchesPlayed}</td>
                    <td className="py-3 px-4 text-center">{team.autoAvg}</td>
                    <td className="py-3 px-4 text-center">{team.driverAvg}</td>
                    <td className="py-3 px-4 text-center font-bold">{team.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* All Rounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((round) => (
          <div key={round} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-center">
              Round {round}
              {scores[round] && Object.keys(scores[round]).length > 0 && (
                <span className="ml-2 text-sm text-green-500">● Live</span>
              )}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 text-left text-sm">Team</th>
                    <th className="py-2 px-3 text-center text-sm">Auto</th>
                    <th className="py-2 px-3 text-center text-sm">Driver</th>
                    <th className="py-2 px-3 text-center text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((team) => {
                    const roundScores = getTeamScoresForRound(round, team.id);
                    return (
                      <tr key={team.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm">{team.name}</td>
                        <td className="py-2 px-3 text-center text-sm">
                          {roundScores.auto > 0 ? (
                            <span className="text-green-600 font-medium">{roundScores.auto}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center text-sm">
                          {roundScores.driver > 0 ? (
                            <span className="text-blue-600 font-medium">{roundScores.driver}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center text-sm font-bold">
                          {roundScores.total > 0 ? roundScores.total : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSkills;