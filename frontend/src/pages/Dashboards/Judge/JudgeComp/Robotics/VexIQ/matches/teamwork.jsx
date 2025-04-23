

import { useState, useEffect } from "react";
import ScoreTeams from "../Scores/scoreTeams";
import { FaTrophy, FaCheck } from "react-icons/fa";
import axios from "axios";
import { useEventNameContext } from "../../../../../../../context/EventName";
import GameScheduleForm from "../../../../../../../components/Schedule/GameScheduleForm";
const Teamwork = () => {
  const { currentCompetition } = useEventNameContext();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scores, setScores] = useState({});
  const [rankings, setRankings] = useState([]);
  const [tempScores, setTempScores] = useState({});
  const [showRanking, setShowRanking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [gameTime, setGameTime] = useState("");
  const token = localStorage.getItem("access_token");

  const formData = {
    stage: "teamwork",
    game_time: gameTime,
  };

  const event_name = currentCompetition;

  // Handle posting game schedule and then fetch updated schedule
  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/core/event/${event_name}/games/schedule/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("Schedule posted successfully");
    console.log("Response Data:", response.data); 

    setSchedule(response.data); 

  } catch (err) {
    console.error("Error posting schedule:", err);
  }
};


  useEffect(() => {
    updateRankings();
  }, [scores]);

  useEffect(() => {
  if (schedule.length > 0) {
    updateRankings();
  }
}, [schedule]);

  const handleOpenCalculator = (matchCode) => {
    console.log("matchCode" , matchCode);
    
    setSelectedMatch(matchCode);
  };

  const handleCalculate = (score) => {
    setTempScores((prev) => ({
      ...prev,
      [selectedMatch]: score,
    }));
    setSelectedMatch(null);
  };

  const handleSaveScore = (matchCode) => {
    if (tempScores[matchCode] !== undefined) {
      setScores((prevScores) => ({
        ...prevScores,
        [matchCode]: tempScores[matchCode],
      }));
    }
  };

  const updateRankings = () => {
  if (!schedule || schedule.length === 0) return; // تأكد أن هناك بيانات

  const teamScores = {};

  schedule.forEach(({ id, team1, team2 }) => {
    const matchScore = scores[id] ?? 0;
    teamScores[team1] = (teamScores[team1] || 0) + matchScore;
    teamScores[team2] = (teamScores[team2] || 0) + matchScore;
  });

  const sortedRankings = Object.entries(teamScores)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  setRankings(sortedRankings);
  console.log("Updated Rankings:", sortedRankings);
};
// Reusable table components
const Th = ({ children, className }) => (
  <th className={`px-2.5 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider text-center ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className }) => (
  <td className={`px-2.5 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 text-center ${className}`}>
    {children}
  </td>
);
  
  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
        Teamwork Matches
      </h1>
      <div className="flex justify-center mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4 items-center">
            <input
              type="time"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
              className="px-4 py-2 rounded-md border border-indigo-300 focus:ring-2 focus:ring-indigo-200 text-lg"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-all"
            >
              Set Schedule
            </button>
          </form>
        </div>

  <div className="overflow-x-auto rounded-lg bg-white shadow-sm sm:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Match</Th>
                <Th>Team 1</Th>
                <Th className="hidden sm:table-cell">Team1-Code</Th>
                <Th>Team 2</Th>
                <Th className="hidden sm:table-cell">Team2-Code</Th>
                <Th>Score</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedule.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50/50">
                  <Td>{match.id}</Td>
                  <Td>{match.team1_name}</Td>
                  <Td className="hidden sm:table-cell">{match.team1}</Td>
                  <Td>{match.team2_name}</Td>
                  <Td className="hidden sm:table-cell">{match.team2}</Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-sm font-medium text-blue-600">
                        {tempScores[match.id] ?? scores[match.id] ?? 0}
                      </span>
                      {tempScores[match.id] !== undefined && (
                        <button
                          onClick={() => handleSaveScore(match.id)}
                          className="text-green-600 hover:text-green-800 p-1"
                        >
                          <FaCheck className="text-sm" />
                        </button>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <button
                      onClick={() => handleOpenCalculator(match.id)}
                      className="inline-flex items-center px-2.5 py-1 text-xs sm:text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors whitespace-nowrap"
                    >
                      <span className="hidden xs:inline">Calculator</span>
                      <span className="xs:hidden">Calc</span>
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {selectedMatch && (
        <ScoreTeams
          onCalculate={handleCalculate}
          onClose={() => setSelectedMatch(null)}
          gameId={selectedMatch}
          mode="manual"
        />
      )}

      
  {/* Ranking Section */}
  <div className="flex justify-center mt-4 sm:mt-6 mb-4">
    <button
      onClick={() => setShowRanking(!showRanking)}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 gap-2"
    >
      <FaTrophy className="shrink-0" />
      <span className="hidden sm:inline">View Ranking</span>
      <span className="sm:hidden">Ranking</span>
    </button>
  </div>

  {showRanking && (
    <div className="overflow-x-auto shadow-sm sm:shadow-xl rounded-lg mt-4 bg-white p-3 sm:p-4 border border-gray-200">
      <h2 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
        🏆 Team Rankings
      </h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <Th>Rank</Th>
            <Th>Team</Th>
            <Th>Score</Th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((team, index) => (
            <tr key={team.name} className="hover:bg-gray-50/50">
              <Td>{index + 1}</Td>
              <Td>{team.name}</Td>
              <Td className="font-medium text-blue-600">{team.total}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>


  );
};

export default Teamwork;
