


import Alert from "../../../../../../../components/Alert/Alert";
import { useState, useEffect } from "react";
import { FaTrophy, FaCheck, FaPlay, FaChartBar,FaFlagCheckered, FaChevronLeft, FaChevronRight, FaClock, FaPause, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMatchContext } from './MatchContext';
import SheetSolo from "./SheetSolo"
import { useEventNameContext } from "../../../../../../../context/EventName";
import axios from "axios";
import Swal from "sweetalert2";
import Back from "../../../../../../../components/Back/Back";
import useSchedule from "../../../../../../../hooks/Schedule/Schedule";
import useEventSchedules from "../../../../../../../hooks/Schedule/EventSchedule";

const SkillsGO = () => {
  const { currentCompetition } = useEventNameContext();
  const { matches, setCurrentMatch } = useMatchContext();
  const [showRanking, setShowRanking] = useState(false);
  const [activeTab, setActiveTab] = useState('driver_go');
 const [completedRounds, setCompletedRounds] = useState({
    driver_go: [],
    coding: []
  });
  const [round, setRound] = useState(1);
  const [completedMatches, setCompletedMatches] = useState({});
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roundSchedules, setRoundSchedules] = useState([]);
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [gameTime, setGameTime] = useState("");
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedulesError, setSchedulesError] = useState(null);
  
  const event_name = currentCompetition;
  const token = localStorage.getItem("access_token");

  // تعريف التبويبات
  const tabs = [
    { id: 'driver_go', label: 'Driving Challenge', icon: '🚗', color: 'blue' },
    { id: 'coding', label: 'Coding Challenge', icon: '🤖', color: 'blue' },
  ];

  // State for storing schedules by round and stage
  const [schedulesByRound, setSchedulesByRound] = useState({
    driver_go: { 1: null, 2: null, 3: null },
    coding: { 1: null, 2: null, 3: null }
  });

  // Fetch latest schedules for both stages
  const { 
    schedules: driverSchedules, 
    loading: driverLoading,
    error: driverError,
    refetch: refetchDriver 
  } = useEventSchedules(event_name, "driver_go", "-id");
  
  const { 
    schedules: codingSchedules, 
    loading: codingLoading,
    error: codingError,
    refetch: refetchCoding 
  } = useEventSchedules(event_name, "coding", "-id");

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

  // Update schedules when driver schedules are fetched
  useEffect(() => {
    if (driverRound1 || driverRound2 || driverRound3) {
      setSchedulesByRound(prev => ({
        ...prev,
        driver_go: {
          1: driverRound1,
          2: driverRound2,
          3: driverRound3
        }
      }));
      setRoundSchedules([driverRound1, driverRound2, driverRound3]);
    }
  }, [driverRound1, driverRound2, driverRound3]);

  // Update schedules when coding schedules are fetched
  useEffect(() => {
    if (codingRound1 || codingRound2 || codingRound3) {
      setSchedulesByRound(prev => ({
        ...prev,
        coding: {
          1: codingRound1,
          2: codingRound2,
          3: codingRound3
        }
      }));
      setRoundSchedules([codingRound1, codingRound2, codingRound3]);
    }
  }, [codingRound1, codingRound2, codingRound3]);

  // Update loading and error states
  useEffect(() => {
    setSchedulesLoading(driverLoading || codingLoading);
    setSchedulesError(driverError || codingError);
  }, [driverLoading, codingLoading, driverError, codingError]);  

  // Handle round change with validation
  const handleRoundChange = (newRound) => {
   setRound(newRound);
  };

useEffect(() => {
  setRoundSchedules([
    schedulesByRound[activeTab][1],
    schedulesByRound[activeTab][2],
    schedulesByRound[activeTab][3]
  ]);
}, [activeTab, schedulesByRound]);
  

 const isRoundCompleted = () => {
    const currentSchedule = roundSchedules[round - 1]?.schedule?.games;
    return currentSchedule?.every(match => completedMatches[match.id]);
  };

const handleCompleteRound = () => {
  if (!isRoundCompleted()) {
    Swal.fire('Warning', 'Complete all matches in this round first!', 'warning');
    return;
  }

  // Update completed rounds locally
  setCompletedRounds(prev => ({
    ...prev,
    [activeTab]: [...prev[activeTab], round]
  }));

  // Refresh schedules to get latest data from backend
  refetchSchedules();

  // Auto-advance to next round if not final
  if (round < 3) {
    setTimeout(() => {
      setRound(prev => prev + 1);
    }, 1000); // Small delay to allow schedule refresh
  }

  Swal.fire('Success', `Round ${round} completed!`, 'success');
  fetchCoopRankings(); // Refresh rankings
};

  // Check if current round is already marked complete
  const isCurrentRoundCompleted = completedRounds[activeTab].includes(round);

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
        fetchCoopRankings();
      }
      return newState;
    });
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
       <div className="max-w-7xl mx-auto px-4 py-6">
      {!selectedMatch ? (
        <>
          <Back className="mb-6" />
          
          {/* Main Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ⚡ Skills Challenge
            </h1>
            
            {/* Mode Tabs */}
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
                      ? `bg-gradient-to-br ${tab.color === 'blue' ? 'from-indigo-600 to-blue-600' : 'from-purple-600 to-pink-600'} shadow-lg`
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
            {/* Round Navigation */}
      <div className="flex justify-center items-center gap-2 mt-2">
        <button
          onClick={() => setRound(r => Math.max(1, r - 1))}
          disabled={round === 1}
        >
          <FaChevronLeft />
        </button>
        
        <div className="flex gap-1">
          {[1, 2, 3].map(r => (
            <button
              key={r}
              onClick={() => setRound(r)}
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${round === r ? 'bg-indigo-600 text-white' : 'bg-gray-200'}
                ${completedRounds[activeTab].includes(r) ? '!bg-green-500' : ''}`}
            >
              {r}
            </button>
          ))}
        </div>

        <button
          onClick={() => setRound(r => Math.min(3, r + 1))}
          disabled={round === 3}
        >
          <FaChevronRight />
        </button>
      </div>
          </div>

          {/* Matches Table */}
          <div className="bg-white rounded-xl shadow-xl mb-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
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
                  {roundSchedules[round - 1]?.schedule?.games?.map((match) => (
                    <tr
                      key={match.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        completedMatches[match.id] ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-700">#{match.id}</td>
                      <td className="px-6 py-4 text-center font-medium">{match.team1_name}</td>
                      <td className="px-6 py-4 text-center text-gray-500">{match.team1}</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600">
                        {matches[match.id]?.score || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {matches[match.id]?.totalTime ? (
                          <div className="flex items-center justify-center gap-1">
                            <FaClock className="text-gray-400" />
                            <span>{formatTime(matches[match.id].totalTime)}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleStartMatch(match)}
                          disabled={completedMatches[match.id]}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-transform ${
                            completedMatches[match.id]
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-md'
                          }`}
                        >
                          <FaPlay />
                          <span>Start Match</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Controls Section */}
         <div className="flex justify-center gap-2 mb-4">
            {/* <button
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
            </button> */}
            
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
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-4 flex items-center gap-3">
                <FaChartBar className="text-white text-2xl" />
                <h2 className="text-white text-xl font-bold">Live Rankings</h2>
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
                        <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-indigo-700 uppercase">total_score</th>
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
          eventName={event_name}
          onClose={() => setSelectedMatch(null)}
          challengeType={activeTab === 'driver_go' ? 'Driving Challenge' : 'Coding Challenge'}
        />
      )}
    </div>
  );
};

export default SkillsGO;