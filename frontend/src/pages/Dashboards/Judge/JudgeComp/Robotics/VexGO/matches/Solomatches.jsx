import Alert from "../../../../../../../components/Alert/Alert";
import { useState, useEffect } from "react";
import { FaTrophy, FaCheck, FaPlay, FaChartBar,FaFlagCheckered, FaChevronLeft, FaChevronRight, FaClock, FaPause, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMatchContext } from './MatchContext';
import SheetSolo from "./SheetSolo"
import { useEventNameContext } from "../../../../../../../context/EventName";
import axios from "axios";
import Swal from "sweetalert2";

const SkillsGO = () => {
  const { currentCompetition } = useEventNameContext();
  const { matches, setCurrentMatch } = useMatchContext();
  const [showRanking, setShowRanking] = useState(false);
  const [activeTab, setActiveTab] = useState('driver_go');
  const [scores, setScores] = useState({});
  const [completedMatches, setCompletedMatches] = useState({});
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [gameTime, setGameTime] = useState("");
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
  
  const event_name = currentCompetition;
  const token = localStorage.getItem("access_token");

  // تعريف التبويبات بنفس نمط skills.jsx
  const tabs = [
    { id: 'driver_go', label: 'Driving Challenge', icon: '🚗', color: 'blue' },
    { id: 'auto', label: 'Autonomous Challenge', icon: '🤖', color: 'blue' },
  ];

   const fetchCoopRankings = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/vex-go/${event_name}/skills/rank/`,
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

  // Fetch schedule
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/core/event/${event_name}/games/schedule/`,
        { stage: activeTab, game_time: gameTime },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedule(response.data);
      console.log(response.data);
      
    } catch (err) {
      console.error("Error posting schedule:", err);
   
 console.log("Error Response:", err.response.data);
    console.log(event_name);      
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSaveScore = (matchId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [matchId]: parseInt(score) || 0,
    }));
  };

  const handleStartMatch = (match) => {
    setCurrentMatch({
      ...match,
      id: match.id, 
      type: 'solo', 
      team: match.team1_name,
      challengeType: activeTab === 'driver_go' ? 'Driving Challenge' : 'Coding Challenge',
      mode: activeTab,
      round: round,
    });
    setSelectedMatch(match);
  };

  // const handleCompleteMatch = async (matchId) => {
  //   const currentScore = matches[matchId]?.score || 0;
       
    // Alert.confirm({
    //   title: 'Submit Final Score?',
    //   html: `<p>You're about to submit your final score of <strong>${currentScore}</strong> points.</p>`,
    //   confirmText: 'Confirm Submission',
    //   cancelText: 'Cancel',
    //   onConfirm: async () => {
    //     try {
    //       setCompletedMatches((prev) => ({
    //         ...prev,
    //         [matchId]: true,
    //       }));

    //       await axios.post(
    //         `${process.env.REACT_APP_API_URL}/game/${matchId}/set-game-score/`,
    //         {
    //           event_name: event_name,
    //           score: currentScore
    //         },
    //         { headers: { Authorization: `Bearer ${token}` } }
    //       );

    //       Alert.success({
    //         title: 'Score Submitted!',
    //         text: 'Your results have been successfully recorded'
    //       });
    //     } catch (error) {
    //       console.error("Submission error:", error);
    //       Swal.fire("Error", "Submission failed!", "error");
    //     }
    //   }
    // });
  //   setIsRunning(false);
  //   setTimeLeft(60);
  // };

  const handleFinishRound = () => {
    const currentRoundMatches = schedule.filter(match => match.round === round);
    const allMatchesCompleted = currentRoundMatches.every(
      (match) => completedMatches[match.id]
    );

    if (allMatchesCompleted) {
      if (round < 3) {
        setRound((prevRound) => prevRound + 1);
        setCompletedMatches({});
      } else {
        alert(`All ${activeTab} rounds completed!`);
      }
    } else {
      alert("Please complete all matches before finishing the round.");
    }
  };

  const calculateRankings = () => {
    return schedule
      .map(match => ({
        id: match.id,
        team: match.team1_name,
        score: scores[match.id] || 0
      }))
      .sort((a, b) => b.score - a.score);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
   <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {!selectedMatch ? ( 
        <>
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-indigo-700 mb-2">🏁 Skills Challenge</h1>
            
            {/* Mode Tabs - تم التعديل لتعكس تبويبات driver_go و auto */}
            <div className="flex justify-center gap-4 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { 
                    setActiveTab(tab.id); 
                    setRound(1); 
                    setCompletedMatches({});
                  }}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                    activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Schedule Input */}
            <form onSubmit={handleSubmit} className="flex justify-center gap-4 mb-4">
              <input
                type="time"
                value={gameTime}
                onChange={(e) => setGameTime(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">
                View Schedule
              </button>
            </form>

            {/* Round Navigation */}
            <div className="flex justify-center items-center gap-2 mt-2">
              <button
                onClick={() => setRound(prev => Math.max(1, prev - 1))}
                disabled={round === 1}
                className={`p-1 rounded-full ${round === 1 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
              >
                <FaChevronLeft />
              </button>
              <span className="text-lg font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full">
                {activeTab === 'driver_go' ? 'Driving' : 'Autonomous'} R{round}
              </span>
              <button
                onClick={() => setRound(prev => Math.min(3, prev + 1))}
                disabled={round === 3}
                className={`p-1 rounded-full ${round === 3 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          {/* Matches Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Match</th>
                    <th className="px-3 py-2 text-center">Team</th>
                    <th className="px-3 py-2 text-center">Team_ID</th>
                    <th className="px-3 py-2 text-center">Score</th>
                    <th className="px-3 py-2 text-center">Time</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schedule
                    .map((match) => (
                      <tr 
                        key={match.id} 
                        className={completedMatches[match.id] ? "bg-green-50" : "hover:bg-gray-50"}
                      >
                        <td className="px-3 py-3 font-medium">#{match.id}</td>
                        <td className="px-3 py-3 text-center">{match.team1_name}</td>
                        <td className="px-3 py-3 text-center">{match.team1}</td>
                        <td className="px-3 py-3 text-center">
                          {matches[match.id]?.score || 0}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {matches[match.id]?.totalTime ? formatTime(matches[match.id].totalTime) : '-'}
                        </td>
                       
                        <td className="px-3 py-3 text-center space-x-1">
                          <button
                            onClick={() => handleStartMatch(match)}
                            disabled={completedMatches[match.id]}
                            className={`p-1 ${
                              completedMatches[match.id] 
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                                : "bg-green-600 hover:bg-green-700 text-white"
                            } rounded text-xs`}
                          >
                            <FaPlay className="inline sm:mr-1" />
                      <span className="hidden sm:inline">Start</span>
                          </button>
                          
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Round Controls */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={handleFinishRound}
              disabled={!schedule.filter(match => match.round === round).every(match => completedMatches[match.id])}
              className={`px-4 py-2 rounded-lg flex items-center text-sm ${
                schedule.filter(match => match.round === round).every(match => completedMatches[match.id])
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              <FaFlagCheckered className="mr-1" />
              {round === 3 ? 'Finish' : "Finish Round"}
            </button>
            
            <button
              onClick={handleToggleRanking}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center text-sm"
            >
              <FaTrophy className="mr-1" />
              {showRanking ? "Hide" : "Rankings"}
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
                                              {team.total_score || 0}
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
        <SheetSolo 
          selectedMatch={selectedMatch} 
          eventName={event_name}
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  );
};

export default SkillsGO;