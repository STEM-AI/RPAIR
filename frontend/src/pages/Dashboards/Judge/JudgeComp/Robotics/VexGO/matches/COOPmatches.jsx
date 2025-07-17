import { useState , useEffect} from "react";
import { FaTrophy,FaSync, FaCheck, FaPlay, FaChartBar, FaUsers } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMatchContext } from "./MatchContext";
import Alert from "../../../../../../../components/Alert/Alert";
import axios from "axios";
import useEventSchedules from "../../../../../../../hooks/Schedule/EventSchedule";
import useSchedule from "../../../../../../../hooks/Schedule/Schedule";
import SheetCoop from "./SheetCoop";
import useGetScore from "../../../../../../../hooks/Schedule/GetScore";
import Swal from "sweetalert2";


const COOPMatch = () => {
  const { matches, setCurrentMatch } = useMatchContext();
  const [showRanking, setShowRanking] = useState(false);
  const [scores, setScores] = useState({});
  const [completedMatches, setCompletedMatches] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const token = localStorage.getItem("access_token");
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playGround, setPlayGround] = useState(null);
  
const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');
  const event_id = searchParams.get('eventId');
  
 const { 
    score: serverScores, 
    loading: scoresLoading, 
    error: scoresError, 
    refetch: refetchScores 
  } = useGetScore(event_id, "coop");

  const scoresMap = serverScores.reduce((acc, match) => {
    acc[match.id] = match.score;
    return acc;
  }, {});


  const { 
      schedules: eventSchedules, 
      loading: schedulesLoading, 
      error: schedulesError, 
      refetch: refetchSchedules 
    } = useEventSchedules(event_id, "coop", "-id"); // Order by descending ID
  
    const lastScheduleId = eventSchedules[0]?.id; // أول عنصر بعد الترتيب التنازلي
    const { 
      schedule: scheduleDetails, 
      loading: scheduleLoading, 
      error: scheduleError,
      refetch: refetchScheduleDetails 
    } = useSchedule(lastScheduleId);
  
    // دالة جديدة لجلب الجدول الأخير
    const handleRefreshSchedule = async () => {
      try {
        await refetchSchedules();
        await refetchScheduleDetails();
      } catch (err) {
        console.error("Error refreshing schedule:", err);
      }
    };
  const fetchCoopRankings = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/vex-go/${event_id}/coop/rank/`,
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
  const handleSaveScore = (matchId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [matchId]: score,
    }));
  };


  const handleStartMatch = (match) => {
        Swal.fire({
          title: '<strong>Select Playground Type</strong>',
          html: `
            <div class="flex flex-col gap-4 mt-4">
              <button id="teams-btn" class="calculator-option">
                <div class="bg-blue-100 p-3 rounded-full mb-2">
                  <i class="text-blue-600 text-xl">🌊 Ocean Challenge</i>
                </div>
              </button>
              
              <button id="koper-btn" class="calculator-option">
                <div class="bg-green-100 p-3 rounded-full mb-2">
                  <i class="text-green-600 text-xl">🚀 Space Challenge</i>
                </div>
              </button>
            </div>
          `,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl',
            htmlContainer: 'pt-0 pb-4',
            cancelButton: 'mt-4 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors'
          },
          didOpen: () => {
            document.getElementById('teams-btn').addEventListener('click', () => Swal.close({ isConfirmed: true }))
            document.getElementById('koper-btn').addEventListener('click', () => Swal.close({ isDenied: true }))
          }
        }).then((result) => {
          if (result.isConfirmed) {
            setCurrentMatch({
              ...match,
              type: 'coop',
              mode: 'coop'
            });
            setSelectedMatch(match);
            setPlayGround('Ocean');
          } else if (result.isDenied) {
            setCurrentMatch({
              ...match,
              type: 'coop',
              mode: 'coop'
            });
            setSelectedMatch(match);
            setPlayGround('Space');
          }
        });
   
  };

  // Mark match as completed
  const handleMarkAsDone = (matchId) => {
  Alert.confirm({
    title: 'Submit Final Score?',
    html: `<p>You're about to submit your final score of <strong>${scores[matchId] || 0}</strong> points.</p>`,
    confirmText: 'Confirm Submission',
    cancelText: 'Cancel',
    onConfirm: () => {
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
  if (!schedule || schedule.length === 0) return; 

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
       {!selectedMatch ? ( 
        <>
          {/* Header Section */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-teal-700 flex items-center gap-3">
                  <FaUsers className="w-8 h-8" />
                  <span>COOP Matches</span>
                </h1>
                <p className="mt-1 text-gray-600">Manage cooperative matches for {event_name}</p>
              </div>
            </div>
            <button
              onClick={handleRefreshSchedule}
              className="h-fit flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              <FaSync className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Matches Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-teal-600">
                  <tr>
                    {['Match', 'Teams', 'Score', 'Time', 'Status'].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-sm font-semibold text-white text-center uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(scheduleDetails?.games || []).map((match) => (
                    <tr
                      key={match.id}
                      className={completedMatches[match.id] ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}
                    >
                      <td className="px-4 py-3 text-center font-medium text-teal-600">#{match.id}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium">{match.team1_name}</span>
                          <span className="text-xs text-gray-500">and</span>
                          <span className="font-medium">{match.team2_name}</span>
                        </div>
                      </td>
                     
                      <td className="px-4 py-3 text-center font-bold text-blue-600 text-xl">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  scoresMap[match.id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {scoresMap[match.id] ||'--'} 
              </span>
                </td>
                      <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">
                        {matches[match.id]?.totalTime ? formatTime(matches[match.id].totalTime) : '--:--'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {scoresMap[match.id] > 1500? (
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                            <FaCheck className="h-4 w-4" />
                          </span>
                        ) : (
                          <button
                            onClick={() => handleStartMatch(match)}
                            disabled={completedMatches[match.id]}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${completedMatches[match.id]
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-700 text-white'
                              }`}
                          >
                            {completedMatches[match.id] ? (
                              <>
                                <FaCheck className="w-3.5 h-3.5" />
                                <span>Completed</span>
                              </>
                            ) : (
                              <>
                                <FaPlay className="w-3.5 h-3.5" />
                                <span>Start</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rankings Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-teal-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaChartBar className="w-6 h-6" />
                Team Rankings
              </h2>
              <button
                onClick={handleToggleRanking}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <FaTrophy className="w-4 h-4" />
                {showRanking ? 'Hide' : 'Show'} Rankings
              </button>
            </div>

            {showRanking && (
              <div className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-6 text-red-500">
                    ⚠️ Error loading rankings: {error}
                  </div>
                ) : rankings.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    🏟️ No rankings available yet
                  </div>
                ) : (
                  <div className="grid gap-4">
                  {rankings.map((team, index) => {
                        const rank = index + 1;
                        return (
                          <div
                            key={team.team}
                            className={`group flex items-center justify-between p-4 rounded-lg transition-all ${
                              rank <= 3 
                                ? 'border-2' 
                                : 'border hover:border-teal-200 hover:bg-teal-50/30'
                            } ${
                              rank === 1
                                ? 'border-yellow-300 bg-yellow-50'
                                : rank === 2
                                ? 'border-gray-300 bg-gray-50'
                                : rank === 3
                                ? 'border-amber-400 bg-amber-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <span
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                  rank <= 3
                                    ? rank === 1
                                      ? 'bg-yellow-400 text-white'
                                      : rank === 2
                                      ? 'bg-gray-400 text-white'
                                      : 'bg-amber-500 text-white'
                                    : 'bg-teal-100 text-teal-600 group-hover:bg-teal-200'
                                }`}
                              >
                                {rank}
                              </span>
                              <span className={`font-medium ${
                                rank > 3 ? 'text-gray-600 group-hover:text-teal-700' : 'text-gray-700'
                              }`}>
                                {team.team__name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-lg font-bold ${
                                rank > 3 ? 'text-gray-700' : 'text-teal-600'
                              }`}>
                                {team.avg_score || 0}
                              </span>
                              {rank <= 3 ? (
                                <span className="text-2xl">
                                  {rank === 1 && '🥇'}
                                  {rank === 2 && '🥈'}
                                  {rank === 3 && '🥉'}
                                </span>
                              ) : (
                                <div className="flex items-center gap-1 text-gray-400">
                                  <span className="text-sm">Rank</span>
                                  <span className="font-medium">{rank}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) :  (
          <SheetCoop
          selectedMatch={selectedMatch}
          eventName={event_id}
          onClose={() => {
            setSelectedMatch(null);
            refetchScores(); 
          }}
          sheetType={playGround} 
        />
      )
      }
    </div>
  );
};
 

export default COOPMatch;

