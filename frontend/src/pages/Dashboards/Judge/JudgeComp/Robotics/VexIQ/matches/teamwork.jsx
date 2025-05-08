import { useState, useEffect } from "react";
import ScoreTeams from "../Scores/scoreTeams";
import { FaTrophy, FaCheck,FaUsers,FaChartBar ,FaSync} from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import axios from "axios";
import { useEventNameContext } from "../../../../../../../context/EventName";
import useEventSchedules from "../../../../../../../hooks/Schedule/EventSchedule";
import useSchedule from "../../../../../../../hooks/Schedule/Schedule"
import { useSearchParams } from "react-router-dom";

const Teamwork = () => {
  const { currentCompetition } = useEventNameContext();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scores, setScores] = useState({});
  const [rankings, setRankings] = useState([]);
  const [tempScores, setTempScores] = useState({});
  const [showRanking, setShowRanking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const token = localStorage.getItem("access_token");
   const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

     const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');


const { 
    schedules: eventSchedules, 
    loading: schedulesLoading, 
    error: schedulesError, 
    refetch: refetchSchedules 
  } = useEventSchedules(event_name, "teamwork", "-id"); // Order by descending ID

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
          <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
            <FaUsers className="w-8 h-8" />
            Teamwork Matches
          </h1>
          <p className="mt-2 text-gray-600">Managing matches for {event_name}</p>
        </div>
        <button
          onClick={handleRefreshSchedule}
          className="h-fit flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <FaSync className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh Schedule</span>
        </button>
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600">
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
              <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center font-medium text-indigo-600">#{match.id}</td>
                
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
                
                <td className="px-4 py-3 text-center font-bold text-indigo-600 text-xl">
                  {tempScores[match.id] ?? scores[match.id] ?? 0}
                </td>
                
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenCalculator(match.id)}
                    className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition-colors"
                  >
                    <AiOutlineCalculator className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Loading State */}
        {(schedulesLoading || scheduleLoading) && (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        )}
        
        {/* Error State */}
        {schedulesError && (
          <div className="p-6 text-center bg-red-50 border-t-4 border-red-300">
            <div className="text-red-600 font-medium">⚠️ Error loading schedule: {schedulesError}</div>
          </div>
        )}
      </div>

      {/* Ranking Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-indigo-600">
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
                        rank <= 3 ? 'border-2' : 'border hover:border-indigo-200'
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
                              : 'bg-indigo-100 text-indigo-600'
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
                        <span className="text-lg font-bold text-indigo-600">
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

      {selectedMatch && (
        <ScoreTeams
          onCalculate={handleCalculate}
          onClose={() => setSelectedMatch(null)}
          gameId={selectedMatch}
          mode="manual"
          eventName={event_name}
        />
      )}
    </div>
  );
};
export default Teamwork;
