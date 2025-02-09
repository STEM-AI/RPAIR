

import { useState } from "react";
import axios from "axios";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const Teamwork = () => {
  const [scores, setScores] = useState({});
  const [expandedRounds, setExpandedRounds] = useState({});
  const [loading, setLoading] = useState({});

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

  const handleScoreChange = (id, round, field, value) => {
    setScores({
      ...scores,
      [id]: { ...scores[id], [round]: { ...scores[id]?.[round], [field]: Number(value) } },
    });
  };

  const handleSave = async (team, round) => {
    const teamData = {
      team: team.name,
      matchCode: team.matchCode,
      driverSkills: scores[team.id]?.[round]?.driverSkills || 0,
      autoSkills: scores[team.id]?.[round]?.autoSkills || 0,
      round: round,
    };

    console.log(`Sending Scores for ${team.name} in Round ${round}:`, teamData);

    setLoading((prev) => ({ ...prev, [team.id]: true }));

    try {
      const response = await axios.post("https://your-backend-api.com/save-score", teamData);
      console.log(`Response for ${team.name}:`, response.data);
      alert(`Scores for ${team.name} saved successfully!`);
    } catch (error) {
      console.error(`Error saving scores for ${team.name}:`, error);
      alert(`Failed to save scores for ${team.name}.`);
    } finally {
      setLoading((prev) => ({ ...prev, [team.id]: false }));
    }
  };

  const renderTable = (round) => (
    <div className="mb-6">
      <div className="flex justify-between items-center bg-gray-200 px-6 py-3 rounded-lg cursor-pointer" onClick={() => toggleRound(round)}>
        <h1 className="text-xl font-bold text-gray-700">{`Round ${round}`}</h1>
        <FaChevronDown className={`text-gray-600 transition-transform ${expandedRounds[round] ? "rotate-180" : ""}`} />
      </div>

      {expandedRounds[round] && (
        <div className="overflow-x-auto shadow-lg rounded-lg mt-3">
          <table className="min-w-full table-auto border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-xs md:text-sm lg:text-base">
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Team Name</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Match Code</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Driver Skills</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Auto Skills</th>
                <th className="py-3 px-4 text-gray-600 font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white text-xs md:text-sm lg:text-base">
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{team.name}</td>
                  <td className="py-3 px-4">{team.matchCode}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      className="w-16 p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                      value={scores[team.id]?.[round]?.driverSkills || ""}
                      onChange={(e) => handleScoreChange(team.id, round, "driverSkills", e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      className="w-16 p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                      value={scores[team.id]?.[round]?.autoSkills || ""}
                      onChange={(e) => handleScoreChange(team.id, round, "autoSkills", e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-xs md:text-sm">
                      Go
                    </button>
                    <button
                      onClick={() => handleSave(team, round)}
                      className={`bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition ${loading[team.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading[team.id]}
                    >
                      <FaCheck />
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
      {renderTable("1")}
      {renderTable("2")}
      {renderTable("3")}
    </div>
  );
};

export default Teamwork;
