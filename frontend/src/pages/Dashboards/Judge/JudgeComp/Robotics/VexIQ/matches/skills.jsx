import { useState, useEffect, useMemo } from "react";
import { FaTrophy, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import CalculatorSkills from "../Scores/ScoresSkills";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "../../../../../../../components/Alert/Alert";
import { useSearchParams } from "react-router-dom";
import useEventSchedules from "../../../../../../../hooks/Schedule/EventSchedule";
import useSchedule from "../../../../../../../hooks/Schedule/Schedule"
import Koper from "../Scores/Koper";
import useGetScore from "../../../../../../../hooks/Schedule/GetScore";
import EditTimeIQ from "../../../../../../../hooks/EditTime/EditeTimeIQ";


const Skills = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [confirmed, setConfirmed] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(1);
  const [scoreType, setScoreType] = useState(null);
  const [showRanking, setShowRanking] = useState(false);
  const [activeTab, setActiveTab] = useState('driver_iq');
  const [calculatorType, setCalculatorType] = useState(null);
    const [showTimeSelector, setShowTimeSelector] = useState(true);
  const [completedRounds, setCompletedRounds] = useState({
    driver_iq: [],
    auto: []
  });

  const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');
  const event_id = searchParams.get('eventId');
  const token = localStorage.getItem("access_token");
  
  const tabs = [
    { id: 'driver_iq', label: 'Driving Challenge', icon: '🚗', color: 'blue' },
    { id: 'auto', label: 'Autonomous Challenge', icon: '🤖', color: 'blue' },
  ];
  
  const { score: serverScores, loading: scoresLoading,
    error: scoresError, refetch: refetchScores } = useGetScore(event_id, activeTab);
 const handleTimeChange = (seconds) => {
     setShowTimeSelector(false);
  };
  // State for storing schedules by round and challenge type
  const [schedulesByRound, setSchedulesByRound] = useState({
    driver_iq: { 1: null, 2: null, 3: null },
    auto: { 1: null, 2: null, 3: null }
  });

  
  const roundSchedules = useMemo(() => {
    return [
      schedulesByRound[activeTab]?.[1] || null,
      schedulesByRound[activeTab]?.[2] || null,
      schedulesByRound[activeTab]?.[3] || null
    ];
  }, [activeTab, schedulesByRound]);

  // Fetch latest schedules for both challenge types
  const { 
    schedules: driverSchedules, 
    loading: driverLoading,
    error: driverError,
    refetch: refetchDriver 
  } = useEventSchedules(event_id, "driver_iq", "id");
  
  const { 
    schedules: autoSchedules, 
    loading: autoLoading,
    error: autoError,
    refetch: refetchAuto 
  } = useEventSchedules(event_id, "auto", "id");

  // Combined refetch function
  const refetchSchedules = () => {
    refetchDriver();
    refetchAuto();
  };

  // Get schedule details for driver rounds
  const driverRound1 = useSchedule(driverSchedules?.[0]?.id || null);
  const driverRound2 = useSchedule(driverSchedules?.[1]?.id || null);
  const driverRound3 = useSchedule(driverSchedules?.[2]?.id || null);

  const autoRound1 = useSchedule(autoSchedules?.[0]?.id || null);
  const autoRound2 = useSchedule(autoSchedules?.[1]?.id || null);
  const autoRound3 = useSchedule(autoSchedules?.[2]?.id || null);

  // Update schedules when data changes
  useEffect(() => {
    const newSchedulesByRound = {
      driver_iq: {
        1: driverRound1,
        2: driverRound2,
        3: driverRound3
      },
      auto: {
        1: autoRound1,
        2: autoRound2,
        3: autoRound3
      }
    };
    
    setSchedulesByRound(prev => {
      if (JSON.stringify(prev.driver_iq) !== JSON.stringify(newSchedulesByRound.driver_iq) ||
          JSON.stringify(prev.auto) !== JSON.stringify(newSchedulesByRound.auto)) {
        return newSchedulesByRound;
      }
      return prev;
    });
  }, [driverRound1, driverRound2, driverRound3, autoRound1, autoRound2, autoRound3]);

  // Calculate allowed rounds
  const currentChallengeCompleted = completedRounds[activeTab] || [];
  const maxCompleted = currentChallengeCompleted.length > 0 ? Math.max(...currentChallengeCompleted) : 0;
  const nextAllowedRound = maxCompleted + 1;

      const isRoundCompleted = () => {
        const currentSchedule = roundSchedules[selectedRound - 1]?.schedule?.games;
        if (!currentSchedule) return false;
        
        return currentSchedule.every(match => {
          return scoresMap[match.id]?.completed;
        });
      };
      const scoresMap = useMemo(() => {
          return serverScores.reduce((acc, match) => {
            acc[match.id] = {
              score: match.score,
              completed: match.completed
            };
            return acc;
          }, {});
        }, [serverScores]);

  const handleCompleteRound = async () => {
    if (!isRoundCompleted()) {
      await Swal.fire({
        title: 'Incomplete Round',
        text: 'Please complete all matches in this round first!',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      // Mark round as completed
      setCompletedRounds(prev => ({
        ...prev,
        [activeTab]: [...new Set([...prev[activeTab], selectedRound])]
      }));

      // Auto-advance to next round if available
      if (selectedRound < 3) {
        setSelectedRound(prev => prev + 1);
      }

      // Refresh data
      refetchSchedules();
      refetchScores(); // ADD THIS TO REFRESH SCORES
      fetchRankings();

      await Swal.fire({
        title: 'Success!',
        text: `Round ${selectedRound} has been completed.`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error completing round:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to complete round. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const fetchRankings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/event/${event_id}/skills-rank/`,
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

  const handleToggleRanking = () => {
    setShowRanking(prev => {
      const newState = !prev;
      if (newState) {
        fetchRankings();
      }
      return newState;
    });
  };

  const openCalculator = (team, round, type) => {
    if (confirmed[round]?.[team.id]) return;

    Swal.fire({
      title: '<strong>Select Calculator Type</strong>',
      html: `
        <div class="flex flex-col gap-4 mt-4">
          <button id="teams-btn" class="calculator-option">
            <div class="bg-blue-100 p-3 rounded-full mb-2">
              <i class="text-blue-600 text-xl">🏆</i>
            </div>
            <span class="font-medium text-gray-800">VexIQ 2023/2024</span>
            <p class="text-gray-500 text-sm mt-1">Calculate scores</p>
          </button>
          
          <button id="koper-btn" class="calculator-option">
            <div class="bg-green-100 p-3 rounded-full mb-2">
              <i class="text-green-600 text-xl">🏆</i>
            </div>
            <span class="font-medium text-gray-800">Koper Scoring</span>
            <p class="text-gray-500 text-sm mt-1">Specialized calculation for Koper matches</p>
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
        setCalculatorType('teams');
        setSelectedTeam(team);
        setSelectedRound(round);
        setScoreType(type);
        setShowCalculator(true);
      } else if (result.isDenied) {
        setCalculatorType('koper');
        setSelectedTeam(team);
        setSelectedRound(round);
        setScoreType(type);
        setShowCalculator(true);
      }
    });
  };

  const handleScoreCalculated = (calculatedScore) => {
    if (!selectedTeam || !selectedRound || !scoreType) return;

    setConfirmed(prev => ({
      ...prev,
      [selectedRound]: {
        ...prev[selectedRound],
        [selectedTeam.id]: true
      }
    }));

    setShowCalculator(false);
    refetchSchedules();
    refetchScores();
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
    <div  className="max-w-6xl mx-auto px-4 py-6 transition-all duration-300">
    {/* Header and Tabs */}
      <div className="text-center mb-8">
  <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
    🏆 Skills Challenge
  </h1>
  
          <div className="flex justify-center gap-4 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedRound(1);
                  refetchSchedules();
                }}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-500 text-white shadow-lg transform scale-105` 
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>  

        {/* Round Navigation */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedRound(r => Math.max(1, r - 1))}
            disabled={selectedRound === 1}
            className={`p-2 rounded-full transition-all ${
              selectedRound === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:bg-blue-100 hover:shadow-md'
            }`}
          >
            <FaChevronLeft className="text-xl" />
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3].map(r => (
              <button
                key={r}
                onClick={() => setSelectedRound(r)}
                disabled={r > nextAllowedRound}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedRound === r 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } ${
                  completedRounds[activeTab].includes(r) 
                    ? '!bg-gradient-to-br from-green-500 to-green-600' 
                    : ''
                } ${
                  r > nextAllowedRound 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-sm'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedRound(r => Math.min(3, r + 1))}
            disabled={selectedRound === 3 || (selectedRound + 1) > nextAllowedRound}
            className={`p-2 rounded-full transition-all ${
              selectedRound === 3 || (selectedRound + 1) > nextAllowedRound 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:bg-blue-100 hover:shadow-md'
            }`}
          >
            <FaChevronRight className="text-xl" />
          </button>
          </div>
      </div>

      {(driverLoading || autoLoading || scoresLoading) && (
  <div className="p-6 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-14 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
    ))}
  </div>
      )}
      
      {showTimeSelector && (
              <EditTimeIQ 
                id={event_id} 
                onTimeChange={handleTimeChange} 
              />
            )}
     {/* Matches Table */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
  <table className="w-full divide-y divide-gray-200">
    <thead className="bg-gradient-to-r from-blue-600 to-blue-500">
      <tr>
        {['Match','Team-code', 'Team ', 'Score', 'Actions'].map((header) => (
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
            {(roundSchedules[selectedRound - 1]?.schedule?.games || []).map((match) => {
              const matchScore = scoresMap[match.id] || {};
              const scoreValue = matchScore.score;
              const isCompleted = matchScore.completed;
              const hasScore = scoreValue !== null && scoreValue !== undefined;


       return (
                                <tr 
                key={match.id} 
                className={`transition-all duration-200 ${
                  isCompleted ? 'bg-green-50/50' : 'hover:bg-gray-50'
                } ${
                  hasScore ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <td className="px-4 py-4 text-center">
                  <span className="inline-block bg-blue-50 rounded-lg px-3 py-1.5 text-blue-600 font-medium">
                    #{match.id}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                        <span className="inline-block bg-blue-50 rounded-lg px-3 py-1.5 text-blue-600 font-medium">
                        {match.team1}</span>
                </td>
                
                <td className="px-4 py-4 text-center">
                      <div className="font-medium text-gray-900">{match.team1_name}</div>
                </td>
                
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isCompleted ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? scoreValue : 0 }
                  </span>
                </td>
                
                <td className="px-4 py-4 text-center">
                  {isCompleted ? (
                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-green-100 text-green-600 border border-green-200">
                      <FaCheck className="h-4 w-4" />
                    </span>
                  ) : (
                    <button
                      onClick={() => openCalculator(match, selectedRound, activeTab === 'driver_iq' ? 'driver' : 'auto')}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all duration-200 hover:shadow-sm"
                    >
                      <AiOutlineCalculator className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
  
  {/* Complete Round Button */}
  <div className="flex justify-center p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleCompleteRound}
          disabled={!isRoundCompleted() || completedRounds[activeTab].includes(selectedRound)}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
            completedRounds[activeTab].includes(selectedRound)
              ? 'bg-green-500 text-white shadow-lg cursor-default'
              : isRoundCompleted() 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-md' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FaCheck className="h-5 w-5" />
          <span className="font-medium">
            {completedRounds[activeTab].includes(selectedRound)
              ? `Round ${selectedRound} Completed`
              : `Complete Round ${selectedRound}`}
          </span>
        </button>
      </div>

</div>

      {/* Ranking Section */}
      <div className="flex justify-center mt-4 sm:mt-6 mb-4">
        <button
          onClick={handleToggleRanking}
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg hover:shadow-md gap-2 transition-all"
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
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">
            Team Rankings
          </span>
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
                  <Th className="text-right pr-6">Total Score</Th>
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
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center 
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
                        <div className="flex items-center justify-center ">
                          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-2">
                            <span className="text-blue-600 font-medium">#{team.team}</span>
                          </span>
                          <span className="font-medium text-gray-800">{team.team__name}</span>
                        </div>
                      </Td>
                      <Td className="text-right pr-6">
                        <div className="flex items-center justify-end">
                          <span className="font-semibold text-blue-600">
                            {typeof team.total_score === 'number' 
                              ? team.total_score.toFixed(2) 
                              : 'N/A'}
                          </span>
                          {rank <= 3 && (
                            <span className={`text-sm px-2 py-1 rounded-full ml-2 ${
                              rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                              rank === 2 ? 'bg-gray-100 text-gray-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
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
      
      {showCalculator && selectedTeam && calculatorType === 'teams' && (
        <CalculatorSkills
          onCalculate={handleScoreCalculated}
          onClose={() => setShowCalculator(false)}
          mode={activeTab}
          gameId={selectedTeam.id}
          eventName={event_name}
          eventId={event_id}
        />
      )}
      {showCalculator && selectedTeam && calculatorType === 'koper' && (
        <Koper
          onCalculate={handleScoreCalculated}
          onClose={() => setShowCalculator(false)}
          mode={activeTab}
          gameId={selectedTeam.id}
          eventName={event_name}
          eventId={event_id}
        />
      )}
    </div>
  );
};

export default Skills;