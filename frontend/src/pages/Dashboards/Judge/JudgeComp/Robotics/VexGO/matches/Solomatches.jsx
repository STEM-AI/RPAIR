import { useState, useEffect, useMemo } from "react";
import { FaTrophy, FaCheck, FaPlay, FaChartBar, FaFlagCheckered, FaChevronLeft, FaChevronRight, FaClock} from "react-icons/fa";
import {  useSearchParams } from "react-router-dom";
import { useMatchContext } from './MatchContext';
import SheetSolo from "./SheetSolo"
import axios from "axios";
import Swal from "sweetalert2";
import useSchedule from "../../../../../../../hooks/Schedule/Schedule";
import useEventSchedules from "../../../../../../../hooks/Schedule/EventSchedule";
import useGetScore from "../../../../../../../hooks/Schedule/GetScore";

const SkillsGO = () => {
  const [playGround, setPlayGround] = useState(null);

  const { matches, setCurrentMatch } = useMatchContext();
  const [showRanking, setShowRanking] = useState(false);
  const [activeTab, setActiveTab] = useState('driver_go');
  const [completedRounds, setCompletedRounds] = useState({
    driver_go: [],
    coding: []
  });
  const [round, setRound] = useState(1);
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedulesError, setSchedulesError] = useState(null);
  const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');
  const event_id = searchParams.get('eventId');
  const token = localStorage.getItem("access_token");
  const [confirmed, setConfirmed] = useState({}); // Add confirmation state
  const tabs = [
    { id: 'driver_go', label: 'Driving Challenge', icon: '🚗', color: 'teal' },
    { id: 'coding', label: 'Coding Challenge', icon: '🤖', color: 'teal' },
  ];

  // State for storing schedules by round and stage
  const [schedulesByRound, setSchedulesByRound] = useState({
    driver_go: { 1: null, 2: null, 3: null },
    coding: { 1: null, 2: null, 3: null }
  });

  const { 
      score: serverScores, 
      loading: scoresLoading, 
      error: scoresError, 
      refetch: refetchScores 
    } = useGetScore(event_id, activeTab);

  const roundSchedules = useMemo(() => {
    return [
      schedulesByRound[activeTab]?.[1],
      schedulesByRound[activeTab]?.[2],
      schedulesByRound[activeTab]?.[3]
    ];
  }, [activeTab, schedulesByRound]);

  // Fetch latest schedules for both stages
  const { 
    schedules: driverSchedules, 
    loading: driverLoading,
    error: driverError,
    refetch: refetchDriver 
  } = useEventSchedules(event_id, "driver_go", "id");
  
  const { 
    schedules: codingSchedules, 
    loading: codingLoading,
    error: codingError,
    refetch: refetchCoding 
  } = useEventSchedules(event_id, "coding", "-id");

  // Combined refetch function
  const refetchSchedules = () => {
    refetchDriver();
    refetchCoding();
  };

  // Get schedule details for driver rounds
  const driverRound1 = useSchedule(driverSchedules[0]?.id);
  const driverRound2 = useSchedule(driverSchedules[1]?.id);
  const driverRound3 = useSchedule(driverSchedules[2]?.id);

  // Get schedule details for coding rounds
  const codingRound1 = useSchedule(codingSchedules[0]?.id);
  const codingRound2 = useSchedule(codingSchedules[1]?.id);
  const codingRound3 = useSchedule(codingSchedules[2]?.id);

  // Update schedules when data changes
  useEffect(() => {
    const newSchedulesByRound = {
      driver_go: {
        1: driverRound1,
        2: driverRound2,
        3: driverRound3
      },
      coding: {
        1: codingRound1,
        2: codingRound2,
        3: codingRound3
      }
    };
    
    setSchedulesByRound(prev => {
      // Only update if data actually changed
      if (JSON.stringify(prev.driver_go) !== JSON.stringify(newSchedulesByRound.driver_go) ||
          JSON.stringify(prev.coding) !== JSON.stringify(newSchedulesByRound.coding)) {
        return newSchedulesByRound;
      }
      return prev;
    });
  }, [driverRound1, driverRound2, driverRound3, codingRound1, codingRound2, codingRound3]);

  // Update loading and error states
  useEffect(() => {
    setSchedulesLoading(driverLoading || codingLoading);
    setSchedulesError(driverError || codingError);
  }, [driverLoading, codingLoading, driverError, codingError]);



  const isRoundCompleted = () => {
    const currentSchedule = roundSchedules[round - 1]?.schedule?.games;
    return currentSchedule?.every(match => {
      const serverScore = serverScores?.find(s => s.id === match.id);
      return serverScore?.score !== null || confirmed[round]?.[match.id];
    });
  };

      const scoresMap = useMemo(() => {
        return serverScores.reduce((acc, match) => {
          acc[match.id] = {
            score: match.score,
            completed: match.completed,
            time_taken: match.time_taken
          };
          return acc;
        }, {});
      }, [serverScores]);



 

  // Calculate allowed rounds
  const currentStageCompleted = completedRounds[activeTab] || [];
  const maxCompleted = currentStageCompleted.length > 0 ? Math.max(...currentStageCompleted) : 0;
  const nextAllowedRound = maxCompleted + 1;

  const handleCompleteRound = () => {
    if (!isRoundCompleted() ) {
      Swal.fire('Warning', 'Complete all matches in this round first!', 'warning');
      return;
    }

    Swal.fire({
      title: 'Complete Round?',
      text: `Are you sure you want to mark Round ${round} as completed?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, complete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Update completed rounds
        setCompletedRounds(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab], round]
        }));

        
        refetchSchedules();
        refetchScores();
        
        // Auto-advance to next round
        if (round < 3) {
          setTimeout(() => {
            setRound(prev => prev + 1);
          }, 1000);
        }

        Swal.fire('Success', `Round ${round} completed!`, 'success');
        fetchCoopRankings();
      }
    });
  };

  const isCurrentRoundCompleted = completedRounds[activeTab].includes(round);

  const fetchCoopRankings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vex-go/${event_id}/skills/rank/`,
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
        fetchCoopRankings();
      }
      return newState;
    });
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
      id: match.id,
      type: 'solo',
      team: match.team1_name,
      challengeType: activeTab === 'driver_go' ? 'Driving Challenge' : 'Coding Challenge',
      mode: activeTab,
      round: round,
    });
    setSelectedMatch(match);
                setPlayGround('Ocean');
              } else if (result.isDenied) {
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
                setPlayGround('Space');
              }
            });
   
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {!selectedMatch ? (
        <>
          {/* Main Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ⚡ Solo Challenge
            </h1>
            
            <div className="flex justify-center gap-4 mb-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setRound(1);
                    refetchSchedules();
                  }}
                  className={`px-8 py-3 rounded-xl flex items-center gap-3 transition-all ${
                    activeTab === tab.id
                      ? `bg-gradient-to-br ${tab.color === 'teal' ? 'from-teal-600 to-teal-600' : 'from-purple-600 to-pink-600'} shadow-lg`
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <span className={`font-semibold ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Round Navigation */}
            <div className="flex justify-center items-center gap-2 mt-2">
              <button
                onClick={() => setRound(r => Math.max(1, r - 1))}
                disabled={round === 1}
                className={round === 1 ? "opacity-50 cursor-not-allowed" : ""}
              >
                <FaChevronLeft />
              </button>
              
              <div className="flex gap-1">
                {[1, 2, 3].map(r => (
                  <button
                    key={r}
                    onClick={() => setRound(r)}
                    disabled={r > nextAllowedRound}
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${round === r ? 'bg-teal-600 text-white' : 'bg-gray-200'}
                      ${completedRounds[activeTab].includes(r) ? '!bg-green-500' : ''}
                      ${r > nextAllowedRound ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setRound(r => Math.min(3, r + 1))}
                disabled={round === 3 || (round + 1) > nextAllowedRound}
                className={round === 3 || (round + 1) > nextAllowedRound ? "opacity-50 cursor-not-allowed" : ""}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Matches Table */}
          <div className="bg-white rounded-xl shadow-xl mb-8 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-600 to-teal-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-xl">Match</th>
                <th className="px-6 py-4 text-center">Team</th>
                <th className="px-6 py-4 text-center">ID</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Time</th>
                <th className="px-6 py-4 text-center rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roundSchedules[round - 1]?.schedule?.games?.map((match) => {
                const matchScore = scoresMap[match.id] || {};
                const scoreValue = matchScore.score;
                const isCompleted = matchScore.completed;
                const hasScore = scoreValue !== null && scoreValue !== undefined;

                return (
                  <tr
                    key={match.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isCompleted ? 'bg-green-50 border-l-4 border-green-400' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-700">#{match.id}</td>
                    <td className="px-6 py-4 text-center font-medium">{match.team1_name}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{match.team1}</td>
                    <td className="px-6 py-4 text-center font-bold text-teal-600">
                      <span className={`inline-flex items-center justify-center w-16 h-8 rounded-full ${
                        isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {hasScore ? scoreValue : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {matchScore.time_taken ? (
                        <div className="flex items-center justify-center gap-1">
                          <FaClock className="text-gray-400" />
                          <span>{formatTime(matchScore.time_taken)}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isCompleted ? (
                        <div className="flex flex-col items-center">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                            <FaCheck className="h-4 w-4" />
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartMatch(match)}
                          className="px-4 py-2 rounded-lg flex text-center items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white hover:shadow-md transition-transform"
                        >
                          <FaPlay />
                          <span>Start Match</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(schedulesLoading || scoresLoading) && (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          )}
        </div>
          </div>

          {/* Controls Section */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={handleCompleteRound}
              disabled={isCurrentRoundCompleted }
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-transform ${
                isCurrentRoundCompleted
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-500 hover:bg-teal-600 text-white hover:shadow-md'
              }`}
            >
              <FaFlagCheckered />
              <span>Complete Round {round}</span>
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
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-600 px-8 py-4 flex items-center gap-3">
                <FaChartBar className="text-white text-2xl" />
                <h2 className="text-white text-xl font-bold">Live Rankings</h2>
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-teal-500 mx-auto"
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
                    <thead className="bg-teal-50">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-teal-700 uppercase">Rank</th>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-teal-700 uppercase">Team</th>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-teal-700 uppercase">total_score</th>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-teal-700 uppercase">Medal</th>
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
                            <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-sm text-center">{team.team_name}</td>
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
          eventName={event_id}
            onClose={() => {
              setSelectedMatch(null)
              refetchScores();
            }
          }
          challengeType={activeTab === 'driver_go' ? 'Driving Challenge' : 'Coding Challenge'}
          sheetType={playGround}
        />
      )}
    </div>
  );
};
export default SkillsGO;