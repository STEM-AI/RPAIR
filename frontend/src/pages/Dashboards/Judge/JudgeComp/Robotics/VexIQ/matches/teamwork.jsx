import { useState } from "react";
import { FaTrophy, FaCheck, FaUsers, FaChartBar, FaSync } from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import axios from "axios";
import useEventSchedules from "../../../../../../../hooks/Schedule/EventSchedule";
import useSchedule from "../../../../../../../hooks/Schedule/Schedule";
import { useSearchParams } from "react-router-dom";
import ScoreTeams from "../Scores/scoreTeams";
import Koper from "../Scores/Koper";
import Swal from "sweetalert2";
import useGetScore from "../../../../../../../hooks/Schedule/GetScore";
import EditTimeIQ from "../../../../../../../hooks/EditTime/EditeTimeIQ";


const Teamwork = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [showRanking, setShowRanking] = useState(false);
  const token = localStorage.getItem("access_token");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculatorType, setCalculatorType] = useState(null);
  const [showTimeSelector, setShowTimeSelector] = useState(true);
  const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');
  const event_id = searchParams.get('eventId');


 

  const handleTimeChange = (seconds) => {
    console.log("Time limit updated to:", seconds, "seconds");
     setShowTimeSelector(false);
  };
  const { 
    score: serverScores, 
    loading: scoresLoading, 
    error: scoresError, 
    refetch: refetchScores 
  } = useGetScore(event_id, "teamwork");

  const { 
    schedules: eventSchedules, 
    loading: schedulesLoading, 
    error: schedulesError, 
    refetch: refetchSchedules 
  } = useEventSchedules(event_id, "teamwork", "-id");

  const lastScheduleId = eventSchedules[0]?.id;
  const { 
    schedule: scheduleDetails, 
    loading: scheduleLoading, 
    error: scheduleError,
    refetch: refetchScheduleDetails 
  } = useSchedule(lastScheduleId);

 const scoresMap = serverScores.reduce((acc, match) => {
  acc[match.id] = {
    score: match.score,
    completed: match.completed
  };
  return acc;
}, {});

  const handleRefreshSchedule = async () => {
    try {
      await refetchSchedules();
      await refetchScheduleDetails();
      await refetchScores(); // Refresh scores as well
    } catch (err) {
      console.error("Error refreshing schedule:", err);
    }
  };

  const fetchRankings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/event/${event_id}/teamwork-rank/`,
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

  const handleOpenCalculator = (matchCode) => {
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
        setSelectedMatch(matchCode);
        setCalculatorType('teams');
      } else if (result.isDenied) {
        setSelectedMatch(matchCode);
        setCalculatorType('koper');
              }
    });
  };

  const handleCalculate = () => {
    // After calculation, refresh the scores from server
    refetchScores();
    setSelectedMatch(null);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
            <FaUsers className="w-8 h-8" />
            Teamwork Matches
          </h1>
          <p className="mt-2 text-gray-600">Managing matches for {event_name}</p>
        </div>
        <button
          onClick={handleRefreshSchedule}
          className="h-fit flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FaSync className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh Schedule</span>
        </button>
      </div>

       {showTimeSelector && (
        <EditTimeIQ 
          id={event_id} 
          onTimeChange={handleTimeChange} 
        />
      )}
 

      {/* Matches Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              {['Match', 'Team 1', 'Team 2', 'Score', 'Actions'].map((header) => (
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
              <tr key={match.id} className={`hover:bg-gray-50 transition-colors ${scoresMap[match.id]?.completed ? 'bg-green-50' : ''}`}>
                
                <td className="px-4 py-3 text-center font-medium text-blue-600">#{match.id}</td>
                
                <td className="px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium text-gray-800">{match.team1_name}</span>
                    <span className="text-xs text-gray-500">#{match.team1}</span>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium text-gray-800">{match.team2_name}</span>
                    <span className="text-xs text-gray-500">#{match.team2}</span>
                  </div>
                </td>
                
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    scoresMap[match.id]?.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {scoresMap[match.id]?.score ?? 'N/A'}
                  </span>
                </td>
              
                
              

                <td className="px-4 py-3 text-center">
              {scoresMap[match.id]?.completed  ? (
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                  <FaCheck className="h-4 w-4" />
                </span>
              ) : (
                <button
                onClick={() => handleOpenCalculator(match.id)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  <AiOutlineCalculator className="h-4 w-4" />
                </button>
              )}
            </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Loading State */}
        {(schedulesLoading || scheduleLoading || scoresLoading) && (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        )}
        
        {/* Error State */}
        {(schedulesError || scoresError) && (
          <div className="p-6 text-center bg-red-50 border-t-4 border-red-300">
            <div className="text-red-600 font-medium">
              ⚠️ Error loading data: {schedulesError || scoresError}
            </div>
          </div>
        )}
      </div>

      {/* Ranking Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaTrophy className="w-6 h-6" />
            Team Rankings
          </h2>
          <button
            onClick={handleToggleRanking}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <FaChartBar className="w-4 h-4" />
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
              <div className="grid gap-3">
                {rankings.map((team, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={team.team}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        rank <= 3 ? 'border-2' : 'border hover:border-blue-200'
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
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {rank}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{team.team__name}</span>
                          <span className="text-xs text-gray-500">Team #{team.team}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-blue-600">
                          {typeof team.avg_score === 'number' 
                            ? team.avg_score.toFixed(2)
                            : 'N/A'}
                        </span>
                        {rank <= 3 && (
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            rank === 2 ? 'bg-gray-100 text-gray-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'}
                          </span>
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

     
      {selectedMatch && calculatorType === 'koper' && (
        <Koper
          onCalculate={handleCalculate}
          onClose={() => {
            setSelectedMatch(null);
            setCalculatorType(null);
          }}
          gameId={selectedMatch}
          mode="manual"
          eventName={event_name}
          eventId={event_id}
        />
      )}

      {selectedMatch && calculatorType === 'teams' && (
        <ScoreTeams
          onCalculate={handleCalculate}
          onClose={() => {
            setSelectedMatch(null);
            setCalculatorType(null);
          }}
          gameId={selectedMatch}
          eventName={event_name}
          eventId={event_id}
        />
      )}
    </div>
  );
};
export default Teamwork;