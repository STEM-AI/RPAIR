import React from 'react'

import React, { useEffect, useState } from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

const matchesData = [
  { code: "M001", team1: "FutureAlex", team2: "Osiris" },
  { code: "M002", team1: "FutureAlex", team2: "Monsters" },
  { code: "M003", team1: "Osiris", team2: "Monsters" },
];

export default function LiveDash() {
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(new Date());
  
    useEffect(() => {
      const fetchData = () => {
        const storedScores = JSON.parse(localStorage.getItem("matchScores")) || {};
        const storedRankings = JSON.parse(localStorage.getItem("teamRankings")) || [];
  
        const formattedMatches = Object.entries(storedScores).map(([matchCode, score]) => {
          const match = matchesData.find(m => m.code === matchCode);
          return match
            ? { matchCode, team1: match.team1, team2: match.team2, score }
            : null;
        }).filter(Boolean);
  
        setMatches(formattedMatches);
        setTeams(storedRankings);
        setLastUpdate(new Date());
      };
  
      fetchData();
      const interval = setInterval(fetchData, 5000);
  
      return () => clearInterval(interval);
    }, []);
  
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
          <p className="text-sm text-gray-600">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
  
        {/* Rankings Table */}
        <div className="mb-8">
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
  
        {/* Recent Matches */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Recent Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <div
                key={match.matchCode}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="text-sm text-gray-500 mb-2 text-center">Match {match.matchCode}</div>
                <div className="flex justify-between items-center">
                  <div className="text-right flex-1">
                    <div className="font-medium">{match.team1}</div>
                    <div className="text-lg font-bold text-blue-600">{match.score || 0}</div>
                  </div>
                  <div className="mx-4 text-gray-400">ft.</div>
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
    );
  };
  
 

