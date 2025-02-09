

import { useState } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import Calculator from "../Scores/Scores";

const Skills = () => {
  const [expandedRounds, setExpandedRounds] = useState({});
  const [scores, setScores] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [scoreType, setScoreType] = useState("driver"); // alternates between "driver" and "auto"

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

  const openCalculator = (team, round) => {
    setSelectedTeam(team);
    setSelectedRound(round);
    setShowCalculator(true);
  };

  const handleScoreCalculated = (calculatedScore) => {
    if (!selectedTeam || !selectedRound) return;

    setScores((prev) => {
      const newScores = { ...prev };
      if (!newScores[selectedRound]) newScores[selectedRound] = {};
      if (!newScores[selectedRound][selectedTeam.id]) newScores[selectedRound][selectedTeam.id] = { auto: 0, driver: 0, total: 0 };

      newScores[selectedRound][selectedTeam.id][scoreType] = calculatedScore;

      // تحديث الـ Total Score
      newScores[selectedRound][selectedTeam.id].total =
        newScores[selectedRound][selectedTeam.id].auto +
        newScores[selectedRound][selectedTeam.id].driver;

      return newScores;
    });

    // تبديل نوع السكور بين "driver" و "auto" بعد كل حساب
    setScoreType((prevType) => (prevType === "driver" ? "auto" : "driver"));
    setShowCalculator(false);
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
          <table className="min-w-full table-auto border border-gray-200 text-center rounded-lg">
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
                  


                  {/* Driver Score */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      className="w-16 p-1 border rounded text-center"
                      value={scores[round]?.[team.id]?.driver || ""}
                      readOnly
                    />
                  </td>

                                    {/* Auto Score */}
                                    <td className="py-3 px-4">
                    <input
                      type="number"
                      className="w-16 p-1 border rounded text-center"
                      value={scores[round]?.[team.id]?.auto || ""}
                      readOnly
                    />
                  </td>

                  {/* Total Score */}
                  <td className="py-3 px-4 font-bold text-blue-600">
                    {scores[round]?.[team.id]?.total || 0}
                  </td>

                  <td className="py-3 px-4 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => openCalculator(team, round)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-green-600 transition text-xs md:text-sm"
                    >
                      <AiOutlineCalculator /> Calculate
                    </button>
                    <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
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

      {showCalculator && selectedTeam && selectedRound && (
        <Calculator
          onCalculate={handleScoreCalculated}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
};

export default Skills;
