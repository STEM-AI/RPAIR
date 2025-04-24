

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
   const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const event_name = currentCompetition;

  
  const formData = {
    stage: "teamwork",
    game_time: gameTime,
  };

 const fetchRankings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/event/${event_name}/teamwork-rank/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRankings(response.data);
    } catch (error) {
      console.error("Error fetching rankings:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // تعديل هنا: جلب الترتيبات عند الضغط على الزر
  const handleToggleRanking = () => {
    setShowRanking(prev => {
      const newState = !prev;
      if (newState) {
        fetchRankings(); // جلب البيانات فقط عند عرض الترتيب
      }
      return newState;
    });
  };
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

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mb-8">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <Th className="w-12">Match</Th>
            <Th className="text-left">Team 1</Th>
            <Th className="text-left">Team 2</Th>
            <Th className="w-32">Score</Th>
            <Th className="w-40">Actions</Th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {schedule.map((match) => (
              <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                <Td className="font-medium text-indigo-600">#{match.id}</Td>
                <Td className="text-left">
                  <div className="flex flex-col">
                    <span className="font-medium">{match.team1_name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">#{match.team1}</span>
                  </div>
                </Td>
                <Td className="text-left">
                  <div className="flex flex-col">
                    <span className="font-medium">{match.team2_name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">#{match.team2}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-semibold text-green-600 text-lg">
                      {tempScores[match.id] ?? scores[match.id] ?? 0}
                    </span>
                    {tempScores[match.id] !== undefined && (
                      <button
                        onClick={() => handleSaveScore(match.id)}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Save score"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </Td>
                <Td>
                  <button
                    onClick={() => handleOpenCalculator(match.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none transition-all"
                  >
                    <span className="hidden sm:inline mr-1">Calculate</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
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
          eventName={event_name}
        />
      )}

      
  {/* Ranking Section */}
   <div className="flex justify-center mt-4 sm:mt-6 mb-4">
        <button
          onClick={handleToggleRanking}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 gap-2"
        >
          <FaTrophy className="shrink-0" />
          <span className="hidden sm:inline">View Ranking</span>
          <span className="sm:hidden">Ranking</span>
        </button>
      </div>

   {showRanking && (
  <div className="overflow-x-auto shadow-lg rounded-xl mt-4 bg-white p-4 border border-gray-200">
    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-2">
      <FaTrophy className="text-yellow-500" />
      Team Rankings
      <FaTrophy className="text-yellow-500" />
    </h2>
    
    {isLoading ? (
      <div className="text-center py-8">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" 
             xmlns="http://www.w3.org/2000/svg" fill="none" 
             viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" 
                  stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-3 text-gray-600">Loading rankings...</p>
      </div>
    ) : error ? (
      <div className="text-center py-4 text-red-500">
        ⚠️ Error loading rankings: {error}
      </div>
    ) : rankings.length === 0 ? (
      <div className="text-center py-4 text-gray-500">
        🏟️ No rankings available yet
      </div>
    ) : (
      <table className="w-full border-collapse" aria-label="Team rankings">
        <thead>
          <tr className="bg-gray-50">
            <Th className="text-center w-20">Rank</Th>
            <Th className="text-left">Team</Th>
            <Th className="text-right pr-6">Avg Score</Th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((team, index) => {
            const rank = index + 1;
            return (
              <tr
                key={team.team}
                className={`transition-all duration-150 ${
                  rank <= 3 ? 'bg-gradient-to-r' : 'hover:bg-gray-50'
                } ${
                  rank === 1 ? 'from-yellow-50/50 to-yellow-50' :
                  rank === 2 ? 'from-gray-50/50 to-gray-50' :
                  rank === 3 ? 'from-amber-50/50 to-amber-50' : ''
                }`}
              >
                <Td className="text-center font-semibold">
                  <div className="flex items-center justify-center">
                    {rank <= 3 ? (
                      <span className={` w-6 h-6 rounded-full flex items-center justify-center 
                        ${rank === 1 ? 'bg-yellow-400' : 
                          rank === 2 ? 'bg-gray-400' : 'bg-amber-600'} text-white`}>
                        {rank}
                      </span>
                    ) : (
                      <span className="text-gray-600">{rank}</span>
                    )}
                  </div>
                </Td>
                <Td className="text-left">
                  <div className="flex items-center space-x-3">
                    <span className=" w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">#{team.team}</span>
                    </span>
                    <span className="font-medium text-gray-800">{team.team__name}</span>
                  </div>
                </Td>
                <Td className="text-right pr-6">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="font-semibold text-blue-600">
                      {typeof team.avg_score === 'number' 
                        ? team.avg_score.toFixed(2) 
                        : 'N/A'}
                    </span>
                    {rank <= 3 && (
                      <span className={`text-sm px-2 py-1 rounded-full 
                        ${rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          rank === 2 ? 'bg-gray-100 text-gray-800' :
                          'bg-amber-100 text-amber-800'}`}>
                        {rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'}
                      </span>
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
)}
    </div>
  );
};
export default Teamwork;
