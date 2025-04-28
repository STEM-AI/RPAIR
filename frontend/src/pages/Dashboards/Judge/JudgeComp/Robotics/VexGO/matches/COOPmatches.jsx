import { useState , useEffect} from "react";
import { FaTrophy, FaCheck, FaPlay, FaChartBar, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMatchContext } from "./MatchContext";
import Alert from "../../../../../../../components/Alert/Alert";
import axios from "axios";
import { useEventNameContext } from "../../../../../../../context/EventName";
import GameScheduleForm from "../../../../../../../components/Schedule/GameScheduleForm";

import SheetCoop from "./SheetCoop";
import Back from "../../../../../../../components/Back/Back";

const COOPMatch = () => {
    const { currentCompetition } = useEventNameContext();
  const { matches, setCurrentMatch } = useMatchContext();
  const [showRanking, setShowRanking] = useState(false);
  const [scores, setScores] = useState({});
  const [completedMatches, setCompletedMatches] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const token = localStorage.getItem("access_token");
  const [gameTime, setGameTime] = useState("");
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

  
  const event_name = currentCompetition


      const formData = {
        stage: "coop",
        game_time: gameTime
      }
  const fetchCoopRankings = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/vex-go/${event_name}/coop/rank/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setRankings(response.data);
  } catch (error) {
    console.error("Error fetching coop rankings:", error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
  };
  

    const handleToggleRanking = () => {
    setShowRanking(prev => {
      const newState = !prev;
      if (newState) {
        fetchCoopRankings(); // جلب البيانات فقط عند عرض الترتيب
      }
      return newState;
    });
  };


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
    console.log("Schedule:", schedule);
    

  } catch (err) {
    console.error("Error posting schedule:", err);
    console.log("Error Response:", err.response.data);
    console.log(event_name);
    
    
  }
};




  const handleSaveScore = (matchId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [matchId]: score,
    }));
  };


  const handleStartMatch = (match) => {
    setCurrentMatch({
      ...match,
      type: 'coop',
      mode: 'coop'
    });
    setSelectedMatch(match); // Corrected line
  };

  // Mark match as completed
  const handleMarkAsDone = (matchId) => {
  Alert.confirm({
    title: 'Submit Final Score?',
    html: `<p>You're about to submit your final score of <strong>${scores[matchId] || 0}</strong> points.</p>`,
    confirmText: 'Confirm Submission',
    cancelText: 'Cancel',
    onConfirm: () => {
      // نقل عملية التحديث هنا لتتم فقط عند التأكيد
      setCompletedMatches((prev) => ({
        ...prev,
        [matchId]: true,
      }));
      Alert.success({
        title: 'Score Submitted!',
        text: 'Your results have been successfully recorded'
      });
    },
    });
  };



  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

   const updateRankings = () => {
  if (!schedule || schedule.length === 0) return; // تأكد أن هناك بيانات

  const teamScores = {};

  schedule.forEach(({ id, team1_name, team2_name }) => {
    const matchScore = scores[id] ?? 0;
    teamScores[team1_name] = (teamScores[team1_name] || 0) + matchScore;
    teamScores[team2_name] = (teamScores[team2_name] || 0) + matchScore;
  });

  const sortedRankings = Object.entries(teamScores)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  setRankings(sortedRankings);
  console.log("Updated Rankings:", sortedRankings);
  };


  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
      {!selectedMatch ? ( 
      <>
          {/* Header */}
           <Back />
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2 flex items-center justify-center gap-2">
          <FaUsers className="text-3xl sm:text-4xl" /> COOP Matches
        </h1>
        <p className="text-base sm:text-lg text-gray-600">Track and manage cooperative matches</p>
      </div>
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition-all"
            >
              Set Schedule
            </button>
          </form>
        </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-indigo-50 p-2 sm:p-4 rounded-lg sm:rounded-xl border border-indigo-100">
          <h3 className="text-xs sm:text-sm font-medium text-indigo-700">Total</h3>
          <p className="text-xl sm:text-2xl font-bold text-indigo-600">{schedule.length}</p>
        </div>
        <div className="bg-green-50 p-2 sm:p-4 rounded-lg sm:rounded-xl border border-green-100">
          <h3 className="text-xs sm:text-sm font-medium text-green-700">Done</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {Object.values(completedMatches).filter(Boolean).length}
          </p>
        </div>
        <div className="bg-yellow-50 p-2 sm:p-4 rounded-lg sm:rounded-xl border border-yellow-100">
          <h3 className="text-xs sm:text-sm font-medium text-yellow-700">Pending</h3>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">
            {schedule.length - Object.values(completedMatches).filter(Boolean).length}
          </p>
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-white shadow-md sm:shadow-xl rounded-lg sm:rounded-xl overflow-hidden mb-6 sm:mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600">
              <tr>
                <th className="px-2 sm:px-4 py-2  text-xs font-medium text-white uppercase  text-center ">Match</th>
                <th className="px-2 sm:px-4 py-2  text-xs font-medium text-white uppercase  text-center">Teams</th>
                <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-white uppercase">Score</th>
                <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-white uppercase hidden sm:table-cell">Time</th>
                <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedule.map((match) => (
                <tr key={match.id} className={completedMatches[match.id] ? "bg-green-50" : "hover:bg-gray-50"}>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-center  text-gray-900 text-sm">#{match.id}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-sm">
                    <div className="flex flex-col text-center">
                      <span>{match.team1_name}</span>
                      <span className="text-xs text-gray-500">and</span>
                      <span>{match.team2_name}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-center text-sm">
                    {matches[match.id]?.score || 0}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-center text-sm hidden sm:table-cell">
                    {matches[match.id]?.totalTime ? formatTime(matches[match.id].totalTime) : '-'}
                  </td>
                 
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleStartMatch(match)}
                      disabled={completedMatches[match.id]}
                      className={`px-2 py-1 text-xs sm:text-sm rounded ${
                        completedMatches[match.id] 
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      title="Start Match"
                    >
                      <FaPlay className="inline sm:mr-1" />
                      <span className="hidden sm:inline">Start</span>
                    </button>
                    {/* <button
                      onClick={() => handleMarkAsDone(match.id)}
                      disabled={completedMatches[match.id]}
                      className={`inline-flex items-center px-2 py-1 text-xs sm:text-sm rounded ${
                        completedMatches[match.id]
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "text-white bg-green-600 hover:bg-green-700"
                      }`}
                      title="Mark Complete"
                    >
                      <FaCheck className="sm:mr-1" />
                      <span className="hidden sm:inline">Complete</span>
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* View Ranking Button */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <button
          onClick={handleToggleRanking}
          className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 border border-transparent text-sm sm:text-lg font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600"
        >
          <FaTrophy className="mr-1 sm:mr-2" />
          {showRanking ? "Hide Rankings" : "View Rankings"}
        </button>
      </div>

      {/* Rankings Table */}
     {showRanking && (
      <div className="bg-white shadow-md sm:shadow-xl rounded-lg sm:rounded-xl overflow-hidden mb-6 sm:mb-8">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-indigo-600 flex items-center">
          <FaChartBar className="text-white mr-2 text-lg sm:text-xl" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Team Rankings</h2>
        </div>
          <div className="overflow-x-auto">
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
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-indigo-700 uppercase">Rank</th>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-indigo-700 uppercase">Team</th>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-indigo-700 uppercase">Avg_score</th>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-indigo-700 uppercase">Medal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
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
                                  <td className="px-2 sm:px-4 py-2  whitespace-nowrap font-medium text-gray-900 text-sm">
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
                                  </td>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-sm text-center">{team.team__name}</td>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-bold text-sm text-center">
                                    {team.avg_score || 0}
                                  </td>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center">
                                    {rank === 1 && <span className="text-yellow-500 text-lg sm:text-xl">🥇</span>}
                                    {rank === 2 && <span className="text-gray-400 text-lg sm:text-xl">🥈</span>}
                                    {rank === 3 && <span className="text-amber-600 text-lg sm:text-xl">🥉</span>}
                                  </td>
                                </tr>
                              )
                            })}
                    </tbody>
                  </table>
                )}
        </div>
      </div>
    )}
          </>
        ) : (
          <SheetCoop 
                selectedMatch={selectedMatch} 
                eventName={event_name}
            onClose={() => setSelectedMatch(null)} 
      />
    )}
    </div>
  );
};

export default COOPMatch;
