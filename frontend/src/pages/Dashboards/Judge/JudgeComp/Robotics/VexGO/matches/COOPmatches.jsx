import { useState , useEffect} from "react";
import { FaTrophy, FaCheck, FaPlay, FaChartBar, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMatchContext } from "./MatchContext";
import Alert from "../../../../../../../components/Alert/Alert";
import axios from "axios";

const COOPMatch = () => {
  const { matches, setCurrentMatch } = useMatchContext();
  const [showRanking, setShowRanking] = useState(false);
  const [scores, setScores] = useState({});
  const [completedMatches, setCompletedMatches] = useState({});
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [gameTime, setGameTime] = useState("");
    const [rankings, setRankings] = useState([]);




  const event_name = 'vex_go'


      const formData = {
        "stage": "coop",
        "game_time": gameTime
      }


  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/vex-go/event/${event_name}/games/schedule/`,
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
  // Match data
 

  // Update match score
  const handleSaveScore = (matchId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [matchId]: score,
    }));
  };

  // Navigate to SheetGO
  const handleStartMatch = (match) => {
    setCurrentMatch({
      ...match,
      type: 'coop',
      mode: 'coop'
    });
    navigate("/SheetCoop");
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

  // Calculate rankings
  const calculateRankings = () => {
    const teamScores = {};
    
    schedule.forEach(match => {
      const score = parseInt(scores[match.id]) || 0;
      const teamScore = score / 2;
      
      teamScores[match.team1_name] = (teamScores[match.team1_name] || 0) + teamScore;
      teamScores[match.team2_name] = (teamScores[match.team2_name] || 0) + teamScore;
    });
    
    return Object.entries(teamScores)
      .map(([team, score]) => ({ team, score }))
      .sort((a, b) => b.score - a.score);
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
      
      {/* Header */}
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
                <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-white uppercase">Status</th>
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
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                      completedMatches[match.id] 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {completedMatches[match.id] ? "Done" : "Pending"}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleStartMatch(match)}
                      disabled={completedMatches[match.id]}
                      className={`px-2 py-1 text-xs sm:text-sm rounded ${
                        completedMatches[match.id] 
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      title="Start Match"
                    >
                      <FaPlay className="inline sm:mr-1" />
                      <span className="hidden sm:inline">Start</span>
                    </button>
                    <button
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
                    </button>
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
          onClick={() => setShowRanking(!showRanking)}
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2  text-center text-xs font-medium text-indigo-700 uppercase">Rank</th>
                  <th className="px-2 sm:px-4 py-2  text-center text-xs font-medium text-indigo-700 uppercase">Team</th>
                  <th className="px-2 sm:px-4 py-2  text-center text-xs font-medium text-indigo-700 uppercase">Score</th>
                  <th className="px-2 sm:px-4 py-2  text-center text-xs font-medium text-indigo-700 uppercase">Medal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calculateRankings().map((team, index) => (
                  <tr key={team.team} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-gray-900 text-sm">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-sm">{team.team}</td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-bold text-sm">{team.score || 0}</td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      {index === 0 && <span className="text-yellow-500 text-lg sm:text-xl">🥇</span>}
                      {index === 1 && <span className="text-gray-400 text-lg sm:text-xl">🥈</span>}
                      {index === 2 && <span className="text-amber-600 text-lg sm:text-xl">🥉</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default COOPMatch;