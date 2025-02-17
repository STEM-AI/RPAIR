

import { useState } from "react";
import { FaChevronDown, FaCheck, FaTrophy } from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import CalculatorSkills from "../Scores/ScoresSkills";

const Skills = () => {
  const [expandedRounds, setExpandedRounds] = useState({});
  const [scores, setScores] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [scoreType, setScoreType] = useState(null);
  const [showRanking, setShowRanking] = useState(false);

  const teams = [
    { id: 1, name: "Team Alpha", matchCode: "A123" },
    { id: 2, name: "Team Beta", matchCode: "B456" },
    { id: 3, name: "Team Gamma", matchCode: "C789" },
  ];

  const toggleRound = (round) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [round]: !prev[round],
    }));
  };

  const openCalculator = (team, round, type) => {
    setSelectedTeam(team);
    setSelectedRound(round);
    setScoreType(type);
    setShowCalculator(true);

    setScores((prev) => {
      const newScores = { ...prev };
      if (!newScores[round]) newScores[round] = {};
      if (!newScores[round][team.id]) {
        newScores[round][team.id] = { auto: 0, driver: 0, total: 0 };
      }
      return newScores;
    });
  };

  const handleScoreCalculated = (calculatedScore) => {
    if (!selectedTeam || !selectedRound || !scoreType) return;

    setScores((prev) => {
      const newScores = { ...prev };
      if (!newScores[selectedRound]) newScores[selectedRound] = {};
      if (!newScores[selectedRound][selectedTeam.id]) {
        newScores[selectedRound][selectedTeam.id] = { auto: 0, driver: 0, total: 0 };
      }

      newScores[selectedRound][selectedTeam.id][scoreType] = calculatedScore || 0;
      newScores[selectedRound][selectedTeam.id].total =
        newScores[selectedRound][selectedTeam.id].auto +
        newScores[selectedRound][selectedTeam.id].driver;

      return newScores;
    });

    setShowCalculator(false);
  };

  const calculateRankings = () => {
    let allScores = [];
    Object.values(scores).forEach((round) => {
      Object.entries(round).forEach(([teamId, teamScores]) => {
        const team = teams.find((t) => t.id === parseInt(teamId));
        allScores.push({ ...team, total: teamScores.total });
      });
    });

    return allScores.sort((a, b) => b.total - a.total);
  };

  const renderTable = (round) => (
    <div className="mb-6">
      <div
        className="flex justify-between items-center bg-gray-200 px-6 py-3 rounded-lg cursor-pointer"
        onClick={() => toggleRound(round)}
      >
        <h1 className="text-xl font-bold text-gray-700">{`Round ${round}`}</h1>
        <FaChevronDown className={`text-gray-600 transition-transform ${expandedRounds[round] ? "rotate-180" : ""}`} />
      </div>

      {expandedRounds[round] && (
        <div className="overflow-x-auto shadow-lg rounded-lg mt-3">
          <table className="w-full table-auto border border-gray-200 text-center rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-xs md:text-sm lg:text-base">
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Team Name</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Match Code</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Driver Score</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Auto Score</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Total Score</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white text-xs md:text-sm lg:text-base">
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{team.name}</td>
                  <td className="py-3 px-4">{team.matchCode}</td>
                  <td className="py-3 px-4">{scores[round]?.[team.id]?.driver ?? 0}</td>
                  <td className="py-3 px-4">{scores[round]?.[team.id]?.auto ?? 0}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">
                    {scores[round]?.[team.id]?.total ?? 0}
                  </td>
                  <td className="py-3 px-4 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => openCalculator(team, round, "driver")}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                    >
                      Driver <AiOutlineCalculator />
                    </button>
                    <button
                      onClick={() => openCalculator(team, round, "auto")}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                    >
                      Auto <AiOutlineCalculator />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-4 md:mx-10 p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
      Skills Matches
      </h1>

      {renderTable("1")}
      {renderTable("2")}
      {renderTable("3")}

      {showCalculator && selectedTeam && selectedRound && (
        <CalculatorSkills
          onCalculate={handleScoreCalculated}
          onClose={() => setShowCalculator(false)}
          scoreType={scoreType}
        />
      )}

      <button
        onClick={() => setShowRanking(!showRanking)}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition mx-auto mb-4"
      >
        <FaTrophy /> View Ranking
      </button>

      {showRanking && (
        <div className="overflow-x-auto shadow-lg rounded-lg mb-6">
          <table className="w-full table-auto border border-gray-200 text-center rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th>Rank</th>
                <th>Team Name</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {calculateRankings().map((team, index) => (
                <tr key={team.id}>
                  <td>{index + 1}</td>
                  <td>{team.name}</td>
                  <td>{team.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Skills;


