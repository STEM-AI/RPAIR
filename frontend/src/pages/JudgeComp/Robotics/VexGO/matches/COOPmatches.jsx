import { useState } from "react";
import { FaTrophy, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const COOPMatch = () => {
  const [showRanking, setShowRanking] = useState(false);
  const [scores, setScores] = useState({});
  const [completedMatches, setCompletedMatches] = useState({});
  const navigate = useNavigate();

  // بيانات المباريات
  const schedule = [
    { id: 1, team1: "Team A", team2: "Team B" },
    { id: 2, team1: "Team C", team2: "Team D" },
    { id: 3, team1: "Team E", team2: "Team A" },
    { id: 4, team1: "Team B", team2: "Team C" },
    { id: 5, team1: "Team D", team2: "Team E" },
  ];

  // تحديث النتيجة لكل مباراة
  const handleSaveScore = (matchId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [matchId]: score,
    }));
  };

  // التوجه إلى صفحة SheetGO
  const handleStartMatch = (matchId) => {
    navigate(`/sheetgo`);
  };

  // تحديد المباراة كمكتملة
  const handleMarkAsDone = (matchId) => {
    setCompletedMatches((prev) => ({
      ...prev,
      [matchId]: true,
    }));
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        COOP Matches
      </h1>

      {/* جدول المباريات */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-3 text-gray-500 uppercase text-center">Match</th>
              <th className="px-3 py-3 text-gray-500 uppercase text-center">Team 1</th>
              <th className="px-3 py-3 text-gray-500 uppercase text-center">Team 2</th>
              <th className="px-3 py-3 text-gray-500 uppercase text-center">Score</th>
              <th className="px-3 py-3 text-gray-500 uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedule.map((match) => (
              <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 text-center">{match.id}</td>
                <td className="px-3 py-2 text-center">{match.team1}</td>
                <td className="px-3 py-2 text-center">{match.team2}</td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    className="w-16 text-center border rounded"
                    value={scores[match.id] || ""}
                    onChange={(e) => handleSaveScore(match.id, e.target.value)}
                  />
                </td>
                <td className="px-3 py-2 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleStartMatch(match.id)}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => handleMarkAsDone(match.id)}
                    disabled={completedMatches[match.id]}
                    className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-1 ${
                      completedMatches[match.id] ? "bg-gray-400 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    <FaCheck />
                    
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* زر إظهار الترتيب */}
      <div className="flex justify-center mt-6 mb-4">
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors gap-2"
        >
          <FaTrophy className="text-lg" />
          <span>View Ranking</span>
        </button>
      </div>

      {/* جدول الترتيب */}
      {showRanking && (
        <div className="overflow-x-auto shadow-xl rounded-lg mt-5 bg-white p-4 border border-gray-300">
          <h2 className="text-lg sm:text-xl font-extrabold text-center text-gray-800 mb-4">
            🏆 Ranking Table
          </h2>
          <table className="min-w-full border text-center rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-gray-500 uppercase">Rank</th>
                <th className="px-3 py-2 text-gray-500 uppercase">Team</th>
                <th className="px-3 py-2 text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(scores)
                .sort((a, b) => b[1] - a[1]) // ترتيب الفرق حسب النقاط
                .map(([matchId, score], index) => (
                  <tr key={matchId}>
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">Match {matchId}</td>
                    <td className="px-3 py-2 text-blue-600">{score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default COOPMatch;


